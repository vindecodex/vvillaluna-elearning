import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UpdateUserPolicyHandler } from '../../../authorization/policy-handler/user/update-user-policy.handler';
import { User } from '../../../user/entities/user.entity';

export const UpdateUserPolicyProvider: Provider = {
  provide: UpdateUserPolicyHandler,
  inject: [REQUEST],
  useFactory: async (request: Request) => {
    const { id } = request.params;
    const user = new User();
    user.id = id;
    return new UpdateUserPolicyHandler(user);
  },
};
