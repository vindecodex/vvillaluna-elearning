import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../entities/course.entity';
import { CourseService } from './course.service';

type MockCourseRepo<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const mockCourseRepo = (): MockCourseRepo => ({
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
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

  it('should be defined', () => {
    expect(courseService).toBeDefined();
  });
});
