import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateEnrollmentModuleDto {
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({ description: 'Unique Identifier of module' })
  moduleId: number;

  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID of the subject enrolled' })
  enrollmentId: number;
}
