import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsPositive } from 'class-validator';
import { QueryOptionsDto } from 'src/shared/dto/query-options.dto';
import { ContentFields } from '../enum/content-fields.enum';
import { ContentRelations } from '../enum/content-relations.enum';

type TableRelations = ContentRelations.AUTHOR | ContentRelations.MODULE;
export class ContentQueryDto extends QueryOptionsDto {
  @IsOptional()
  @IsIn(Object.values(ContentFields))
  sort: string;

  @IsOptional()
  @IsIn(Object.values(ContentRelations), { each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    return [value];
  })
  join: TableRelations[];

  @IsPositive()
  @IsOptional()
  id: number;

  @IsPositive()
  @IsOptional()
  module: number;
}
