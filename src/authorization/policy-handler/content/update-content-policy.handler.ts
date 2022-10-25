import { Content } from 'src/content/entities/content.entity';
import { Action } from '../../enums/action.enum';
import { PolicyHandler } from '../../interfaces/policy-handler.interface';
import { AppAbility } from '../../types/app-ability-builder.type';

export class UpdateContentPolicyHandler implements PolicyHandler {
  constructor(private content: Content) {}

  handle(ability: AppAbility) {
    return ability.can(Action.UPDATE, this.content);
  }
}
