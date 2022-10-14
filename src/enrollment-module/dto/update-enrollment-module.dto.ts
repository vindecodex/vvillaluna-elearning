import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { CreateEnrollmentModuleDto } from './create-enrollment-module.dto';

export class UpdateEnrollmentModuleDto extends PartialType(
  CreateEnrollmentModuleDto,
) {
  @IsNotEmpty()
  isCompleted: boolean;
}
