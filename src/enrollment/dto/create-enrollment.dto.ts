import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateEnrollmentDto {
  @IsPositive()
  @IsNotEmpty()
  courseId: number;
}
