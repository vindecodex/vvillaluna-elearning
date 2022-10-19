import { SelectQueryBuilder } from 'typeorm';

type QueryBuilder<ENTITY, DTO> = (
  qb: SelectQueryBuilder<ENTITY>,
  dto: DTO,
) => void;

/*
 * Executes QueryBuilder
 */
const builders =
  <ENTITY, DTO>(...fns: QueryBuilder<ENTITY, DTO>[]) =>
  (qb: SelectQueryBuilder<ENTITY>, dto: DTO) => {
    for (const fn of fns) {
      fn(qb, dto);
    }
  };

/*
 * buildQueryFrom accepts SelectQueryBuilder and the DTO to be processed
 */
export const buildQueryFrom = <ENTITY, DTO>(
  qb: SelectQueryBuilder<ENTITY>,
  dto: DTO,
) => ({
  /*
   * apply accepts builders or the workers of each part of
   * the query and executes them using builders.
   */
  apply: (...queryBuilders: QueryBuilder<ENTITY, DTO>[]) => {
    const build = builders<ENTITY, DTO>(...queryBuilders);
    build(qb, dto);
  },
});
