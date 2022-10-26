import { Action } from '../../enums/action.enum';
import { PolicyHandler } from '../../interfaces/policy-handler.interface';
import { AppAbility } from '../../types/app-ability-builder.type';
import { Content } from '../../../content/entities/content.entity';

export class CreateContentPolicyHandler implements PolicyHandler {
  constructor(private content: Content) {}

  handle(ability: AppAbility) {
    return ability.can(Action.CREATE, this.content);
  }
}
