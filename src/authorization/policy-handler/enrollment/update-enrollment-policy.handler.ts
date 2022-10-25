import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { Action } from '../../enums/action.enum';
import { PolicyHandler } from '../../interfaces/policy-handler.interface';
import { AppAbility } from '../../types/app-ability-builder.type';

export class UpdateEnrollmentPolicyHandler implements PolicyHandler {
  constructor(private enrollment: Enrollment) {}

  handle(ability: AppAbility) {
    return ability.can(Action.UPDATE, this.enrollment);
  }
}
