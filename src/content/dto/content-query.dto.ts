import { IsOptional, IsPositive } from 'class-validator';
import { QueryOptionsDto } from 'src/shared/dto/query-options.dto';

export class ContentQueryDto extends QueryOptionsDto {
  @IsPositive()
  @IsOptional()
  id: number;

  @IsPositive()
  @IsOptional()
  module: number;
}
