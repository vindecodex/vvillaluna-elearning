import { SortDirection } from 'src/shared/enums/sort-direction.enum';
import { SelectQueryBuilder } from 'typeorm';
import { ModuleQueryDto } from '../dto/module-query.dto';
import { Module } from '../entities/module.entity';

export const sortBuilder = <ENTITY = Module, DTO = ModuleQueryDto>(
  qb: SelectQueryBuilder<ENTITY>,
  dto: DTO,
) => {
  const { sort, sortDirection = SortDirection.ASC } = dto as ModuleQueryDto;

  const defaultSortBy = 'module.id';
  const sortBy = sort ? `module.${sort}` : defaultSortBy;

  qb.orderBy(sortBy, sortDirection);
};
