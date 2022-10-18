import { SelectQueryBuilder } from 'typeorm';
import { SubjectQueryDto } from '../dto/subject-query.dto';
import { Subject } from '../entities/subject.entity';

const TableRelation = {
  course: { field: 'subject.courses', alias: 'courses' },
  owner: { field: 'subject.owner', alias: 'owner' },
};

export const joinBuilder = (
  qb: SelectQueryBuilder<Subject>,
  dto: SubjectQueryDto,
) => {
  if (typeof dto.join !== 'undefined') {
    const joins = Array.isArray(dto.join) ? dto.join : [dto.join];
    joins.forEach((entity) => {
      const { field, alias } = TableRelation[entity];
      qb.leftJoinAndSelect(field, alias);
    });
  }
};
