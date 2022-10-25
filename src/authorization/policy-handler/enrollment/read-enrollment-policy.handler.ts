import { Action } from '../../enums/action.enum';
import { PolicyHandler } from '../../interfaces/policy-handler.interface';
import { AppAbility } from '../../types/app-ability-builder.type';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';

export class ReadEnrollmentPolicyHandler implements PolicyHandler {
  constructor(private enrollment: Enrollment) {}

  handle(ability: AppAbility) {
    return ability.can(Action.READ, this.enrollment);
  }
}
