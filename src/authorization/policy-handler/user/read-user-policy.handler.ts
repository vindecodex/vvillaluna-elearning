import { Action } from '../../enums/action.enum';
import { Request } from 'express';
import { User } from '../../../user/entities/user.entity';
import { PolicyHandler } from '../../interfaces/policy-handler.interface';
import { AppAbility } from '../../types/app-ability-builder.type';

export class ReadUserPolicyHandler implements PolicyHandler {
  constructor(private request: Request) {}

  handle(ability: AppAbility) {
    const user = new User();
    user.id = this.request.params.id;
    return ability.can(Action.READ, user);
  }
}
