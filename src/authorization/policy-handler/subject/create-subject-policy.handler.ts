import { Action } from '../../enums/action.enum';
import { PolicyHandler } from '../../interfaces/policy-handler.interface';
import { AppAbility } from '../../types/app-ability-builder.type';
import { Subject } from 'src/subject/entities/subject.entity';

export class CreateSubjectPolicyHandler implements PolicyHandler {
  constructor(private subject: Subject) {}

  handle(ability: AppAbility) {
    return ability.can(Action.READ, this.subject);
  }
}
