import { SelectQueryBuilder } from 'typeorm';
import { EnrollmentQueryDto } from '../dto/enrollment-query.dto';
import { Enrollment } from '../entities/enrollment.entity';
import { EnrollmentRelations } from '../enum/enrollment-relations.enum';

const TableRelation = {
  course: { field: 'enrollment.course', alias: 'course' },
  user: { field: 'enrollment.user', alias: 'user' },
  enrollmentModule: {
    field: 'enrollment.enrollmentModules',
    alias: 'enrollmentModule',
  },
};

export const joinBuilder = <ENTITY = Enrollment, DTO = EnrollmentQueryDto>(
  qb: SelectQueryBuilder<ENTITY>,
  dto: DTO,
) => {
  const { join = [], studentId, courses = [] } = dto as EnrollmentQueryDto;
  const { field: courseField, alias: courseAlias } = TableRelation.course;
  const { field: userField, alias: userAlias } = TableRelation.user;
  const { field: enrollmentModuleField, alias: enrollmentModuleAlias } =
    TableRelation.enrollmentModule;
  const { COURSE, USER } = EnrollmentRelations;

  /*
   * Enable left join if option is true
   * And check if not included in join options to avoid duplicate
   */
  if (courses.length > 0 && !join.includes(COURSE))
    qb.leftJoin(courseField, courseAlias);
  if (typeof studentId !== 'undefined' && !join.includes(USER))
    qb.leftJoin(userField, userAlias);

  // Should be join always
  qb.leftJoin(enrollmentModuleField, enrollmentModuleAlias);

  // Left join and select if contains joins
  if (join.length > 0) {
    join.forEach((entity) => {
      const { field, alias } = TableRelation[entity];
      qb.leftJoinAndSelect(field, alias);
    });
  }
};
