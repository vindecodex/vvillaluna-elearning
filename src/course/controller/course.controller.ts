import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { ResponseList } from 'src/shared/interfaces/response-list.interface';
import { User } from 'src/user/entities/user.entity';
import { CourseQueryDto } from '../dto/course-query.dto';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { Course } from '../entities/course.entity';
import { CourseService } from '../service/course.service';

@Controller('courses')
export class CourseController {
  constructor(private courseService: CourseService) {}
  @Get()
  async findAll(
    @Query() courseQueryDto: CourseQueryDto,
  ): Promise<ResponseList<Course>> {
    return this.courseService.findAll(courseQueryDto);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Course | object> {
    return this.courseService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @GetUser() user: User,
  ): Promise<Course> {
    return this.courseService.create(createCourseDto, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    return this.courseService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.courseService.delete(id);
  }
}
