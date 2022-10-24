import { SelectQueryBuilder } from 'typeorm';
import { EnrollmentQueryDto } from '../dto/enrollment-query.dto';
import { Enrollment } from '../entities/enrollment.entity';

export const whereBuilder = <ENTITY = Enrollment, DTO = EnrollmentQueryDto>(
  qb: SelectQueryBuilder<ENTITY>,
  dto: DTO,
) => {
  const { courses = [], studentId, completed } = dto as EnrollmentQueryDto;

  const withStudent = `user.id = :studentId`;
  const withCompleted = `enrollmentModule.isCompleted = :completed`;
  const withCourses = `enrollment.course IN (:...courses)`;
  const start = '1 = 1';

  qb.where(start);

  if (courses.length > 0) qb.andWhere(withCourses, { courses });
  if (typeof studentId !== 'undefined') qb.andWhere(withStudent, { studentId });
  if (typeof completed !== 'undefined')
    qb.andWhere(withCompleted, { completed });
};
