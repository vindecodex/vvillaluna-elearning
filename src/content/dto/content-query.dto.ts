import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsPositive } from 'class-validator';
import { QueryOptionsDto } from '../../shared/dto/query-options.dto';
import { toArray } from '../../shared/helpers/to-array.helper';
import { ContentFields } from '../enum/content-fields.enum';
import { ContentRelations } from '../enum/content-relations.enum';

type TableRelations = ContentRelations.AUTHOR | ContentRelations.MODULE;
export class ContentQueryDto extends QueryOptionsDto {
  @IsOptional()
  @IsIn(Object.values(ContentFields))
  sort: string;

  @IsOptional()
  @IsIn(Object.values(ContentRelations), { each: true })
  @Transform(toArray)
  join: TableRelations[];

  @IsPositive()
  @IsOptional()
  id: number;

  @IsPositive()
  @IsOptional()
  module: number;
}
