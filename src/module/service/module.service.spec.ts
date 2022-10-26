import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module } from '../entities/module.entity';
import { ModuleService } from './module.service';

type MockModuleRepo<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const mockModuleRepo = (): MockModuleRepo => ({
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('ModuleService', () => {
  let moduleService: ModuleService;
  let moduleRepo: MockModuleRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModuleService,
        { provide: getRepositoryToken(Module), useFactory: mockModuleRepo },
      ],
    }).compile();

    moduleService = module.get<ModuleService>(ModuleService);
    moduleRepo = module.get<MockModuleRepo>(getRepositoryToken(Module));
  });

  it('should be defined', () => {
    expect(moduleService).toBeDefined();
  });
});
