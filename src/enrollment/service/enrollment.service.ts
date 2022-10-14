import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnrollmentModule } from 'src/enrollment-module/entities/enrollment-module.entity';
import { Module } from 'src/module/entities/module.entity';
import { PostgresErrorCode } from 'src/shared/enums/error-code/postgres.enum';
import { ResponseList } from 'src/shared/interfaces/response-list.interface';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateEnrollmentDto } from '../dto/create-enrollment.dto';
import { EnrollmentQueryDto } from '../dto/enrollment-query.dto';
import { UpdateEnrollmentDto } from '../dto/update-enrollment.dto';
import { Enrollment } from '../entities/enrollment.entity';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepo: Repository<Enrollment>,
    @InjectRepository(EnrollmentModule)
    private enrollmentModuleRepo: Repository<EnrollmentModule>,
    @InjectRepository(Module) private moduleRepo: Repository<Module>,
  ) {}
  async create(
    createEnrollmentDto: CreateEnrollmentDto,
    user: User,
  ): Promise<Enrollment> {
    try {
      const { courseId } = createEnrollmentDto;
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
      console.log(e);
      if (e.code === PostgresErrorCode.DUPLICATE)
        throw new BadRequestException(
          'You are already enrolled in this course',
        );
      if (e.code === PostgresErrorCode.INVALID_RELATION_KEY)
        throw new NotFoundException('Course not found.');
      throw e;
    }
  }

  async findAll(
    enrollmentQueryDto: EnrollmentQueryDto,
  ): Promise<ResponseList<Enrollment>> {
    const { page = 1, limit = 5 } = enrollmentQueryDto;
    const enrollments = await this.enrollmentRepo.find({
      skip: page - 1,
      take: limit,
    });
    const totalCount = await this.enrollmentRepo.count();
    return {
      data: enrollments,
      totalCount,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Enrollment | object> {
    const enrollment = await this.enrollmentRepo.findOne({ where: { id } });
    return enrollment ? enrollment : {};
  }

  async update(
    id: number,
    updateEnrollmentDto: UpdateEnrollmentDto,
  ): Promise<EnrollmentModule> {
    const { moduleId, isCompleted } = updateEnrollmentDto;
    const moduleEnrollment = await this.enrollmentModuleRepo.findOneBy({
      enrollment: { id },
      module: { id: moduleId },
    });
    const updatedEnrollmentModule = await this.enrollmentModuleRepo.preload({
      id: moduleEnrollment.id,
      enrollment: { id },
      module: { id: moduleId },
      isCompleted,
    });

    return this.enrollmentModuleRepo.save(updatedEnrollmentModule);
  }

  async delete(id: number): Promise<void> {
    const { affected } = await this.enrollmentRepo.delete(id);
    if (affected > 0) return;
    throw new NotFoundException('Enrollment not found.');
  }
}
