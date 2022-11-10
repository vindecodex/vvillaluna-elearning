import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';
import { SwaggerDescription } from '../../shared/enums/swagger-description.enum';
import { QueryOptionsDto } from '../../shared/dto/query-options.dto';
import { toArray } from '../../shared/helpers/to-array.helper';
import { toBoolean } from '../../shared/helpers/to-boolean.helper';
import { SubjectFields } from '../enum/subject-fields.enum';
import { SubjectRelations } from '../enum/subject-relations.enum';

type TableRelations = SubjectRelations.COURSE | SubjectRelations.OWNER;
export class SubjectQueryDto extends PartialType(QueryOptionsDto) {
  @IsOptional()
  @IsIn(Object.values(SubjectFields))
  @ApiProperty({
    description: SwaggerDescription.SORT,
  })
  sort?: string;

  @IsOptional()
  @IsIn(Object.values(SubjectRelations), { each: true })
  @Transform(toArray)
  @ApiProperty({
    description: SwaggerDescription.JOIN,
  })
  join?: TableRelations[];

  /**
   * If type is set to boolean it will convert the value to always true
   * because of the enableImplicitConversion under main.ts validationPipe
   * ---
   * Problem Resources:
   * https://stackoverflow.com/questions/59046629/boolean-parameter-in-request-body-is-always-true-in-nestjs-api
   * https://github.com/typestack/class-transformer/issues/306
   **/
  @IsOptional()
  @Transform(toBoolean)
  @IsIn([true, false])
  @ApiProperty({
    description: 'To filter subjects that have courses.',
  })
  courses?: string;
}
