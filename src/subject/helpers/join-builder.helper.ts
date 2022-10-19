import { SelectQueryBuilder } from 'typeorm';
import { SubjectQueryDto } from '../dto/subject-query.dto';
import { Subject } from '../entities/subject.entity';

const TableRelation = {
  course: { field: 'subject.courses', alias: 'courses' },
  owner: { field: 'subject.owner', alias: 'owner' },
};

export const joinBuilder = <ENTITY = Subject, DTO = SubjectQueryDto>(
  qb: SelectQueryBuilder<ENTITY>,
  dto: DTO,
) => {
  const { join } = dto as SubjectQueryDto;
  if (typeof join !== 'undefined') {
    const joins = Array.isArray(join) ? join : [join];
    joins.forEach((entity) => {
      const { field, alias } = TableRelation[entity];
      qb.leftJoinAndSelect(field, alias);
    });
  }
};
