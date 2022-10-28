import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostgresErrorCode } from '../../shared/enums/error-code/postgres.enum';
import { User } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateContentDto } from '../dto/create-content.dto';
import { Content } from '../entities/content.entity';
import { ContentService } from './content.service';
import { UpdateContentDto } from '../dto/update-content.dto';

type MockContentRepo<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const mockContentRepo = (): MockContentRepo => ({
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  preload: jest.fn(),
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

  const user = new User();
  const content = new Content();

  it('should be defined', () => {
    expect(contentService).toBeDefined();
  });

  describe('contentService.create', () => {
    it('should return the created content', async () => {
      const dto = new CreateContentDto();
      contentRepo.create.mockResolvedValue(content);
      contentRepo.save.mockResolvedValue(true);
      const result = await contentService.create(dto, user);
      expect(result).toEqual(content);
    });

    it('should throw BadRequestException for existing content', async () => {
      const dto = new CreateContentDto();
      contentRepo.create.mockResolvedValue(content);
      contentRepo.save.mockRejectedValue({ code: PostgresErrorCode.DUPLICATE });
      await expect(contentService.create(dto, user)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if related module not found', async () => {
      const dto = new CreateContentDto();
      contentRepo.create.mockResolvedValue(content);
      contentRepo.save.mockRejectedValue({
        code: PostgresErrorCode.INVALID_RELATION_KEY,
      });
      await expect(contentService.create(dto, user)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
  describe('contentService.findOne', () => {
    it('should return content', async () => {
      contentRepo.findOne.mockResolvedValue(content);
      const result = await contentService.findOne(1);
      expect(result).toEqual(content);
    });

    it('should throw NotFoundException if no content found', async () => {
      contentRepo.findOne.mockResolvedValue(false);
      await expect(contentService.findOne(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
  describe('contentService.update', () => {
    it('should return updated content', async () => {
      const dto = new UpdateContentDto();
      const updatedContent = { ...content, ...dto };
      contentRepo.preload.mockResolvedValue(updatedContent);
      contentRepo.save.mockResolvedValue(true);
      const result = await contentService.update(1, dto);
      expect(result).toEqual(updatedContent);
    });

    it('should throw NotFoundException if no content found', async () => {
      const dto = new UpdateContentDto();
      contentRepo.preload.mockResolvedValue(false);
      await expect(contentService.update(1, dto)).rejects.toThrow(
        NotFoundException,
      );
    });
    it('should throw BadRequestException for duplicate content', async () => {
      const dto = new UpdateContentDto();
      contentRepo.preload.mockResolvedValue(true);
      contentRepo.save.mockRejectedValue({ code: PostgresErrorCode.DUPLICATE });
      await expect(contentService.update(1, dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
  describe('contentService.delete', () => {
    it('should throw NotFoundException if no content found', async () => {
      contentRepo.delete.mockResolvedValue({ affected: 0 });
      await expect(contentService.delete(1)).rejects.toThrow(NotFoundException);
    });
  });
});
