import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryOptionsDto } from 'src/shared/dto/query-options.dto';
import { ResponseList } from 'src/shared/interfaces/response-list.interface';
import { Repository } from 'typeorm';
import { CreateEnrollmentModuleDto } from '../dto/create-enrollment-module.dto';
import { UpdateEnrollmentModuleDto } from '../dto/update-enrollment-module.dto';
import { EnrollmentModule } from '../entities/enrollment-module.entity';

@Injectable()
export class EnrollmentModuleService {
  constructor(
    @InjectRepository(EnrollmentModule)
    private enrollmentModuleRepo: Repository<EnrollmentModule>,
  ) {}

  async create(
    createEnrollmentModuleDto: CreateEnrollmentModuleDto,
  ): Promise<EnrollmentModule> {
    const { enrollmentId, moduleId } = createEnrollmentModuleDto;
    const enrollmentModule = this.enrollmentModuleRepo.create({
      enrollment: { id: enrollmentId },
      module: { id: moduleId },
    });
    await this.enrollmentModuleRepo.save(enrollmentModule);
    return enrollmentModule;
  }

  async findAll(
    queryOptionsDto: QueryOptionsDto,
  ): Promise<ResponseList<EnrollmentModule>> {
    const { page, limit } = queryOptionsDto;
    const enrollmentModules = await this.enrollmentModuleRepo.find({
      skip: page - 1,
      take: limit,
    });
    const totalCount = await this.enrollmentModuleRepo.count();
    return {
      data: enrollmentModules,
      totalCount,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<EnrollmentModule> {
    try {
      const enrollmentModule = await this.enrollmentModuleRepo.findOne({
        where: { id },
      });

      if (!enrollmentModule)
        throw new NotFoundException('Enrollment module not found.');

      return enrollmentModule;
    } catch (e) {
      throw e;
    }
  }

  async update(
    id: number,
    updateEnrollmentModuleDto: UpdateEnrollmentModuleDto,
  ): Promise<EnrollmentModule> {
    const enrollmentModule = await this.enrollmentModuleRepo.preload({
      id,
      ...updateEnrollmentModuleDto,
    });
    if (!enrollmentModule)
      throw new NotFoundException('Enrollment module not found.');
    await this.enrollmentModuleRepo.save(enrollmentModule);
    return enrollmentModule;
  }

  async delete(id: number) {
    const { affected } = await this.enrollmentModuleRepo.delete(id);
    if (affected > 0) return;
    throw new NotFoundException('Enrollment module not found.');
  }
}
