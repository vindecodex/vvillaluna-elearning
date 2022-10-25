import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ReadUserPolicyHandler } from 'src/authorization/policy-handler/user/read-user-policy.handler';
import { UserService } from 'src/user/service/user.service';

export const ReadUserPolicyProvider: Provider = {
  provide: ReadUserPolicyHandler,
  inject: [UserService, REQUEST],
  useFactory: async (userService: UserService, request: Request) => {
    const { id } = request.params;
    const user = await userService.findOne(id);
    return new ReadUserPolicyHandler(user);
  },
};
