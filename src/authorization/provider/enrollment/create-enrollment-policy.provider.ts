import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CourseService } from '../../../course/service/course.service';
import { CreateEnrollmentPolicyHandler } from '../../../authorization/policy-handler/enrollment/create-enrollment-policy.handler';
import { Enrollment } from '../../../enrollment/entities/enrollment.entity';
import { User } from '../../../user/entities/user.entity';

export const CreateEnrollmentPolicyProvider: Provider = {
  provide: CreateEnrollmentPolicyHandler,
  inject: [CourseService, REQUEST],
  useFactory: async (courseService: CourseService, request: Request) => {
    const courseId = +request.body.courseId;
    const user = request.user as User;
    const enrollment = new Enrollment();
    const course = await courseService.findOne(courseId);

    enrollment.user = user;
    enrollment.course = course;
    return new CreateEnrollmentPolicyHandler(enrollment);
  },
};
