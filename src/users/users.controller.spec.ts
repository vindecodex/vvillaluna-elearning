import { Test, TestingModule } from '@nestjs/testing';
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
  salt: 'test',
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

  describe('findAll', () => {
    it('should return list of users', async () => {
      const expected = {
        data: [mockUser],
        totalCount: 1,
        page: 1,
        limit: 5,
      };
      usersService.findAll.mockResolvedValue(expected);
      const result = await usersController.findAll();
      expect(result).toBe(expected);
    });
  });

  describe('findOne', () => {
    it('should return user', async () => {
      const expected = mockUser;
      usersService.findOne.mockResolvedValue(expected);
      const result = await usersController.findOne('test');
      expect(result).toBe(expected);
    });
  });
});
