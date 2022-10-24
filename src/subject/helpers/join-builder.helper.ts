import { SelectQueryBuilder } from 'typeorm';
import { SubjectQueryDto } from '../dto/subject-query.dto';
import { Subject } from '../entities/subject.entity';
import { SubjectRelations } from '../enum/subject-relations.enum';

const TableRelation = {
  course: { field: 'subject.courses', alias: 'courses' },
  owner: { field: 'subject.owner', alias: 'owner' },
};

export const joinBuilder = <ENTITY = Subject, DTO = SubjectQueryDto>(
  qb: SelectQueryBuilder<ENTITY>,
  dto: DTO,
) => {
  const { join = [], courses } = dto as SubjectQueryDto;
  const { field: courseField, alias: courseAlias } = TableRelation.course;
  const { COURSE } = SubjectRelations;

  /*
   * Enable left join if courses option is true
   * And check if courses is not included in join options
   */
  if (typeof courses !== 'undefined' && !join.includes(COURSE))
    qb.leftJoin(courseField, courseAlias);

  // Left join and select if contains joins
  if (join.length > 0) {
    join.forEach((entity) => {
      const { field, alias } = TableRelation[entity];
      qb.leftJoinAndSelect(field, alias);
    });
  }
};
