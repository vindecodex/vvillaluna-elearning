import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseController } from './controller/course.controller';
import { Course } from './entities/course.entity';
import { CourseService } from './service/course.service';

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
