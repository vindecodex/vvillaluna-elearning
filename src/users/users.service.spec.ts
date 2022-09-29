import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

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

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepo: MockUserRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useFactory: mockUserRepo },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepo = module.get<MockUserRepo>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('usersService.findAll', () => {
    it('should return array of users', async () => {
      const paginationQuery: PaginationQueryDto = { page: 1, limit: 5 };
      const totalCount = 10;
      const expected = {
        data: [mockUser],
        totalCount: totalCount,
        page: paginationQuery.page,
        limit: paginationQuery.limit,
      };
      userRepo.find.mockResolvedValue([mockUser]);
      userRepo.countBy.mockResolvedValue(totalCount);
      const result = await usersService.findAll(paginationQuery);
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

    it('should return empty object if no users found', async () => {
      const expected = {};
      userRepo.findOne.mockResolvedValue(null);
      const result = await usersService.findOne('uuid');
      expect(result).toEqual(expected);
    });

    it('should throw BadRequestException error if id passed is not uuid format', async () => {
      const classValidatorInvalidUUIDErrorCode = '22P02';
      userRepo.findOne.mockRejectedValue({
        code: classValidatorInvalidUUIDErrorCode,
      });
      await expect(usersService.findOne('uuid')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('unhandled error should throw InternalServerErrorException', async () => {
      userRepo.findOne.mockRejectedValue(false);
      await expect(usersService.findOne('uuid')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
