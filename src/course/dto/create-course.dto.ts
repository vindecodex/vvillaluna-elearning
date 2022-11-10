import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of the course' })
  title: string;

  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'Unique subject identifier. The id of the subject as a parent of the course',
  })
  subjectId: number;

  @IsOptional()
  @ApiProperty({ description: 'Course description' })
  description?: string;

  @IsOptional()
  @ApiProperty({ description: 'Course icon' })
  icon?: string;
}
