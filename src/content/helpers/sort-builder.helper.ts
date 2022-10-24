import { SortDirection } from 'src/shared/enums/sort-direction.enum';
import { SelectQueryBuilder } from 'typeorm';
import { ContentQueryDto } from '../dto/content-query.dto';
import { Content } from '../entities/content.entity';

export const sortBuilder = <ENTITY = Content, DTO = ContentQueryDto>(
  qb: SelectQueryBuilder<ENTITY>,
  dto: DTO,
) => {
  const { sort, sortDirection = SortDirection.ASC } = dto as ContentQueryDto;

  const defaultSortBy = 'content.id';
  const sortBy = sort ? `content.${sort}` : defaultSortBy;

  qb.orderBy(sortBy, sortDirection);
};
