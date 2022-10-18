import { Transform } from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';
import { QueryOptionsDto } from 'src/shared/dto/query-options.dto';
import { SubjectFields } from '../enum/subject-fields.enum';
import { SubjectRelations } from '../enum/subject-relations.enum';

type TableRelations = SubjectRelations.COURSE | SubjectRelations.OWNER;
export class SubjectQueryDto extends QueryOptionsDto {
  @IsOptional()
  @IsIn(Object.values(SubjectFields))
  sort: string;

  @IsOptional()
  @IsIn(Object.values(SubjectRelations))
  join: TableRelations[];

  /**
   * If type is set to boolean it will convert the value to always true
   * because of the enableImplicitConversion under main.ts validationPipe
   * ---
   * Problem Resources:
   * https://stackoverflow.com/questions/59046629/boolean-parameter-in-request-body-is-always-true-in-nestjs-api
   * https://github.com/typestack/class-transformer/issues/306
   **/
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  courses: string;
}
