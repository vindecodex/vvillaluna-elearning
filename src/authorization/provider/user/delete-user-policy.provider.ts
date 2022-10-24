import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { DeleteUserPolicyHandler } from 'src/authorization/policy-handler/user/delete-user-policy.handler';
import { User } from 'src/user/entities/user.entity';

export const DeleteUserPolicyProvider: Provider = {
  provide: DeleteUserPolicyHandler,
  inject: [REQUEST],
  useFactory: async (request: Request) => {
    const { id } = request.params;
    const user = new User();
    user.id = id;
    return new DeleteUserPolicyHandler(user);
  },
};
