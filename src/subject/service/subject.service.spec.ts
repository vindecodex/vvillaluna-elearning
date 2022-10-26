import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from '../entities/subject.entity';
import { SubjectService } from './subject.service';

type MockSubjectRepo<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const mockSubjectRepo = (): MockSubjectRepo => ({
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
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
});
