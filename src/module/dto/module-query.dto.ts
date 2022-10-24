import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsPositive } from 'class-validator';
import { QueryOptionsDto } from 'src/shared/dto/query-options.dto';
import { ModuleFields } from '../enum/module-fields.enum';
import { ModuleRelations } from '../enum/module-relations.enum';

type TableRelations =
  | ModuleRelations.AUTHOR
  | ModuleRelations.CONTENT
  | ModuleRelations.COURSE;
export class ModuleQueryDto extends QueryOptionsDto {
  @IsOptional()
  @IsIn(Object.values(ModuleFields))
  sort: string;

  @IsOptional()
  @IsIn(Object.values(ModuleRelations), { each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    return [value];
  })
  join: TableRelations[];

  @IsOptional()
  @IsPositive()
  course: number;

  @IsOptional()
  @IsPositive()
  duration: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  hasContents: string;
}
