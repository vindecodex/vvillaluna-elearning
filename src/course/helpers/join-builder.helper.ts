import { SelectQueryBuilder } from 'typeorm';
import { CourseQueryDto } from '../dto/course-query.dto';
import { Course } from '../entities/course.entity';
import { CourseRelations } from '../enum/course-relations.enum';

const TableRelation = {
  subject: { field: 'course.subject', alias: 'subject' },
  author: { field: 'course.author', alias: 'author' },
  module: { field: 'course.modules', alias: 'modules' },
  enrollment: { field: 'course.enrollments', alias: 'enrollments' },
};

export const joinBuilder = <ENTITY = Course, DTO = CourseQueryDto>(
  qb: SelectQueryBuilder<ENTITY>,
  dto: DTO,
) => {
  const { join = [], subjectId, sections } = dto as CourseQueryDto;
  const { field: subjectField, alias: subjectAlias } = TableRelation.subject;
  const { field: moduleField, alias: moduleAlias } = TableRelation.module;
  const { SUBJECT, MODULE } = CourseRelations;

  /*
   * Enable left join if required fields are true
   * nd check joins if table is not included to avoid multiple call
   */
  if (typeof subjectId !== 'undefined' && !join.includes(SUBJECT))
    qb.leftJoin(subjectField, subjectAlias);
  if (typeof sections !== 'undefined' && !join.includes(MODULE))
    qb.leftJoin(moduleField, moduleAlias);

  // Left join and select if contains joins
  if (join.length > 0) {
    join.forEach((entity) => {
      const { field, alias } = TableRelation[entity];
      qb.leftJoinAndSelect(field, alias);
    });
  }
};
