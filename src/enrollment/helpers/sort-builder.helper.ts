import { SortDirection } from 'src/shared/enums/sort-direction.enum';
import { SelectQueryBuilder } from 'typeorm';
import { EnrollmentQueryDto } from '../dto/enrollment-query.dto';
import { Enrollment } from '../entities/enrollment.entity';

export const sortBuilder = <ENTITY = Enrollment, DTO = EnrollmentQueryDto>(
  qb: SelectQueryBuilder<ENTITY>,
  dto: DTO,
) => {
  const { sort, sortDirection = SortDirection.ASC } = dto as EnrollmentQueryDto;

  const defaultSortBy = 'enrollment.id';
  const sortBy = sort ? `enrollment.${sort}` : defaultSortBy;

  qb.orderBy(sortBy, sortDirection);
};
