import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UpdateCoursePolicyHandler } from '../../../authorization/policy-handler/course/update-course-policy.handler';
import { CourseService } from '../../../course/service/course.service';

export const UpdateCoursePolicyProvider: Provider = {
  provide: UpdateCoursePolicyHandler,
  inject: [CourseService, REQUEST],
  useFactory: async (courseService: CourseService, request: Request) => {
    const { id } = request.params;
    const course = await courseService.findOne(+id);
    return new UpdateCoursePolicyHandler(course);
  },
};
