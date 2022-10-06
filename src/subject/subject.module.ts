import { Module } from '@nestjs/common';
import { SubjectController } from './controller/subject.controller';
import { SubjectService } from './service/subject.service';

@Module({
  providers: [SubjectService],
  controllers: [SubjectController],
})
export class SubjectModule {}
