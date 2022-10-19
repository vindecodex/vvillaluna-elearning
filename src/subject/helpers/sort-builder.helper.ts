import { SortDirection } from 'src/shared/enums/sort-direction.enum';
import { SelectQueryBuilder } from 'typeorm';
import { SubjectQueryDto } from '../dto/subject-query.dto';
import { Subject } from '../entities/subject.entity';

export const sortBuilder = <ENTITY = Subject, DTO = SubjectQueryDto>(
  qb: SelectQueryBuilder<ENTITY>,
  dto: DTO,
) => {
  const { sort, sortDirection = SortDirection.ASC } = dto as SubjectQueryDto;

  const defaultSortBy = 'subject.id';
  const sortBy = sort ? `subject.${sort}` : defaultSortBy;

  qb.orderBy(sortBy, sortDirection);
};
