import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsIn, IsOptional, IsPositive, IsUUID } from 'class-validator';
import { SwaggerDescription } from '../../shared/enums/swagger-description.enum';
import { QueryOptionsDto } from '../../shared/dto/query-options.dto';
import { toArray } from '../../shared/helpers/to-array.helper';
import { toBoolean } from '../../shared/helpers/to-boolean.helper';
import { EnrollmentFields } from '../enum/enrollment-fields.enum';
import { EnrollmentRelations } from '../enum/enrollment-relations.enum';

type TableRelations = EnrollmentRelations.COURSE | EnrollmentRelations.USER;
export class EnrollmentQueryDto extends PartialType(QueryOptionsDto) {
  @IsOptional()
  @IsIn(Object.values(EnrollmentFields))
  @ApiProperty({ description: SwaggerDescription.SORT })
  sort?: string;

  @IsOptional()
  @IsIn(Object.values(EnrollmentRelations), { each: true })
  @Transform(toArray)
  @ApiProperty({ description: SwaggerDescription.JOIN })
  join?: TableRelations[];

  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    return [value];
  })
  @Type(() => Number)
  @IsPositive({ each: true })
  @ApiProperty({ description: 'Filter enrollments by one or more course id.' })
  courses?: number[];

  @IsOptional()
  @IsUUID()
  @ApiProperty({ description: 'Filter enrollments by student' })
  studentId?: string;

  @IsOptional()
  @Transform(toBoolean)
  @IsIn([true, false])
  @ApiProperty({ description: 'To filter completed enrollment or not. ' })
  completed?: string;
}
