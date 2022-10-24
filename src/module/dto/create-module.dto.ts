import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateModuleDto {
  @IsNotEmpty()
  title: string;

  @IsPositive()
  @IsNotEmpty()
  duration: number;

  @IsPositive()
  @IsNotEmpty()
  courseId: number;
}
