import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ReadModulePolicyHandler } from 'src/authorization/policy-handler/module/read-module-policy.handler';
import { ModuleService } from 'src/module/service/module.service';

export const ReadModulePolicyProvider: Provider = {
  provide: ReadModulePolicyHandler,
  inject: [ModuleService, REQUEST],
  useFactory: async (moduleService: ModuleService, request: Request) => {
    const { id } = request.params;
    const module = await moduleService.findOne(+id);
    return new ReadModulePolicyHandler(module);
  },
};
