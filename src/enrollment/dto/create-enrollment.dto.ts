import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateEnrollmentDto {
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({ description: 'Unique identifier for the course' })
  courseId: number;
}
