import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslAbilityFactory } from '../authorization/factories/casl-ability.factory';
import { SubjectController } from './controller/subject.controller';
import { Subject } from './entities/subject.entity';
import { SubjectService } from './service/subject.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subject])],
  providers: [SubjectService, CaslAbilityFactory],
  controllers: [SubjectController],
  exports: [SubjectService],
})
export class SubjectModule {}
