import { Action } from '../../enums/action.enum';
import { PolicyHandler } from '../../interfaces/policy-handler.interface';
import { AppAbility } from '../../types/app-ability-builder.type';
import { Content } from 'src/content/entities/content.entity';

export class DeleteContentPolicyHandler implements PolicyHandler {
  constructor(private content: Content) {}

  handle(ability: AppAbility) {
    return ability.can(Action.DELETE, this.content);
  }
}