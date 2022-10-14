import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateEnrollmentModuleDto {
  @IsPositive()
  @IsNotEmpty()
  moduleId: number;

  @IsPositive()
  @IsNotEmpty()
  enrollmentId: number;
}
