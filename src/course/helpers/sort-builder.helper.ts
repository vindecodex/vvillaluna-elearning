import { SortDirection } from '../../shared/enums/sort-direction.enum';
import { SelectQueryBuilder } from 'typeorm';
import { CourseQueryDto } from '../dto/course-query.dto';
import { Course } from '../entities/course.entity';

export const sortBuilder = <ENTITY = Course, DTO = CourseQueryDto>(
  qb: SelectQueryBuilder<ENTITY>,
  dto: DTO,
) => {
  const { sort, sortDirection = SortDirection.ASC } = dto as CourseQueryDto;

  const defaultSortBy = 'course.id';
  const sortBy = sort ? `course.${sort}` : defaultSortBy;

  qb.orderBy(sortBy, sortDirection);
};
