import { SelectQueryBuilder } from 'typeorm';
import { ModuleQueryDto } from '../dto/module-query.dto';
import { Module } from '../entities/module.entity';
import { ModuleRelations } from '../enum/module-relations.enum';

const TableRelation = {
  author: { field: 'module.author', alias: 'author' },
  course: { field: 'module.course', alias: 'course' },
  content: { field: 'module.contents', alias: 'contents' },
};

export const joinBuilder = <ENTITY = Module, DTO = ModuleQueryDto>(
  qb: SelectQueryBuilder<ENTITY>,
  dto: DTO,
) => {
  const { join = [], course, hasContents } = dto as ModuleQueryDto;
  const { field: courseField, alias: courseAlias } = TableRelation.course;
  const { field: contentField, alias: contentAlias } = TableRelation.content;
  const { COURSE, CONTENT } = ModuleRelations;

  /*
   * Enable left join if option is true
   * And check if not included in join options to avoid duplicate
   */
  if (typeof course !== 'undefined' && !join.includes(COURSE))
    qb.leftJoin(courseField, courseAlias);
  if (typeof hasContents !== 'undefined' && !join.includes(CONTENT))
    qb.leftJoin(contentField, contentAlias);

  // Left join and select if contains joins
  if (join.length > 0) {
    join.forEach((entity) => {
      const { field, alias } = TableRelation[entity];
      qb.leftJoinAndSelect(field, alias);
    });
  }
};
