import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { Response } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { AuthService } from '../service/auth.service';
import { UserCredentialsDto } from '../dto/user-credentials.dto';
import { AuthenticateDto } from '../dto/authenticate.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ResendVerificationDto } from '../dto/resend-verification.dto';

type MockAuthService<T = any> = Partial<Record<keyof T, jest.Mock>> | T;
const mockAuthService = (): MockAuthService => ({
  createUser: jest.fn(),
  authenticate: jest.fn(),
  requestResetPassword: jest.fn(),
  resetPassword: jest.fn(),
  verifyUser: jest.fn(),
  resendVerificationEmail: jest.fn(),
});

const mockUser: User = {
  id: 'test',
  email: 'test',
  password: 'test',
  salt: 'test',
  firstName: 'test',
  lastName: 'test',
  role: 'test',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const MockResponse: Partial<Response> = {
  clearCookie: jest.fn().mockResolvedValue(true),
};
const response = MockResponse as Response;

describe('AuthController', () => {
  let authController: AuthController;
  let authService: MockAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useFactory: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<MockAuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('authController.createUser', () => {
    it('should return user info if successful signup', async () => {
      const userCredentialsDto: UserCredentialsDto = {
        email: 'test@test.com',
        password: 'test',
        verifyPassword: 'test',
        role: 'test',
        firstName: 'test',
        lastName: 'test',
      };
      authService.createUser.mockResolvedValue(mockUser);
      const result = await authController.createUser(userCredentialsDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('authController.authenticate', () => {
    it('should return user info with access token if successful login', async () => {
      const authenticateDto: AuthenticateDto = {
        email: 'test@gmail.com',
        password: 'test',
      };
      const expected = {
        ...mockUser,
        accessToken: 'test',
      };
      authService.authenticate.mockResolvedValue(expected);
      const result = await authController.authenticate(
        authenticateDto,
        response,
      );
      expect(result).toEqual(expected);
    });
  });

  describe('authController.logout', () => {
    it('should throw UnauthorizedException if no authorization header token', async () => {
      expect(() => authController.logout(null, response)).toThrow(
        UnauthorizedException,
      );
    });

    it('should return success object message if logout successful', async () => {
      const expected = {
        status: 'success',
        message: "You've been logged out!",
      };
      const result = authController.logout(mockUser, response);
      expect(result).toEqual(expected);
    });
  });

  describe('authController.requestResetPassword', () => {
    it('should return true if success', async () => {
      authService.requestResetPassword.mockResolvedValue(true);
      const result = await authController.requestResetPassword('test@test.com');
      expect(result).toBeTruthy();
    });
  });

  describe('authController.resetPassword', () => {
    it('should return status success if successful', async () => {
      const expected = { status: 'success' };
      const resetPasswordDto: ResetPasswordDto = {
        password: 'test',
        verifyPassword: 'test',
      };
      authService.resetPassword.mockResolvedValue(expected);
      const result = await authController.resetPassword(
        mockUser,
        resetPasswordDto,
      );
      expect(result).toEqual(expected);
    });
  });

  describe('authController.verifyUser', () => {
    it('should return true if success', async () => {
      authService.verifyUser.mockResolvedValue(true);
      const result = await authController.verifyUser(mockUser);
      expect(result).toBeTruthy();
    });
  });

  describe('authController.resendVerification', () => {
    it('', async () => {
      const resendVerificationDto: ResendVerificationDto = {
        email: 'test@test.com',
      };
      authService.resendVerificationEmail.mockResolvedValue(true);
      const result = await authController.resendVerification(
        resendVerificationDto,
      );
      expect(result).toBeTruthy();
    });
  });
});
