import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { DeleteModulePolicyHandler } from '../../../authorization/policy-handler/module/delete-module-policy.handler';
import { ModuleService } from '../../../module/service/module.service';

export const DeleteModulePolicyProvider: Provider = {
  provide: DeleteModulePolicyHandler,
  inject: [ModuleService, REQUEST],
  useFactory: async (moduleService: ModuleService, request: Request) => {
    const { id } = request.params;
    const module = await moduleService.findOne(+id);
    return new DeleteModulePolicyHandler(module);
  },
};
