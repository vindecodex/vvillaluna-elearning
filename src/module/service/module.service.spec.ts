import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateModuleDto } from '../dto/create-module.dto';
import { Module } from '../entities/module.entity';
import { ModuleService } from './module.service';
import { PostgresErrorCode } from '../../shared/enums/error-code/postgres.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ModuleQueryDto } from '../dto/module-query.dto';

type MockModuleRepo<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const mockModuleRepo = (): MockModuleRepo => ({
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  preload: jest.fn(),
  createQueryBuilder: jest.fn(),
});

describe('ModuleService', () => {
  let moduleService: ModuleService;
  let moduleRepo: MockModuleRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModuleService,
        { provide: getRepositoryToken(Module), useFactory: mockModuleRepo },
      ],
    }).compile();

    moduleService = module.get<ModuleService>(ModuleService);
    moduleRepo = module.get<MockModuleRepo>(getRepositoryToken(Module));
  });

  it('should be defined', () => {
    expect(moduleService).toBeDefined();
  });

  describe('moduleService.create', () => {
    const user = new User();
    const module = new Module();
    const dto: Partial<CreateModuleDto> = { courseId: 1 };

    it('should return module after creation success', async () => {
      moduleRepo.create.mockResolvedValue(module);
      moduleRepo.save.mockResolvedValue(true);
      const result = await moduleService.create(dto as CreateModuleDto, user);
      expect(result).toEqual(module);
    });

    it('should throw NotFoundException for invalid course relation', async () => {
      moduleRepo.create.mockResolvedValue(true);
      moduleRepo.save.mockRejectedValue({
        code: PostgresErrorCode.INVALID_RELATION_KEY,
      });
      await expect(
        moduleService.create(dto as CreateModuleDto, user),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for already exist module', async () => {
      moduleRepo.create.mockResolvedValue(true);
      moduleRepo.save.mockRejectedValue({
        code: PostgresErrorCode.DUPLICATE,
      });
      await expect(
        moduleService.create(dto as CreateModuleDto, user),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('moduleService.findAll', () => {
    it('should return ResponseList type Module', async () => {
      const qb = {
        leftJoin: jest.fn().mockReturnValue(true),
        leftJoinAndSelect: jest.fn().mockReturnValue(true),
        orderBy: jest.fn().mockReturnValue(true),
        where: jest.fn().mockReturnValue(true),
        andWhere: jest.fn().mockReturnValue(true),
        take: jest
          .fn()
          .mockReturnValue({ skip: jest.fn().mockReturnValue(true) }),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };
      moduleRepo.createQueryBuilder.mockReturnValue(qb);
      const result = await moduleService.findAll(new ModuleQueryDto());
      expect(result).toEqual({ data: [], totalCount: 0, page: 1, limit: 25 });
    });
  });

  describe('moduleService.findOne', () => {
    const module = new Module();

    it('should return module', async () => {
      moduleRepo.findOne.mockResolvedValue(module);
      const result = await moduleService.findOne(1);
      expect(result).toEqual(module);
    });

    it('should throw NotFoundException if no module found', async () => {
      moduleRepo.findOne.mockResolvedValue(false);
      await expect(moduleService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('moduleService.update', () => {
    const module = new Module();
    const dto = { isPublished: true };

    it('should return updated module', async () => {
      const updatedModule = { ...module, ...dto };
      moduleRepo.preload.mockResolvedValue(updatedModule);
      moduleRepo.save.mockResolvedValue(true);
      const result = await moduleService.update(1, dto);
      expect(result).toEqual(updatedModule);
    });

    it('should throw NotFoundException if no module found', async () => {
      moduleRepo.preload.mockResolvedValue(false);
      await expect(moduleService.update(1, dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if title duplicated', async () => {
      moduleRepo.preload.mockResolvedValue(true);
      moduleRepo.save.mockRejectedValue({ code: PostgresErrorCode.DUPLICATE });
      await expect(moduleService.update(1, dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('moduleService.delete', () => {
    it('should return NotFoundException if no affected rows on deletion', async () => {
      moduleRepo.delete.mockResolvedValue(0);
      await expect(moduleService.delete(1)).rejects.toThrow(NotFoundException);
    });
  });
});
