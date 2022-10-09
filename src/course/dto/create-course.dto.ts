import { IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  title: string;

  @IsPositive()
  subjectId: number;

  @IsOptional()
  description: string;

  @IsOptional()
  icon: string;
}
