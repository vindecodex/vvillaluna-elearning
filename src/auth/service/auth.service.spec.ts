import {
  BadRequestException,
  CACHE_MANAGER,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';
import { AuthService } from './auth.service';
import { MailService } from '../../mail/mail.service';
import { UserCredentialsDto } from '../dto/user-credentials.dto';
import { AuthenticateDto } from '../dto/authenticate.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { Role } from '../../authorization/enums/role.enum';
import { PostgresErrorCode } from '../../shared/enums/error-code/postgres.enum';

// AuthService Dependency Mocks
type MockType<T = any> = Partial<Record<keyof T, jest.Mock>> | T;

type MockUserRepo = MockType;
const mockUserRepo = (): MockUserRepo => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  preload: jest.fn(),
});

type MockMailService = MockType;
const mockMailService = (): MockMailService => ({
  sendVerification: jest.fn(),
});

type MockJwtService = MockType;
const mockJwtService = (): MockJwtService => ({
  sign: jest.fn(),
});

type MockCacheService = MockType;
const mockCacheService = (): MockCacheService => ({
  get: jest.fn(),
  set: jest.fn(),
});

const hashedPassword =
  '$2b$12$rhlfmgx1G82T3sQOMCUMn.aQrt3vrtFZNFv.xa1XaHEqFgSyIBxuC';
const demoUser: Partial<User> = {
  id: '1',
  email: 'test@test.com',
  password: hashedPassword,
  firstName: 'test',
  lastName: 'test',
  role: Role.ADMIN,
  isActive: true,
};

describe('AuthService', () => {
  let authService: AuthService;
  let userRepo: MockUserRepo;
  let mailService: MockMailService;
  let jwtService: MockJwtService;
  let cacheService: MockCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useFactory: mockUserRepo },
        { provide: MailService, useFactory: mockMailService },
        { provide: JwtService, useFactory: mockJwtService },
        { provide: CACHE_MANAGER, useFactory: mockCacheService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepo = module.get<MockUserRepo>(getRepositoryToken(User));
    mailService = module.get<MockMailService>(MailService);
    jwtService = module.get<MockJwtService>(JwtService);
    cacheService = module.get<MockCacheService>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('authService.createUser', () => {
    const dto: UserCredentialsDto = {
      email: 'test',
      password: 'test',
      verifyPassword: 'test',
      role: Role.STUDENT,
      firstName: 'test',
      lastName: 'test',
    };

    it('should return user info when successful creation', async () => {
      userRepo.create.mockResolvedValue(dto);
      userRepo.save.mockResolvedValue(dto);
      jwtService.sign.mockResolvedValue(true);
      mailService.sendVerification.mockResolvedValue(true);
      const result = await authService.createUser(dto);
      expect(result).toEqual(dto);
    });

    it('should throw error if user already exist', async () => {
      userRepo.create.mockResolvedValue(dto);
      userRepo.save.mockRejectedValue({ code: PostgresErrorCode.DUPLICATE });
      await expect(authService.createUser(dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException for unhandled error', async () => {
      await expect(authService.createUser(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('authService.authenticate', () => {
    const dto: AuthenticateDto = {
      email: 'test@test.com',
      password: '12345',
    };

    it('should return user object with accessToken if successful login', async () => {
      const expected = {
        accessToken: 'token',
        id: demoUser.id,
        email: demoUser.email,
        firstName: demoUser.firstName,
        lastName: demoUser.lastName,
        role: demoUser.role,
      };
      userRepo.findOne.mockResolvedValue(demoUser);
      jwtService.sign.mockReturnValue(expected.accessToken);
      const result = await authService.authenticate(dto);
      expect(result).toEqual(expected);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      userRepo.findOne.mockResolvedValue(false);
      await expect(authService.authenticate(dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if invalid credentials', async () => {
      const wrongCredentials = { ...dto, password: 'wrong' };
      userRepo.findOne.mockResolvedValue(demoUser);
      await expect(authService.authenticate(wrongCredentials)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw BadRequestException if user is not yet verfied', async () => {
      const notVerifiedUser = { ...demoUser, isActive: false };
      userRepo.findOne.mockResolvedValue(notVerifiedUser);
      await expect(authService.authenticate(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('authService.logout', () => {
    it('should return success message if logout successful', async () => {
      const expected = {
        status: 'success',
        message: "You've been logged out!",
      };
      cacheService.get.mockResolvedValue(false);
      const result = await authService.logout('token');
      expect(result).toEqual(expected);
    });

    it('should throw UnauthorizedException if token is blocklisted', async () => {
      cacheService.get.mockResolvedValue(true);
      await expect(authService.logout('token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('authService.resetPassword', () => {
    const dto: ResetPasswordDto = {
      password: 'test',
      verifyPassword: 'test',
    };

    it('should return success for successful reset password', async () => {
      userRepo.preload.mockResolvedValue(true);
      userRepo.save.mockResolvedValue(true);
      const result = await authService.resetPassword(demoUser as User, dto);
      const expected = { status: 'success' };
      expect(result).toEqual(expected);
    });

    it('should throw UnauthorizedException if requester is not a valid user', async () => {
      userRepo.preload.mockResolvedValue(false);
      await expect(
        authService.resetPassword(demoUser as User, dto),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
