import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ModuleService } from '../../../module/service/module.service';
import { CreateContentPolicyHandler } from '../../../authorization/policy-handler/content/create-content-policy.handler';
import { Content } from '../../../content/entities/content.entity';
import { User } from '../../../user/entities/user.entity';

export const CreateContentPolicyProvider: Provider = {
  provide: CreateContentPolicyHandler,
  inject: [ModuleService, REQUEST],
  useFactory: async (moduleService: ModuleService, request: Request) => {
    const moduleId = +request.body.moduleId;
    const user = request.user as User;
    const content = new Content();
    const module = await moduleService.findOne(moduleId);

    content.author = user;
    content.module = module;
    return new CreateContentPolicyHandler(content);
  },
};
