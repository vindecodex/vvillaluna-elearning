import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryOptionsDto } from '../../shared/dto/query-options.dto';
import { PostgresErrorCode } from '../../shared/enums/error-code/postgres.enum';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';

type MockUserRepo<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const mockUserRepo = (): MockUserRepo => ({
  find: jest.fn(),
  findOne: jest.fn(),
  countBy: jest.fn(),
});

const mockUser = {
  id: '1',
  email: 'test@gmail.com',
  firstName: 'test',
  lastName: 'test',
  salt: 'test',
  role: 'test',
};

describe('UserService', () => {
  let usersService: UserService;
  let userRepo: MockUserRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useFactory: mockUserRepo },
      ],
    }).compile();

    usersService = module.get<UserService>(UserService);
    userRepo = module.get<MockUserRepo>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('usersService.findAll', () => {
    it('should return array of users', async () => {
      const paginationQuery: Partial<QueryOptionsDto> = { page: 1, limit: 5 };
      const totalCount = 10;
      const expected = {
        data: [mockUser],
        totalCount: totalCount,
        page: paginationQuery.page,
        limit: paginationQuery.limit,
      };
      userRepo.find.mockResolvedValue([mockUser]);
      userRepo.countBy.mockResolvedValue(totalCount);
      const result = await usersService.findAll(
        paginationQuery as QueryOptionsDto,
      );
      expect(result).toEqual(expected);
    });
  });

  describe('usersService.findOne', () => {
    it('should return user details', async () => {
      const expected = mockUser;
      userRepo.findOne.mockResolvedValue(expected);
      const result = await usersService.findOne('uuid');
      expect(result).toEqual(expected);
    });

    it('should throw BadRequestException if no users found', async () => {
      userRepo.findOne.mockResolvedValue(null);
      await expect(usersService.findOne('uuid')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException error if id passed is not uuid format', async () => {
      userRepo.findOne.mockRejectedValue({
        code: PostgresErrorCode.INVALID_INPUT,
      });
      await expect(usersService.findOne('uuid')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException for unhandled error', async () => {
      userRepo.findOne.mockRejectedValue(new InternalServerErrorException());
      await expect(usersService.findOne('uuid')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
