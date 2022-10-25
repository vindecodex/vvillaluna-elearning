import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentController } from './controller/enrollment.controller';
import { Enrollment } from './entities/enrollment.entity';
import { EnrollmentModule as EnrollmentModuleEntity } from '../enrollment-module/entities/enrollment-module.entity';
import { Module as ModuleEntity } from '../module/entities/module.entity';
import { EnrollmentService } from './service/enrollment.service';
import { CaslAbilityFactory } from 'src/authorization/factories/casl-ability.factory';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Enrollment,
      EnrollmentModuleEntity,
      ModuleEntity,
    ]),
  ],
  controllers: [EnrollmentController],
  providers: [EnrollmentService, CaslAbilityFactory],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}
