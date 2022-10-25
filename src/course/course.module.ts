import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslAbilityFactory } from 'src/authorization/factories/casl-ability.factory';
import { Uploads } from 'src/shared/enums/uploads.enum';
import { CourseController } from './controller/course.controller';
import { Course } from './entities/course.entity';
import { CourseService } from './service/course.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course]),
    MulterModule.register({ dest: `./${Uploads.DESTINATION}` }),
  ],
  controllers: [CourseController],
  providers: [CourseService, CaslAbilityFactory],
  exports: [CourseService],
})
export class CourseModule {}
