import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';
import { AuthService } from './auth.service';
import { MailService } from '../../mail/mail.service';
import { UserCredentialsDto } from '../dto/user-credentials.dto';
import { AuthenticateDto } from '../dto/authenticate.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';

type MockType<T = any> = Partial<Record<keyof T, jest.Mock>> | T;
type MockUserRepo = MockType;
type MockMailService = MockType;
type MockJwtService = MockType;
const mockUserRepo = (): MockUserRepo => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  preload: jest.fn(),
});
const mockMailService = (): MockMailService => ({
  sendVerification: jest.fn(),
});
const mockJwtService = (): MockJwtService => ({
  sign: jest.fn(),
});
const MockResponse: Partial<Response> = {
  cookie: jest.fn().mockResolvedValue(true),
};
const response = MockResponse as Response;
const hashedPassword =
  '$2b$12$rhlfmgx1G82T3sQOMCUMn.aQrt3vrtFZNFv.xa1XaHEqFgSyIBxuC';
const user: Partial<User> = {
  id: '1',
  email: 'test@test.com',
  password: hashedPassword,
  firstName: 'test',
  lastName: 'test',
  role: 'test',
  isActive: true,
};

describe('AuthService', () => {
  let authService: AuthService;
  let userRepo: MockUserRepo;
  let mailService: MockMailService;
  let jwtService: MockJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useFactory: mockUserRepo },
        { provide: MailService, useFactory: mockMailService },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepo = module.get<MockUserRepo>(getRepositoryToken(User));
    mailService = module.get<MockMailService>(MailService);
    jwtService = module.get<MockJwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('authService.createUser', () => {
    const userCredentialsDto: UserCredentialsDto = {
      email: 'test',
      password: 'test',
      verifyPassword: 'test',
      role: 'test',
      firstName: 'test',
      lastName: 'test',
    };
    it('should return user info when successful creation', async () => {
      userRepo.create.mockResolvedValue(userCredentialsDto);
      userRepo.save.mockResolvedValue(userCredentialsDto);
      jwtService.sign.mockResolvedValue('test');
      mailService.sendVerification.mockResolvedValue('test');
      const result = await authService.createUser(userCredentialsDto);
      expect(result).toEqual(userCredentialsDto);
    });

    it('should throw error if password and verifyPassword did not match', async () => {
      const user = { ...userCredentialsDto, verifyPassword: 'changed' };
      await expect(authService.createUser(user)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw error if user already exist', async () => {
      const ErrorCodePostgresDuplicate = '23505';
      userRepo.create.mockResolvedValue(userCredentialsDto);
      userRepo.save.mockRejectedValue({ code: ErrorCodePostgresDuplicate });
      await expect(authService.createUser(userCredentialsDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException for unhandled error', async () => {
      await expect(authService.createUser(userCredentialsDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('authService.authenticate', () => {
    const authenticateDto: AuthenticateDto = {
      email: 'test@test.com',
      password: '12345',
    };

    it('should return user object with accessToken if successful login', async () => {
      const expected = {
        accessToken: 'test',
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      };
      userRepo.findOne.mockResolvedValue(user);
      jwtService.sign.mockReturnValue('test');
      const result = await authService.authenticate(authenticateDto, response);
      expect(result).toEqual(expected);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      userRepo.findOne.mockResolvedValue(false);
      await expect(
        authService.authenticate(authenticateDto, response),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if invalid credentials', async () => {
      const wrongCredentials = { ...authenticateDto, password: 'wrong' };
      userRepo.findOne.mockResolvedValue(user);
      await expect(
        authService.authenticate(wrongCredentials, response),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw BadRequestException if user is not yet verfied', async () => {
      const notVerifiedUser = { ...user, isActive: false };
      userRepo.findOne.mockResolvedValue(notVerifiedUser);
      await expect(
        authService.authenticate(authenticateDto, response),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('authService.resetPassword', () => {
    const resetPasswordDto: ResetPasswordDto = {
      password: 'test',
      verifyPassword: 'test',
    };

    it('should return success for successful reset password', async () => {
      userRepo.preload.mockResolvedValue(true);
      userRepo.save.mockResolvedValue(true);
      const result = await authService.resetPassword(
        user as User,
        resetPasswordDto,
      );
      const expected = { status: 'success' };
      expect(result).toEqual(expected);
    });

    it('should throw BadRequestException if password and verifyPassword did not match', async () => {
      const invalidResetPassword: ResetPasswordDto = {
        password: 'a',
        verifyPassword: 'b',
      };
      await expect(
        authService.resetPassword(user as User, invalidResetPassword),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException if requester is not a valid user', async () => {
      userRepo.preload.mockResolvedValue(false);
      await expect(
        authService.resetPassword(user as User, resetPasswordDto),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('authService.requestResetPassword', () => {
    it('should throw BadRequestException if email was not provided', async () => {
      await expect(authService.requestResetPassword(null)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
