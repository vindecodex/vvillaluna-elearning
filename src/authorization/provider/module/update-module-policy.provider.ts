import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UpdateModulePolicyHandler } from 'src/authorization/policy-handler/module/update-module-policy.handler';
import { ModuleService } from 'src/module/service/module.service';

export const UpdateModulePolicyProvider: Provider = {
  provide: UpdateModulePolicyHandler,
  inject: [ModuleService, REQUEST],
  useFactory: async (moduleService: ModuleService, request: Request) => {
    const { id } = request.params;
    const module = await moduleService.findOne(+id);
    return new UpdateModulePolicyHandler(module);
  },
};
