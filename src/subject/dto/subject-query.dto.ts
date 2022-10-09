import { IsOptional } from 'class-validator';
import { QueryOptionsDto } from 'src/shared/dto/query-options.dto';

export class SubjectQueryDto extends QueryOptionsDto {
  @IsOptional()
  courses: boolean;
}
