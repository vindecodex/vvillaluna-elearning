import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CreateCoursePolicyHandler } from '../../../authorization/policy-handler/course/create-course-policy.handler';
import { Course } from '../../../course/entities/course.entity';
import { User } from '../../../user/entities/user.entity';

export const CreateCoursePolicyProvider: Provider = {
  provide: CreateCoursePolicyHandler,
  inject: [REQUEST],
  useFactory: async (request: Request) => {
    const user = request.user as User;
    const course = new Course();
    course.author = user;
    return new CreateCoursePolicyHandler(course);
  },
};
