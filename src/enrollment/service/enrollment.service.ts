import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnrollmentModule } from '../../enrollment-module/entities/enrollment-module.entity';
import { Module } from '../../module/entities/module.entity';
import { PostgresErrorCode } from '../../shared/enums/error-code/postgres.enum';
import { buildQueryFrom } from '../../shared/helpers/database/build-query-from.helper';
import { paginateBuilder } from '../../shared/helpers/database/paginate-builder.helper';
import { notFound } from '../../shared/helpers/error-message/not-found.helper';
import { ResponseList } from '../../shared/interfaces/response-list.interface';
import { User } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateEnrollmentDto } from '../dto/create-enrollment.dto';
import { EnrollmentQueryDto } from '../dto/enrollment-query.dto';
import { UpdateEnrollmentDto } from '../dto/update-enrollment.dto';
import { Enrollment } from '../entities/enrollment.entity';
import { joinBuilder } from '../helpers/join-builder.helper';
import { sortBuilder } from '../helpers/sort-builder.helper';
import { whereBuilder } from '../helpers/where-builder.helper';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepo: Repository<Enrollment>,
    @InjectRepository(EnrollmentModule)
    private enrollmentModuleRepo: Repository<EnrollmentModule>,
    @InjectRepository(Module) private moduleRepo: Repository<Module>,
  ) {}
  async create(dto: CreateEnrollmentDto, user: User): Promise<Enrollment> {
    try {
      const { courseId } = dto;
      const enrollment = this.enrollmentRepo.create({
        user: { id: user.id },
        course: { id: courseId },
      });

      const modules = await this.moduleRepo.findBy({
        course: { id: courseId },
      });

      const enrollmentModules: EnrollmentModule[] = modules.map((module) => {
        const enrollmentModule = new EnrollmentModule();
        enrollmentModule.enrollment = enrollment;
        enrollmentModule.module = module;
        return enrollmentModule;
      });

      await this.enrollmentModuleRepo.save(enrollmentModules);

      await this.enrollmentRepo.save(enrollment);
      return enrollment;
    } catch (e) {
      if (e.code === PostgresErrorCode.DUPLICATE)
        throw new BadRequestException(
          'You are already enrolled in this course',
        );
      if (e.code === PostgresErrorCode.INVALID_RELATION_KEY)
        throw new NotFoundException(notFound('Course'));
      throw e;
    }
  }

  async findAll(dto: EnrollmentQueryDto): Promise<ResponseList<Enrollment>> {
    const { page, limit } = dto;

    const queryBuilder = this.enrollmentRepo.createQueryBuilder('enrollment');
    buildQueryFrom(queryBuilder, dto).apply(
      joinBuilder,
      sortBuilder,
      whereBuilder,
      paginateBuilder,
    );

    const [enrollments, totalCount] = await queryBuilder.getManyAndCount();

    return {
      data: enrollments,
      totalCount,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Enrollment> {
    try {
      const enrollment = await this.enrollmentRepo.findOne({
        where: { id },
        relations: { user: true },
      });

      if (!enrollment) throw new NotFoundException(notFound('Enrollment'));

      return enrollment;
    } catch (e) {
      throw e;
    }
  }

  async update(
    id: number,
    dto: UpdateEnrollmentDto,
  ): Promise<EnrollmentModule> {
    try {
      const { moduleId, isCompleted } = dto;
      const enrollmentModule = await this.enrollmentModuleRepo.findOneBy({
        enrollment: { id },
        module: { id: moduleId },
      });

      const updatedEnrollmentModule = await this.enrollmentModuleRepo.preload({
        id: enrollmentModule.id,
        enrollment: { id },
        module: { id: moduleId },
        isCompleted,
      });

      const result = await this.enrollmentModuleRepo.save(
        updatedEnrollmentModule,
      );

      return result;
    } catch (e) {
      if (e.code === PostgresErrorCode.INVALID_RELATION_KEY)
        throw new NotFoundException(notFound('Module'));
      throw e;
    }
  }

  async delete(id: number): Promise<void> {
    const { affected } = await this.enrollmentRepo.delete(id);
    if (affected > 0) return;
    throw new NotFoundException(notFound('Enrollment'));
  }
}
