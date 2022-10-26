import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsPositive } from 'class-validator';
import { QueryOptionsDto } from '../../shared/dto/query-options.dto';
import { toArray } from '../../shared/helpers/to-array.helper';
import { toBoolean } from '../../shared/helpers/to-boolean.helper';
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
  @Transform(toArray)
  join: TableRelations[];

  @IsOptional()
  @IsPositive()
  course: number;

  @IsOptional()
  @IsPositive()
  duration: number;

  @IsOptional()
  @Transform(toBoolean)
  hasContents: string;
}
