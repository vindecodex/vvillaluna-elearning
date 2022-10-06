import { AppAbility } from '../types/app-ability-builder.type';

export interface PolicyHandler {
  handle(ability: AppAbility): boolean;
}
