import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentModule } from './entities/enrollment-module.entity';
import { EnrollmentModuleService } from './service/enrollment-module.service';

@Module({
  imports: [TypeOrmModule.forFeature([EnrollmentModule])],
  providers: [EnrollmentModuleService],
})
export class EnrollmentModuleModule {}
