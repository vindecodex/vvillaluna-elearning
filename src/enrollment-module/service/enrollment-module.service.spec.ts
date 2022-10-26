import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnrollmentModule } from '../entities/enrollment-module.entity';
import { EnrollmentModuleService } from './enrollment-module.service';

type MockEnrollmentModuleRepo<T = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;
const mockEnrollmentModuleRepo = (): MockEnrollmentModuleRepo => ({
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('EnrollmentModuleService', () => {
  let enrollmentModuleService: EnrollmentModuleService;
  let enrollmentModuleRepo: MockEnrollmentModuleRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentModuleService,
        {
          provide: getRepositoryToken(EnrollmentModule),
          useFactory: mockEnrollmentModuleRepo,
        },
      ],
    }).compile();

    enrollmentModuleService = module.get<EnrollmentModuleService>(
      EnrollmentModuleService,
    );
    enrollmentModuleRepo = module.get<MockEnrollmentModuleRepo>(
      getRepositoryToken(EnrollmentModule),
    );
  });

  it('should be defined', () => {
    expect(enrollmentModuleService).toBeDefined();
  });
});
