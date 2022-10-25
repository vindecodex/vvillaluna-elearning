import { Course } from 'src/course/entities/course.entity';
import { Action } from '../../enums/action.enum';
import { PolicyHandler } from '../../interfaces/policy-handler.interface';
import { AppAbility } from '../../types/app-ability-builder.type';

export class UpdateCoursePolicyHandler implements PolicyHandler {
  constructor(private course: Course) {}

  handle(ability: AppAbility) {
    return ability.can(Action.UPDATE, this.course);
  }
}
