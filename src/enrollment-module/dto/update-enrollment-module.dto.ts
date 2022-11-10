import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateEnrollmentModuleDto } from './create-enrollment-module.dto';

export class UpdateEnrollmentModuleDto extends PartialType(
  CreateEnrollmentModuleDto,
) {
  @IsNotEmpty()
  @ApiProperty({
    description: 'If true it means that the module has already been completed.',
  })
  isCompleted?: boolean;
}
