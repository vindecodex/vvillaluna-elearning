import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { DeleteCoursePolicyHandler } from 'src/authorization/policy-handler/course/delete-course-policy.handler';
import { Course } from 'src/course/entities/course.entity';
import { CourseService } from 'src/course/service/course.service';

export const DeleteCoursePolicyProvider: Provider = {
  provide: DeleteCoursePolicyHandler,
  inject: [CourseService, REQUEST],
  useFactory: async (courseService: CourseService, request: Request) => {
    const { id } = request.params;
    const course = await courseService.findOne(+id);
    return new DeleteCoursePolicyHandler(course as Course);
  },
};
