import { Action } from '../../enums/action.enum';
import { PolicyHandler } from '../../interfaces/policy-handler.interface';
import { AppAbility } from '../../types/app-ability-builder.type';
import { Module } from '../../../module/entities/module.entity';

export class CreateModulePolicyHandler implements PolicyHandler {
  constructor(private module: Module) {}

  handle(ability: AppAbility) {
    return ability.can(Action.CREATE, this.module);
  }
}
