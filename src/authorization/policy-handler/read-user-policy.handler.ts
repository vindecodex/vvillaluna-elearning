import { AppAbility } from '../casl-ability.factory';
import { Action } from '../enums/action.enum';
import { IPolicyHandler } from './policy-handler.interface';
import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';

export class ReadUserPolicyHandler implements IPolicyHandler {
  constructor(private request: Request) {}

  handle(ability: AppAbility) {
    const user = new User();
    user.id = this.request.params.id;
    return ability.can(Action.READ, user);
  }
}
