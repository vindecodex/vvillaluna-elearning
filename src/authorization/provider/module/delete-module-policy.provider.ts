import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { DeleteModulePolicyHandler } from 'src/authorization/policy-handler/module/delete-module-policy.handler';
import { Module } from 'src/module/entities/module.entity';
import { ModuleService } from 'src/module/service/module.service';

export const DeleteModulePolicyProvider: Provider = {
  provide: DeleteModulePolicyHandler,
  inject: [ModuleService, REQUEST],
  useFactory: async (moduleService: ModuleService, request: Request) => {
    const { id } = request.params;
    const module = await moduleService.findOne(+id);
    return new DeleteModulePolicyHandler(module as Module);
  },
};
