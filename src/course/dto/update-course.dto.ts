import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateCourseDto } from './create-course.dto';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  @IsOptional()
  @ApiProperty({
    description: 'Status of the course whether it published or still in draft.',
  })
  isPublished?: boolean;
}
