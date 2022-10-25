import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CreateModulePolicyHandler } from 'src/authorization/policy-handler/module/create-module-policy.handler';
import { Module } from 'src/module/entities/module.entity';
import { User } from 'src/user/entities/user.entity';

export const CreateModulePolicyProvider: Provider = {
  provide: CreateModulePolicyHandler,
  inject: [REQUEST],
  useFactory: async (request: Request) => {
    const user = request.user as User;
    const module = new Module();
    module.author = user;
    return new CreateModulePolicyHandler(module);
  },
};
