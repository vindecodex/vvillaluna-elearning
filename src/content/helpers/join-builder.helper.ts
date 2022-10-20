import { SelectQueryBuilder } from 'typeorm';
import { ContentQueryDto } from '../dto/content-query.dto';
import { Content } from '../entities/content.entity';
import { ContentRelations } from '../enum/content-relations.enum';

const TableRelation = {
  author: { field: 'content.author', alias: 'author' },
  module: { field: 'content.module', alias: 'module' },
};

export const joinBuilder = <ENTITY = Content, DTO = ContentQueryDto>(
  qb: SelectQueryBuilder<ENTITY>,
  dto: DTO,
) => {
  const { join = [], module } = dto as ContentQueryDto;
  const { field: moduleField, alias: moduleAlias } = TableRelation.module;
  const { MODULE } = ContentRelations;

  /*
   * Enable left join if option is true
   * And check if not included in join options to avoid duplicate
   */
  if (typeof module !== 'undefined' && !join.includes(MODULE))
    qb.leftJoin(moduleField, moduleAlias);

  // Left join and select if contains joins
  if (join.length > 0) {
    join.forEach((entity) => {
      const { field, alias } = TableRelation[entity];
      qb.leftJoinAndSelect(field, alias);
    });
  }
};
