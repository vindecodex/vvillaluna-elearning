import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Constants } from 'src/shared/enums/constants.enum';
import { CourseController } from './controller/course.controller';
import { Course } from './entities/course.entity';
import { CourseService } from './service/course.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course]),
    MulterModule.register({ dest: `./${Constants.UPLOAD_DESTINATION}` }),
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}
