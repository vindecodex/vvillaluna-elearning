import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from '../entities/content.entity';
import { ContentService } from './content.service';

type MockContentRepo<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const mockContentRepo = (): MockContentRepo => ({
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('ContentService', () => {
  let contentService: ContentService;
  let contentRepo: MockContentRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        { provide: getRepositoryToken(Content), useFactory: mockContentRepo },
      ],
    }).compile();

    contentService = module.get<ContentService>(ContentService);
    contentRepo = module.get<MockContentRepo>(getRepositoryToken(Content));
  });

  it('should be defined', () => {
    expect(contentService).toBeDefined();
  });
});
