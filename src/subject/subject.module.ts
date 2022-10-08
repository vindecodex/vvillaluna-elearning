import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectController } from './controller/subject.controller';
import { Subject } from './entities/subject.entity';
import { SubjectService } from './service/subject.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subject])],
  providers: [SubjectService],
  controllers: [SubjectController],
})
export class SubjectModule {}
