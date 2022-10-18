import { SelectQueryBuilder } from 'typeorm';
import { SubjectQueryDto } from '../dto/subject-query.dto';
import { Subject } from '../entities/subject.entity';
import { joinBuilder } from './join-builder.helper';
import { sortBuilder } from './sort-builder.helper';
import { whereBuilder } from './where-builder.helper';

type QueryBuilder = (
  qb: SelectQueryBuilder<Subject>,
  dto: SubjectQueryDto,
) => void;
const builders =
  (...fns: QueryBuilder[]) =>
  (qb: SelectQueryBuilder<Subject>, dto: SubjectQueryDto) => {
    for (const fn of fns) {
      fn(qb, dto);
    }
  };

export const buildQueryFrom = (
  qb: SelectQueryBuilder<Subject>,
  dto: SubjectQueryDto,
) => {
  const build = builders(joinBuilder, whereBuilder, sortBuilder);
  build(qb, dto);
};
