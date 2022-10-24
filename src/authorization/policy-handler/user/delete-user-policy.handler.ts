import { Action } from 'src/authorization/enums/action.enum';
import { PolicyHandler } from 'src/authorization/interfaces/policy-handler.interface';
import { AppAbility } from 'src/authorization/types/app-ability-builder.type';
import { User } from 'src/user/entities/user.entity';

export class DeleteUserPolicyHandler implements PolicyHandler {
  constructor(private user: User) {}

  handle(ability: AppAbility): boolean {
    return ability.can(Action.DELETE, this.user);
  }
}
