import { IsOptional, IsPositive } from 'class-validator';

export class UpdateCourseDto {
  @IsOptional()
  title: string;

  @IsOptional()
  @IsPositive()
  subjectId: number;

  @IsOptional()
  description: string;

  @IsOptional()
  isPublished: boolean;

  @IsOptional()
  icon: string;
}
