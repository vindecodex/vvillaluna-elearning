import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostgresErrorCode } from 'src/shared/enums/error-code/postgres.enum';
import { ResponseList } from 'src/shared/interfaces/response-list.interface';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CourseQueryDto } from '../dto/course-query.dto';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { Course } from '../entities/course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course) private courseRepo: Repository<Course>,
  ) {}
  async findAll(courseQueryDto: CourseQueryDto): Promise<ResponseList<Course>> {
    const { page = 1, limit = 5 } = courseQueryDto;
    const courses = await this.courseRepo.find({
      skip: page - 1,
      take: limit,
    });
    const totalCount = await this.courseRepo.countBy({ isPublished: true });
    return {
      data: courses,
      totalCount,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Course | object> {
    const course = await this.courseRepo.findOne({ where: { id } });
    return course ? course : {};
  }

  async create(createCourseDto: CreateCourseDto, user: User): Promise<Course> {
    try {
      const { title, subjectId, description, icon } = createCourseDto;
      const course = this.courseRepo.create({
        title,
        description,
        subject: { id: subjectId },
        author: { id: user.id },
        isPublished: false,
        icon,
      });
      await this.courseRepo.save(course);
      return course;
    } catch (e) {
      if (e.code === PostgresErrorCode.DUPLICATE)
        throw new BadRequestException('Title already exist');
      if (e.code === PostgresErrorCode.INVALID_RELATION_KEY)
        throw new BadRequestException("Subject id doesn't exist");
      throw e;
    }
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    try {
      const course = await this.courseRepo.preload({
        id,
        ...updateCourseDto,
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
