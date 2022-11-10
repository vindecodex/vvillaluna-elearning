import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsPositive } from 'class-validator';
import { SwaggerDescription } from '../../shared/enums/swagger-description.enum';
import { QueryOptionsDto } from '../../shared/dto/query-options.dto';
import { toArray } from '../../shared/helpers/to-array.helper';
import { ContentFields } from '../enum/content-fields.enum';
import { ContentRelations } from '../enum/content-relations.enum';

type TableRelations = ContentRelations.AUTHOR | ContentRelations.MODULE;
export class ContentQueryDto extends PartialType(QueryOptionsDto) {
  @IsOptional()
  @IsIn(Object.values(ContentFields))
  @ApiProperty({ description: SwaggerDescription.SORT })
  sort?: string;

  @IsOptional()
  @IsIn(Object.values(ContentRelations), { each: true })
  @Transform(toArray)
  @ApiProperty({ description: SwaggerDescription.JOIN })
  join?: TableRelations[];

  @IsPositive()
  @IsOptional()
  @ApiProperty({ description: 'ID of the content to return' })
  id?: number;

  @IsPositive()
  @IsOptional()
  @ApiProperty({ description: 'ID of the parent module' })
  module?: number;
}
