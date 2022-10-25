import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CreateContentPolicyHandler } from 'src/authorization/policy-handler/content/create-content-policy.handler';
import { Content } from 'src/content/entities/content.entity';
import { User } from 'src/user/entities/user.entity';

export const CreateContentPolicyProvider: Provider = {
  provide: CreateContentPolicyHandler,
  inject: [REQUEST],
  useFactory: async (request: Request) => {
    const user = request.user as User;
    const content = new Content();
    content.author = user;
    return new CreateContentPolicyHandler(content);
  },
};
