import { SelectQueryBuilder } from 'typeorm';
import { SubjectQueryDto } from '../dto/subject-query.dto';
import { Subject } from '../entities/subject.entity';

export const whereBuilder = <ENTITY = Subject, DTO = SubjectQueryDto>(
  qb: SelectQueryBuilder<ENTITY>,
  dto: DTO,
) => {
  const { courses, published, keyword } = dto as SubjectQueryDto;

  const withCourse = courses ? 'courses.id IS NOT NULL' : 'courses.id IS NULL';
  const isPublished = `subject.isPublished = :published`;
  const withKeyword = `subject.title ILIKE '%' || :keyword || '%'`;
  const start = '1 = 1';

  qb.where(start);

  if (typeof courses !== 'undefined') qb.andWhere(withCourse);
  if (typeof published !== 'undefined') qb.andWhere(isPublished, { published });
  if (typeof keyword !== 'undefined') qb.andWhere(withKeyword, { keyword });
};
