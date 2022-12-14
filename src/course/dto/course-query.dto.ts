import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsPositive } from 'class-validator';
import { QueryOptionsDto } from '../../shared/dto/query-options.dto';
import { toArray } from '../../shared/helpers/to-array.helper';
import { toBoolean } from '../../shared/helpers/to-boolean.helper';
import { CourseFields } from '../enum/course-fields.enum';
import { CourseRelations } from '../enum/course-relations.enum';

type TableRelations =
  | CourseRelations.AUTHOR
  | CourseRelations.ENROLLMENT
  | CourseRelations.MODULE
  | CourseRelations.SUBJECT;
export class CourseQueryDto extends PartialType(QueryOptionsDto) {
  @IsOptional()
  @IsIn(Object.values(CourseFields))
  sort?: string;

  @IsOptional()
  @IsIn(Object.values(CourseRelations), { each: true })
  @Transform(toArray)
  join?: TableRelations[];

  @IsOptional()
  @IsPositive()
  subjectId?: number;

  @IsOptional()
  @Transform(toBoolean)
  @IsIn([true, false])
  sections?: string;
}
