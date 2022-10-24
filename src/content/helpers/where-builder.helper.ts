import { SelectQueryBuilder } from 'typeorm';
import { ContentQueryDto } from '../dto/content-query.dto';
import { Content } from '../entities/content.entity';

export const whereBuilder = <ENTITY = Content, DTO = ContentQueryDto>(
  qb: SelectQueryBuilder<ENTITY>,
  dto: DTO,
) => {
  const { module, id, published, keyword } = dto as ContentQueryDto;

  const withModule = `module.id = :module`;
  const withId = `content.id = :id`;
  const isPublished = `content.isPublished = :published`;
  const withKeyword = `content.content ILIKE '%' || :keyword || '%'`;
  const start = '1 = 1';

  qb.where(start);

  if (typeof module !== 'undefined') qb.andWhere(withModule, { module });
  if (typeof id !== 'undefined') qb.andWhere(withId, { id });
  if (typeof published !== 'undefined') qb.andWhere(isPublished, { published });
  if (typeof keyword !== 'undefined') qb.andWhere(withKeyword, { keyword });
};
