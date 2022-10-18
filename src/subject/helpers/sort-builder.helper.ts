import { SortDirection } from 'src/shared/enums/sort-direction.enum';
import { SelectQueryBuilder } from 'typeorm';
import { SubjectQueryDto } from '../dto/subject-query.dto';
import { Subject } from '../entities/subject.entity';

export const sortBuilder = (
  qb: SelectQueryBuilder<Subject>,
  dto: SubjectQueryDto,
) => {
  const { sort, sortDirection = SortDirection.ASC } = dto;

  const defaultSortBy = 'subject.id';
  const sortBy = sort ? `subject.${sort}` : defaultSortBy;

  qb.orderBy(sortBy, sortDirection);
};
