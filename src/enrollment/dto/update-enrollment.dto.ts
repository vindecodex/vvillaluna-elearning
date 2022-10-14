import { IsNotEmpty, IsPositive } from 'class-validator';

export class UpdateEnrollmentDto {
  @IsPositive()
  @IsNotEmpty()
  moduleId: number;

  @IsNotEmpty()
  isCompleted: boolean;
}
