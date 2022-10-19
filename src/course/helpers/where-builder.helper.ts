import { SelectQueryBuilder } from 'typeorm';
import { CourseQueryDto } from '../dto/course-query.dto';
import { Course } from '../entities/course.entity';

export const whereBuilder = <ENTITY = Course, DTO = CourseQueryDto>(
  qb: SelectQueryBuilder<ENTITY>,
  dto: DTO,
) => {
  const { sections, subjectId, published, keyword } = dto as CourseQueryDto;

  const withSections = sections
    ? 'modules.id IS NOT NULL'
    : 'modules.id IS NULL';
  const withSubjectId = `subject.id = :subjectId`;
  const isPublished = `course.isPublished = :published`;
  const withKeyword = `course.title ILIKE '%' || :keyword || '%'`;
  const start = '1 = 1';

  qb.where(start);

  if (typeof sections !== 'undefined') qb.andWhere(withSections);
  if (typeof subjectId !== 'undefined')
    qb.andWhere(withSubjectId, { subjectId });
  if (typeof published !== 'undefined') qb.andWhere(isPublished, { published });
  if (typeof keyword !== 'undefined') qb.andWhere(withKeyword, { keyword });
};
