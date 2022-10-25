import { QueryOptionsDto } from 'src/shared/dto/query-options.dto';
import { SelectQueryBuilder } from 'typeorm';

export const paginateBuilder = <ENTITY, DTO = QueryOptionsDto>(
  qb: SelectQueryBuilder<ENTITY>,
  dto: DTO,
) => {
  const { page, limit } = dto as QueryOptionsDto;
  const offset = limit * (page - 1);
  qb.take(limit).skip(offset);
};
