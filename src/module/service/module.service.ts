import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostgresErrorCode } from 'src/shared/enums/error-code/postgres.enum';
import { ResponseList } from 'src/shared/interfaces/response-list.interface';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateModuleDto } from '../dto/create-module.dto';
import { ModuleQueryDto } from '../dto/module-query.dto';
import { UpdateModuleDto } from '../dto/update-module.dto';
import { Module } from '../entities/module.entity';

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(Module) private moduleRepo: Repository<Module>,
  ) {}
  async create(createModuleDto: CreateModuleDto, user: User): Promise<Module> {
    const { courseId } = createModuleDto;
    const module = this.moduleRepo.create({
      ...createModuleDto,
      author: { id: user.id },
      course: { id: courseId },
    });
    await this.moduleRepo.save(module);
    return module;
  }

  async findAll(moduleQueryDto: ModuleQueryDto): Promise<ResponseList<Module>> {
    const { page = 1, limit = 5 } = moduleQueryDto;
    const modules = await this.moduleRepo.find({
      skip: page ? page - 1 : page,
      take: limit,
    });
    const totalCount = await this.moduleRepo.countBy({ isPublished: true });
    return {
      data: modules,
      totalCount,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Module | object> {
    const module = await this.moduleRepo.findOne({ where: { id } });
    return module ? module : {};
  }

  async update(id: number, updateModuleDto: UpdateModuleDto): Promise<Module> {
    try {
      const module = await this.moduleRepo.preload({
        id,
        ...updateModuleDto,
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
