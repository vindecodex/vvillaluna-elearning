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
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateCoursePolicyHandler } from '../../authorization/policy-handler/course/create-course-policy.handler';
import { DeleteCoursePolicyHandler } from '../../authorization/policy-handler/course/delete-course-policy.handler';
import { ReadCoursePolicyHandler } from '../../authorization/policy-handler/course/read-course-policy.handler';
import { UpdateCoursePolicyHandler } from '../../authorization/policy-handler/course/update-course-policy.handler';
import { CheckPolicies } from '../../shared/decorators/check-policies.decorator';
import { GetUser } from '../../shared/decorators/get-user.decorator';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PoliciesGuard } from '../../shared/guards/policies.guard';
import { ResponseList } from '../../shared/interfaces/response-list.interface';
import { User } from '../../user/entities/user.entity';
import { CourseQueryDto } from '../dto/course-query.dto';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { Course } from '../entities/course.entity';
import { CourseService } from '../service/course.service';

@ApiBearerAuth()
@ApiTags('Course')
@Controller('courses')
export class CourseController {
  constructor(private courseService: CourseService) {}
  @Get()
  findAll(@Query() dto: CourseQueryDto): Promise<ResponseList<Course>> {
    return this.courseService.findAll(dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(ReadCoursePolicyHandler)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Course> {
    return this.courseService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(CreateCoursePolicyHandler)
  @UseInterceptors(FileInterceptor('icon'))
  create(
    @Body() dto: CreateCourseDto,
    @GetUser() user: User,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Course> {
    dto.icon = file?.filename ? file.filename : '';
    return this.courseService.create(dto, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(UpdateCoursePolicyHandler)
  @UseInterceptors(FileInterceptor('icon'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCourseDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Course> {
    dto.icon = file?.filename ? file.filename : '';
    return this.courseService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(DeleteCoursePolicyHandler)
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.courseService.delete(id);
  }
}
