import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ReadCoursePolicyHandler } from '../../../authorization/policy-handler/course/read-course-policy.handler';
import { CourseService } from '../../../course/service/course.service';

export const ReadCoursePolicyProvider: Provider = {
  provide: ReadCoursePolicyHandler,
  inject: [CourseService, REQUEST],
  useFactory: async (courseService: CourseService, request: Request) => {
    const { id } = request.params;
    const course = await courseService.findOne(+id);
    return new ReadCoursePolicyHandler(course);
  },
};
