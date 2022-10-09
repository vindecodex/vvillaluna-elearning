import { IsOptional, IsPositive } from 'class-validator';
import { QueryOptionsDto } from 'src/shared/dto/query-options.dto';

export class CourseQueryDto extends QueryOptionsDto {
  @IsOptional()
  @IsPositive()
  subjectId: number;

  @IsOptional()
  sections: boolean;
}
