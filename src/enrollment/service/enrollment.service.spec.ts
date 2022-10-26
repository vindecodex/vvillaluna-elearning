import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EnrollmentModule } from '../../enrollment-module/entities/enrollment-module.entity';
import { Module } from '../../module/entities/module.entity';
import { Repository } from 'typeorm';
import { Enrollment } from '../entities/enrollment.entity';
import { EnrollmentService } from './enrollment.service';

type MockType<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
type MockEnrollmentRepo = MockType;
const mockEnrollmentRepo = (): MockEnrollmentRepo => ({
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

type MockEnrollmentModuleRepo = MockType;
const mockEnrollmentModuleRepo = (): MockEnrollmentModuleRepo => ({
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

type MockModuleRepo = MockType;
const mockModuleRepo = (): MockModuleRepo => ({
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('EnrollmentService', () => {
  let enrollmentService: EnrollmentService;
  let enrollmentRepo: MockEnrollmentRepo;
  let enrollmentModuleRepo: MockEnrollmentModuleRepo;
  let moduleRepo: MockModuleRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentService,
        {
          provide: getRepositoryToken(Enrollment),
          useFactory: mockEnrollmentRepo,
        },
        {
          provide: getRepositoryToken(EnrollmentModule),
          useFactory: mockEnrollmentModuleRepo,
        },
        {
          provide: getRepositoryToken(Module),
          useFactory: mockModuleRepo,
        },
      ],
    }).compile();

    enrollmentService = module.get<EnrollmentService>(EnrollmentService);
    enrollmentRepo = module.get<MockEnrollmentRepo>(
      getRepositoryToken(Enrollment),
    );
    enrollmentModuleRepo = module.get<MockEnrollmentModuleRepo>(
      getRepositoryToken(EnrollmentModule),
    );
    moduleRepo = module.get<MockModuleRepo>(getRepositoryToken(Module));
  });

  it('should be defined', () => {
    expect(enrollmentService).toBeDefined();
  });
});
