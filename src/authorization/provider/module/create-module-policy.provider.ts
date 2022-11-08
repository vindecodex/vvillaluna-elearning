import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CourseService } from '../../../course/service/course.service';
import { CreateModulePolicyHandler } from '../../../authorization/policy-handler/module/create-module-policy.handler';
import { Module } from '../../../module/entities/module.entity';
import { User } from '../../../user/entities/user.entity';

export const CreateModulePolicyProvider: Provider = {
  provide: CreateModulePolicyHandler,
  inject: [CourseService, REQUEST],
  useFactory: async (courseService: CourseService, request: Request) => {
    const courseId = +request.body.courseId;
    const user = request.user as User;
    const module = new Module();

    const course = await courseService.findOne(courseId);
    module.author = user;
    module.course = course;
    return new CreateModulePolicyHandler(module);
  },
};
