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
import { Uploads } from 'src/shared/enums/uploads.enum';

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

  async findOne(id: number): Promise<Course | object> {
    const course = await this.courseRepo.findOne({
      where: { id },
      relations: { author: true },
    });
    return course ? course : {};
  }

  async create(dto: CreateCourseDto, user: User): Promise<Course> {
    try {
      const { title, subjectId, description, icon } = dto;
      const course = this.courseRepo.create({
        title,
        description,
        subject: { id: subjectId },
        author: { id: user.id },
        icon: `${Uploads.DESTINATION}/${icon}`,
      });
      await this.courseRepo.save(course);
      return course;
    } catch (e) {
      if (e.code === PostgresErrorCode.DUPLICATE)
        throw new BadRequestException('Title already exist');
      if (e.code === PostgresErrorCode.INVALID_RELATION_KEY)
        throw new NotFoundException("Subject id doesn't exist");
      throw e;
    }
  }

  async update(id: number, dto: UpdateCourseDto): Promise<Course> {
    try {
      const { icon } = dto;
      const course = await this.courseRepo.preload({
        id,
        ...dto,
        icon: `${Uploads.DESTINATION}/${icon}`,
      });
      if (!course) throw new NotFoundException('Subject not found.');

      await this.courseRepo.save(course);
      return course;
    } catch (e) {
      if (e.code === PostgresErrorCode.DUPLICATE)
        throw new BadRequestException('Title already exist');
      throw e;
    }
  }

  async delete(id: number): Promise<void> {
    const { affected } = await this.courseRepo.delete(id);
    if (affected > 0) return;
    throw new NotFoundException('Course not found.');
  }
}
