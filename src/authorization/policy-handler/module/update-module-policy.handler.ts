import { Module } from 'src/module/entities/module.entity';
import { Action } from '../../enums/action.enum';
import { PolicyHandler } from '../../interfaces/policy-handler.interface';
import { AppAbility } from '../../types/app-ability-builder.type';

export class UpdateModulePolicyHandler implements PolicyHandler {
  constructor(private module: Module) {}

  handle(ability: AppAbility) {
    return ability.can(Action.UPDATE, this.module);
  }
}
