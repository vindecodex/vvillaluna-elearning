import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CreateEnrollmentPolicyHandler } from 'src/authorization/policy-handler/enrollment/create-enrollment-policy.handler';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { User } from 'src/user/entities/user.entity';

export const CreateEnrollmentPolicyProvider: Provider = {
  provide: CreateEnrollmentPolicyHandler,
  inject: [REQUEST],
  useFactory: async (request: Request) => {
    const user = request.user as User;
    const enrollment = new Enrollment();
    enrollment.user = user;
    return new CreateEnrollmentPolicyHandler(enrollment);
  },
};
