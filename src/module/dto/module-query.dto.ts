import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsPositive } from 'class-validator';
import { SwaggerDescription } from '../../shared/enums/swagger-description.enum';
import { QueryOptionsDto } from '../../shared/dto/query-options.dto';
import { toArray } from '../../shared/helpers/to-array.helper';
import { toBoolean } from '../../shared/helpers/to-boolean.helper';
import { ModuleFields } from '../enum/module-fields.enum';
import { ModuleRelations } from '../enum/module-relations.enum';

type TableRelations =
  | ModuleRelations.AUTHOR
  | ModuleRelations.CONTENT
  | ModuleRelations.COURSE;
export class ModuleQueryDto extends PartialType(QueryOptionsDto) {
  @IsOptional()
  @IsIn(Object.values(ModuleFields))
  @ApiProperty({ description: SwaggerDescription.SORT })
  sort?: string;

  @IsOptional()
  @IsIn(Object.values(ModuleRelations), { each: true })
  @Transform(toArray)
  @ApiProperty({ description: SwaggerDescription.JOIN })
  join?: TableRelations[];

  @IsOptional()
  @IsPositive()
  @ApiProperty({ description: 'ID of the parent course' })
  course?: number;

  @IsOptional()
  @IsPositive()
  @ApiProperty({ description: 'To filter modules based on their duration.' })
  duration?: number;

  @IsOptional()
  @Transform(toBoolean)
  @IsIn([true, false])
  @ApiProperty({ description: 'To filter modules who has contents' })
  hasContents?: string;
}
