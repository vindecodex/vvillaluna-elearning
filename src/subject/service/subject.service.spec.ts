import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Subject } from '../entities/subject.entity';
import { SubjectService } from './subject.service';
import { PostgresErrorCode } from '../../shared/enums/error-code/postgres.enum';

type MockSubjectRepo<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const mockSubjectRepo = (): MockSubjectRepo => ({
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  preload: jest.fn(),
});

describe('SubjectService', () => {
  let subjectService: SubjectService;
  let subjectRepo: MockSubjectRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubjectService,
        { provide: getRepositoryToken(Subject), useFactory: mockSubjectRepo },
      ],
    }).compile();

    subjectService = module.get<SubjectService>(SubjectService);
    subjectRepo = module.get<MockSubjectRepo>(getRepositoryToken(Subject));
  });

  it('should be defined', () => {
    expect(subjectService).toBeDefined();
  });

  describe('subjectService.findOne', () => {
    it('should return subject', async () => {
      const subject = new Subject();
      subjectRepo.findOne.mockResolvedValue(subject);
      const result = await subjectService.findOne(1);
      expect(result).toEqual(subject);
    });

    it('should throw NotFoundException if no subject found', async () => {
      subjectRepo.findOne.mockResolvedValue(false);
      await expect(subjectService.findOne(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('subjectService.create', () => {
    it('should return subject if created successfully', async () => {
      const subject = new Subject();
      const user = new User();
      subjectRepo.create.mockResolvedValue(subject);
      subjectRepo.save.mockResolvedValue(true);
      const result = await subjectService.create({ title: 'test' }, user);
      expect(result).toEqual(subject);
    });

    it('should throw BadRequestException for duplicate subject', async () => {
      const user = new User();
      subjectRepo.create.mockResolvedValue(new Subject());
      subjectRepo.save.mockRejectedValue({ code: PostgresErrorCode.DUPLICATE });
      await expect(
        subjectService.create({ title: 'test' }, user),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('subjectService.update', () => {
    it('should return updated subject', async () => {
      const subject = new Subject();
      const dto = { isPublished: true };
      const updated = { ...subject, ...dto };
      subjectRepo.preload.mockResolvedValue({ ...subject, ...dto });
      subjectRepo.save.mockResolvedValue(true);
      const result = await subjectService.update(1, dto);
      expect(result).toEqual(updated);
    });

    it('should throw NotFoundException if no subject found', async () => {
      subjectRepo.preload.mockResolvedValue(false);
      await expect(
        subjectService.update(1, { isPublished: true }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for duplicate subject', async () => {
      subjectRepo.preload.mockResolvedValue(true);
      subjectRepo.save.mockRejectedValue({ code: PostgresErrorCode.DUPLICATE });
      await expect(
        subjectService.update(1, { isPublished: true }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('subjectService.delete', () => {
    it('should return void for successful deletion', async () => {
      subjectRepo.delete.mockResolvedValue({ affected: 1 });
      const result = await subjectService.delete(1);
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException if no affected rows on deletion', async () => {
      subjectRepo.delete.mockResolvedValue({ affected: 0 });
      await expect(subjectService.delete(1)).rejects.toThrow(NotFoundException);
    });
  });
});
