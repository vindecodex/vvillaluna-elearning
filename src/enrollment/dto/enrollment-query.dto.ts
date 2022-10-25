import { Transform, Type } from 'class-transformer';
import { IsIn, IsOptional, IsPositive, IsUUID } from 'class-validator';
import { QueryOptionsDto } from 'src/shared/dto/query-options.dto';
import { toArray } from 'src/shared/helpers/to-array.helper';
import { toBoolean } from 'src/shared/helpers/to-boolean.helper';
import { EnrollmentFields } from '../enum/enrollment-fields.enum';
import { EnrollmentRelations } from '../enum/enrollment-relations.enum';

type TableRelations = EnrollmentRelations.COURSE | EnrollmentRelations.USER;
export class EnrollmentQueryDto extends QueryOptionsDto {
  @IsOptional()
  @IsIn(Object.values(EnrollmentFields))
  sort: string;

  @IsOptional()
  @IsIn(Object.values(EnrollmentRelations), { each: true })
  @Transform(toArray)
  join: TableRelations[];

  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    return [value];
  })
  @Type(() => Number)
  @IsPositive({ each: true })
  courses: number[];

  @IsOptional()
  @IsUUID()
  studentId: string;

  @IsOptional()
  @Transform(toBoolean)
  completed: string;
}
