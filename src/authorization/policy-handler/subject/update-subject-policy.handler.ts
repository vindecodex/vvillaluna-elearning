import { Subject } from '../../../subject/entities/subject.entity';
import { Action } from '../../enums/action.enum';
import { PolicyHandler } from '../../interfaces/policy-handler.interface';
import { AppAbility } from '../../types/app-ability-builder.type';

export class UpdateSubjectPolicyHandler implements PolicyHandler {
  constructor(private subject: Subject) {}

  handle(ability: AppAbility) {
    return ability.can(Action.UPDATE, this.subject);
  }
}
