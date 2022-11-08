import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostgresErrorCode } from '../../shared/enums/error-code/postgres.enum';
import { buildQueryFrom } from '../../shared/helpers/database/build-query-from.helper';
import { ResponseList } from '../../shared/interfaces/response-list.interface';
import { User } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { CourseQueryDto } from '../dto/course-query.dto';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { Course } from '../entities/course.entity';
import { paginateBuilder } from '../../shared/helpers/database/paginate-builder.helper';
import { whereBuilder } from '../helpers/where-builder.helper';
import { sortBuilder } from '../helpers/sort-builder.helper';
import { joinBuilder } from '../helpers/join-builder.helper';
import { Uploads } from '../../shared/enums/uploads.enum';
import { notFound } from '../../shared/helpers/error-message/not-found.helper';
import { alreadyExist } from '../../shared/helpers/error-message/already-exist.helper';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course) private courseRepo: Repository<Course>,
  ) {}
  async findAll(dto: CourseQueryDto): Promise<ResponseList<Course>> {
    const { page, limit } = dto;
    const queryBuilder = this.courseRepo.createQueryBuilder('course');
    buildQueryFrom<Course, CourseQueryDto>(queryBuilder, dto).apply(
      joinBuilder,
      sortBuilder,
      whereBuilder,
      paginateBuilder,
    );

    const [courses, totalCount] = await queryBuilder.getManyAndCount();

    return {
      data: courses,
      totalCount,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Course> {
    try {
      const course = await this.courseRepo.findOne({
        where: { id },
        relations: { author: true },
      });

      if (!course) throw new NotFoundException(notFound('Course'));

      return course;
    } catch (e) {
      throw e;
    }
  }

  async create(dto: CreateCourseDto, user: User): Promise<Course> {
    try {
      const { title, subjectId, description, icon } = dto;
      const course = this.courseRepo.create({
        title,
        description,
        subject: { id: subjectId },
        author: { id: user.id },
        icon: icon ? `${Uploads.DESTINATION}/${icon}` : icon,
      });
      await this.courseRepo.save(course);
      return course;
    } catch (e) {
      if (e.code === PostgresErrorCode.DUPLICATE)
        throw new BadRequestException(alreadyExist('Course'));
      if (e.code === PostgresErrorCode.INVALID_RELATION_KEY)
        throw new NotFoundException(notFound('Course'));
      throw e;
    }
  }

  async update(id: number, dto: UpdateCourseDto): Promise<Course> {
    try {
      const { icon } = dto;
      const course = await this.courseRepo.preload({
        id,
        ...dto,
        icon: icon ? `${Uploads.DESTINATION}/${icon}` : icon,
      });
      if (!course) throw new NotFoundException(notFound('Course'));

      await this.courseRepo.save(course);
      return course;
    } catch (e) {
      if (e.code === PostgresErrorCode.DUPLICATE)
        throw new BadRequestException(alreadyExist('Title'));
      throw e;
    }
  }

  async delete(id: number): Promise<void> {
    const { affected } = await this.courseRepo.delete(id);
    if (affected > 0) return;
    throw new NotFoundException(notFound('Course'));
  }
}
