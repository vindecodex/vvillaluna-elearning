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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
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
  findAll(
    @Query() courseQueryDto: CourseQueryDto,
  ): Promise<ResponseList<Course>> {
    return this.courseService.findAll(courseQueryDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Course | object> {
    return this.courseService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('icon'))
  create(
    @Body() createCourseDto: CreateCourseDto,
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Course> {
    createCourseDto.icon = file.filename;
    return this.courseService.create(createCourseDto, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('icon'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Course> {
    updateCourseDto.icon = file.filename;
    return this.courseService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.courseService.delete(id);
  }
}
