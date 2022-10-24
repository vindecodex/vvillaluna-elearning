import { Test, TestingModule } from '@nestjs/testing';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { UserService } from '../service/user.service';
import { UserController } from './user.controller';

type MockuserService<T = any> = Partial<Record<keyof T, jest.Mock>> | T;
const mockUserService = (): MockuserService => ({
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
  let userController: UserController;
  let userService: MockuserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useFactory: mockUserService,
        },
      ],
    }).compile();
    userController = module.get<UserController>(UserController);
    userService = module.get<MockuserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('userController.findAll', () => {
    it('should return list of users', async () => {
      const paginationQuery: PaginationQueryDto = { page: 1, limit: 5 };
      const expected = {
        data: [mockUser],
        totalCount: 1,
        page: paginationQuery.page,
        limit: paginationQuery.limit,
      };
      userService.findAll.mockResolvedValue(expected);
      const result = await userController.findAll(paginationQuery);
      expect(result).toBe(expected);
    });
  });

  describe('userController.findOne', () => {
    it('should return user', async () => {
      const expected = mockUser;
      userService.findOne.mockResolvedValue(expected);
      const result = await userController.findOne('test');
      expect(result).toBe(expected);
    });
  });
});
