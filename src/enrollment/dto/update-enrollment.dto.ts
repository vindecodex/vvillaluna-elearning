import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class UpdateEnrollmentDto {
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({ description: 'Id of the module that will be updated' })
  moduleId: number;

  @IsNotEmpty()
  @ApiProperty({
    description: 'If true it means that the module has already been completed.',
  })
  isCompleted: boolean;
}
