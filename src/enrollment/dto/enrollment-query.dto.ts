import { IsArray, IsOptional, IsPositive } from 'class-validator';
import { QueryOptionsDto } from 'src/shared/dto/query-options.dto';

export class EnrollmentQueryDto extends QueryOptionsDto {
  @IsOptional()
  @IsArray()
  courses: number[];

  @IsOptional()
  @IsPositive()
  studentId: number;

  @IsOptional()
  completed: boolean;
}
