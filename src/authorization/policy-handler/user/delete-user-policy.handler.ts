import { Action } from '../../../authorization/enums/action.enum';
import { PolicyHandler } from '../../../authorization/interfaces/policy-handler.interface';
import { AppAbility } from '../../../authorization/types/app-ability-builder.type';
import { User } from '../../../user/entities/user.entity';

export class DeleteUserPolicyHandler implements PolicyHandler {
  constructor(private user: User) {}

  handle(ability: AppAbility): boolean {
    return ability.can(Action.DELETE, this.user);
  }
}
