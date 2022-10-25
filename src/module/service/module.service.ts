import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostgresErrorCode } from 'src/shared/enums/error-code/postgres.enum';
import { buildQueryFrom } from 'src/shared/helpers/database/build-query-from.helper';
import { paginateBuilder } from 'src/shared/helpers/database/paginate-builder.helper';
import { ResponseList } from 'src/shared/interfaces/response-list.interface';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateModuleDto } from '../dto/create-module.dto';
import { ModuleQueryDto } from '../dto/module-query.dto';
import { UpdateModuleDto } from '../dto/update-module.dto';
import { Module } from '../entities/module.entity';
import { joinBuilder } from '../helpers/join-builder.helper';
import { sortBuilder } from '../helpers/sort-builder.helper';
import { whereBuilder } from '../helpers/where-builder.helper';

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(Module) private moduleRepo: Repository<Module>,
  ) {}
  async create(dto: CreateModuleDto, user: User): Promise<Module> {
    const { courseId } = dto;
    const module = this.moduleRepo.create({
      ...dto,
      author: { id: user.id },
      course: { id: courseId },
    });
    await this.moduleRepo.save(module);
    return module;
  }

  async findAll(dto: ModuleQueryDto): Promise<ResponseList<Module>> {
    const { page, limit } = dto;

    const queryBuilder = this.moduleRepo.createQueryBuilder('module');
    buildQueryFrom<Module, ModuleQueryDto>(queryBuilder, dto).apply(
      joinBuilder,
      sortBuilder,
      whereBuilder,
      paginateBuilder,
    );

    const [modules, totalCount] = await queryBuilder.getManyAndCount();

    return {
      data: modules,
      totalCount,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Module | object> {
    const module = await this.moduleRepo.findOne({
      where: { id },
      relations: { author: true },
    });
    return module ? module : {};
  }

  async update(id: number, dto: UpdateModuleDto): Promise<Module> {
    try {
      const module = await this.moduleRepo.preload({
        id,
        ...dto,
      });
      if (!module) throw new NotFoundException('Module not found.');
      await this.moduleRepo.save(module);
      return module;
    } catch (e) {
      if (e.code === PostgresErrorCode.DUPLICATE)
        throw new BadRequestException('Title already exist');
      throw e;
    }
  }

  async delete(id: number): Promise<void> {
    const { affected } = await this.moduleRepo.delete(id);
    if (affected > 0) return;
    throw new NotFoundException('Module not found.');
  }
}
