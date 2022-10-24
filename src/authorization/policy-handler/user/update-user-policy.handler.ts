import { Action } from 'src/authorization/enums/action.enum';
import { PolicyHandler } from 'src/authorization/interfaces/policy-handler.interface';
import { AppAbility } from 'src/authorization/types/app-ability-builder.type';
import { User } from 'src/user/entities/user.entity';

export class UpdateUserPolicyHandler implements PolicyHandler {
  constructor(private user: User) {}
  handle(ability: AppAbility) {
    return ability.can(Action.UPDATE, this.user);
  }
}
