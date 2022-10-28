import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Course } from '../entities/course.entity';
import { CourseService } from './course.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from '../dto/create-course.dto';
import { PostgresErrorCode } from '../../shared/enums/error-code/postgres.enum';
import { UpdateCourseDto } from '../dto/update-course.dto';

type MockCourseRepo<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const mockCourseRepo = (): MockCourseRepo => ({
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  preload: jest.fn(),
});

describe('CourseService', () => {
  let courseService: CourseService;
  let courseRepo: MockCourseRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        { provide: getRepositoryToken(Course), useFactory: mockCourseRepo },
      ],
    }).compile();

    courseService = module.get<CourseService>(CourseService);
    courseRepo = module.get<MockCourseRepo>(getRepositoryToken(Course));
  });

  const course = new Course();
  const user = new User();

  it('should be defined', () => {
    expect(courseService).toBeDefined();
  });

  describe('courseService.findOne', () => {
    it('should return course', async () => {
      courseRepo.findOne.mockResolvedValue(course);
      const result = await courseService.findOne(1);
      expect(result).toEqual(course);
    });

    it('should throw NotFoundException if no course found', async () => {
      courseRepo.findOne.mockResolvedValue(false);
      await expect(courseService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('courseService.create', () => {
    it('should return created course', async () => {
      const dto = new CreateCourseDto();
      courseRepo.create.mockResolvedValue(course);
      courseRepo.save.mockResolvedValue(true);
      const result = await courseService.create(dto, user);
      expect(result).toEqual(course);
    });

    it('should throw BadRequestException for already exist course', async () => {
      const dto = new CreateCourseDto();
      courseRepo.create.mockResolvedValue(course);
      courseRepo.save.mockRejectedValue({ code: PostgresErrorCode.DUPLICATE });
      await expect(courseService.create(dto, user)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if related subject not found', async () => {
      const dto = new CreateCourseDto();
      courseRepo.create.mockResolvedValue(course);
      courseRepo.save.mockRejectedValue({
        code: PostgresErrorCode.INVALID_RELATION_KEY,
      });
      await expect(courseService.create(dto, user)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('courseService.update', () => {
    it('should return the updated course', async () => {
      const dto = new UpdateCourseDto();
      const updatedCourse = { ...course, ...dto };
      courseRepo.preload.mockResolvedValue(updatedCourse);
      courseRepo.save.mockResolvedValue(true);
      const result = await courseService.update(1, dto);
      expect(result).toEqual(updatedCourse);
    });

    it('should throw NotFoundException if no course found', async () => {
      const dto = new UpdateCourseDto();
      courseRepo.preload.mockResolvedValue(false);
      await expect(courseService.update(1, dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if course already exist', async () => {
      const dto = new UpdateCourseDto();
      courseRepo.preload.mockResolvedValue(true);
      courseRepo.save.mockRejectedValue({ code: PostgresErrorCode.DUPLICATE });
      await expect(courseService.update(1, dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('courseService.delete', () => {
    it('should return NotFoundException if no affected rows on deletion', async () => {
      courseRepo.delete.mockResolvedValue({ affected: 0 });
      await expect(courseService.delete(1)).rejects.toThrow(NotFoundException);
    });
  });
});
