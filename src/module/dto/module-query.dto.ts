import { IsOptional, IsPositive } from 'class-validator';
import { QueryOptionsDto } from 'src/shared/dto/query-options.dto';

export class ModuleQueryDto extends QueryOptionsDto {
  @IsOptional()
  @IsPositive()
  course: number;

  @IsOptional()
  @IsPositive()
  duration: number;

  @IsOptional()
  hasContents: boolean;
}
