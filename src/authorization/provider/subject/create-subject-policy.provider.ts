import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CreateSubjectPolicyHandler } from 'src/authorization/policy-handler/subject/create-subject-policy.handler';
import { Subject } from 'src/subject/entities/subject.entity';
import { User } from 'src/user/entities/user.entity';

export const CreateSubjectPolicyProvider: Provider = {
  provide: CreateSubjectPolicyHandler,
  inject: [REQUEST],
  useFactory: async (request: Request) => {
    const user = request.user as User;
    const subject = new Subject();
    subject.owner = user;
    return new CreateSubjectPolicyHandler(subject);
  },
};
