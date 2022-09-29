import { Test, TestingModule } from '@nestjs/testing';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

type MockUsersService<T = any> = Partial<Record<keyof T, jest.Mock>> | T;
const mockUsersService = (): MockUsersService => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
});

const mockUser = {
  id: '1',
  email: 'test@gmail.com',
  firstName: 'test',
  lastName: 'test',
  role: 'test',
};

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: MockUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useFactory: mockUsersService,
        },
      ],
    }).compile();
    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<MockUsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('usersController.findAll', () => {
    it('should return list of users', async () => {
      const paginationQuery: PaginationQueryDto = { page: 1, limit: 5 };
      const expected = {
        data: [mockUser],
        totalCount: 1,
        page: paginationQuery.page,
        limit: paginationQuery.limit,
      };
      usersService.findAll.mockResolvedValue(expected);
      const result = await usersController.findAll(paginationQuery);
      expect(result).toBe(expected);
    });
  });

  describe('usersController.findOne', () => {
    it('should return user', async () => {
      const expected = mockUser;
      usersService.findOne.mockResolvedValue(expected);
      const result = await usersController.findOne('test');
      expect(result).toBe(expected);
    });
  });
});
