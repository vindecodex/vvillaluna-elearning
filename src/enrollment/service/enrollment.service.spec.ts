import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EnrollmentModule } from '../../enrollment-module/entities/enrollment-module.entity';
import { Module } from '../../module/entities/module.entity';
import { Repository } from 'typeorm';
import { Enrollment } from '../entities/enrollment.entity';
import { EnrollmentService } from './enrollment.service';
import { User } from '../../user/entities/user.entity';
import { PostgresErrorCode } from '../../shared/enums/error-code/postgres.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';

type MockType<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
type MockEnrollmentRepo = MockType;
const mockEnrollmentRepo = (): MockEnrollmentRepo => ({
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
});

type MockEnrollmentModuleRepo = MockType;
const mockEnrollmentModuleRepo = (): MockEnrollmentModuleRepo => ({
  findOneBy: jest.fn(),
  save: jest.fn(),
  preload: jest.fn(),
});

type MockModuleRepo = MockType;
const mockModuleRepo = (): MockModuleRepo => ({
  findBy: jest.fn(),
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

  const enrollment = new Enrollment();
  const enrollmentModule = new EnrollmentModule();
  const module = new Module();
  const user = new User();

  it('should be defined', () => {
    expect(enrollmentService).toBeDefined();
  });

  describe('enrollmentService.create', () => {
    it('should return created enrollment', async () => {
      enrollmentRepo.create.mockResolvedValue(enrollment);
      moduleRepo.findBy.mockResolvedValue([module]);
      enrollmentModuleRepo.save.mockResolvedValue(true);
      enrollmentRepo.save.mockResolvedValue(true);
      const result = await enrollmentService.create({ courseId: 1 }, user);
      expect(result).toEqual(enrollment);
    });

    it('should throw BadRequestException if already enrolled', async () => {
      enrollmentRepo.create.mockResolvedValue(enrollment);
      moduleRepo.findBy.mockResolvedValue([module]);
      enrollmentModuleRepo.save.mockResolvedValue(true);
      enrollmentRepo.save.mockRejectedValue({
        code: PostgresErrorCode.DUPLICATE,
      });
      await expect(
        enrollmentService.create({ courseId: 1 }, user),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if course is not found', async () => {
      enrollmentRepo.create.mockResolvedValue(enrollment);
      moduleRepo.findBy.mockResolvedValue([module]);
      enrollmentModuleRepo.save.mockResolvedValue(true);
      enrollmentRepo.save.mockRejectedValue({
        code: PostgresErrorCode.INVALID_RELATION_KEY,
      });
      await expect(
        enrollmentService.create({ courseId: 1 }, user),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('enrollmentService.findOne', () => {
    it('should return enrollment', async () => {
      enrollmentRepo.findOne.mockResolvedValue(enrollment);
      const result = await enrollmentService.findOne(1);
      expect(result).toEqual(enrollment);
    });

    it('should throw NotFoundException if enrollment is not found', async () => {
      enrollmentRepo.findOne.mockResolvedValue(false);
      await expect(enrollmentService.findOne(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('enrollmentService.update', () => {
    it('should return the updated enrollment', async () => {
      const updatedEnrollment = enrollmentModule;
      enrollmentModuleRepo.findOneBy.mockResolvedValue(true);
      enrollmentModuleRepo.preload.mockResolvedValue(updatedEnrollment);
      enrollmentModuleRepo.save.mockResolvedValue(updatedEnrollment);
      const result = await enrollmentService.update(1, {
        isCompleted: true,
        moduleId: 1,
      });
      expect(result).toEqual(updatedEnrollment);
    });
    it('should throw NotFoundException if enrollment module not found', async () => {
      enrollmentModuleRepo.findOneBy.mockResolvedValue(true);
      enrollmentModuleRepo.preload.mockResolvedValue(true);
      enrollmentModuleRepo.save.mockRejectedValue({
        code: PostgresErrorCode.INVALID_RELATION_KEY,
      });
      await expect(
        enrollmentService.update(1, { isCompleted: true, moduleId: 1 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('enrollmentService.delete', () => {
    it('should throw NotFoundException if no affected rows on deletion', async () => {
      enrollmentRepo.delete.mockResolvedValue({ affected: 0 });
      await expect(enrollmentService.delete(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
