import { SelectQueryBuilder } from 'typeorm';
import { ModuleQueryDto } from '../dto/module-query.dto';
import { Module } from '../entities/module.entity';

export const whereBuilder = <ENTITY = Module, DTO = ModuleQueryDto>(
  qb: SelectQueryBuilder<ENTITY>,
  dto: DTO,
) => {
  const { course, duration, hasContents, published, keyword } =
    dto as ModuleQueryDto;

  const withContents = hasContents
    ? 'contents.id IS NOT NULL'
    : 'contents.id IS NULL';
  const withCourse = `course.id = :course`;
  const isPublished = `module.isPublished = :published`;
  const withKeyword = `module.title ILIKE '%' || :keyword || '%'`;
  const withDuration = `module.duration = :duration`;
  const start = '1 = 1';

  qb.where(start);

  if (typeof hasContents !== 'undefined') qb.andWhere(withContents);
  if (typeof course !== 'undefined') qb.andWhere(withCourse, { course });
  if (typeof duration !== 'undefined') qb.andWhere(withDuration, { duration });
  if (typeof published !== 'undefined') qb.andWhere(isPublished, { published });
  if (typeof keyword !== 'undefined') qb.andWhere(withKeyword, { keyword });
};
