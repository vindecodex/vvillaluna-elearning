import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnrollmentModule } from '../entities/enrollment-module.entity';
import { EnrollmentModuleService } from './enrollment-module.service';
import { QueryOptionsDto } from 'src/shared/dto/query-options.dto';
import { NotFoundException } from '@nestjs/common';

type MockEnrollmentModuleRepo<T = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;
const mockEnrollmentModuleRepo = (): MockEnrollmentModuleRepo => ({
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  count: jest.fn(),
  preload: jest.fn(),
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

  const enrollmentModule = new EnrollmentModule();

  it('should be defined', () => {
    expect(enrollmentModuleService).toBeDefined();
  });

  describe('enrollmentModuleService.create', () => {
    it('should return enrollment module after creation success', async () => {
      enrollmentModuleRepo.create.mockResolvedValue(enrollmentModule);
      enrollmentModuleRepo.save.mockResolvedValue(true);
      const result = await enrollmentModuleService.create({
        moduleId: 1,
        enrollmentId: 1,
      });
      expect(result).toEqual(enrollmentModule);
    });
  });

  describe('enrollmentModuleService.findAll', () => {
    it('should return array of Enrollment Modules', async () => {
      const page = 1;
      const limit = 1;
      const data = [enrollmentModule];
      enrollmentModuleRepo.find.mockResolvedValue(data);
      enrollmentModuleRepo.count.mockResolvedValue(limit);
      const result = await enrollmentModuleService.findAll({
        page,
        limit,
      } as QueryOptionsDto);
      expect(result).toEqual({ data, totalCount: limit, page, limit });
    });
  });

  describe('enrollmentModuleService.findOne', () => {
    it('should return enrollment module', async () => {
      enrollmentModuleRepo.findOne.mockResolvedValue(enrollmentModule);
      const result = await enrollmentModuleService.findOne(1);
      expect(result).toEqual(enrollmentModule);
    });
    it('should throw NotFoundException if no enrollment module found', async () => {
      enrollmentModuleRepo.findOne.mockResolvedValue(false);
      await expect(enrollmentModuleService.findOne(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('enrollmentModuleService.update', () => {
    it('should return updated enrollment module', async () => {
      const updatedEnrollmentModule = {
        ...enrollmentModule,
        isCompleted: true,
      };
      enrollmentModuleRepo.preload.mockResolvedValue(updatedEnrollmentModule);
      enrollmentModuleRepo.save.mockResolvedValue(true);
      const result = await enrollmentModuleService.update(1, {
        isCompleted: true,
      });
      expect(result).toEqual(updatedEnrollmentModule);
    });
  });

  describe('enrollmentModuleService.delete', () => {
    it('should throw NotFoundException if no affected rows on deletion', async () => {
      enrollmentModuleRepo.delete.mockResolvedValue(0);
      await expect(enrollmentModuleService.delete(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
