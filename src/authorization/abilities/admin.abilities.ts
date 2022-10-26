import { ExtractSubjectType } from '@casl/ability';
import { Content } from '../../content/entities/content.entity';
import { Course } from '../../course/entities/course.entity';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';
import { Module } from '../../module/entities/module.entity';
import { Subject } from '../../subject/entities/subject.entity';
import { User } from '../../user/entities/user.entity';
import { Action } from '../enums/action.enum';
import { Role } from '../enums/role.enum';
import { RolesAbility } from '../interfaces/roles-ability.interface';
import { AbilityBuild } from '../types/ability-build.type';
import { AppAbilityBuilder, Subjects } from '../types/app-ability-builder.type';

export class AdminAbility implements RolesAbility {
  constructor(private abilityBuilder: AppAbilityBuilder, private user: User) {}
  build(): AbilityBuild {
    const { can, cannot, build } = this.abilityBuilder;
    const { id } = this.user;

    /***************
     *    USER     *
     ***************/
    can(Action.READ, User);
    can(Action.DELETE, User);
    can(Action.UPDATE, User, { id: this.user.id });

    /***************
     *   SUBJECT   *
     ***************/
    can(Action.READ, Subject);
    can(Action.DELETE, Subject);
    cannot(Action.CREATE, Subject);
    cannot(Action.UPDATE, Subject);

    /***************
     *   COURSE    *
     ***************/
    can(Action.READ, Course);
    can(Action.DELETE, Course);
    cannot(Action.CREATE, Course);
    cannot(Action.UPDATE, Course);

    /***************
     *   MODULE    *
     ***************/
    can(Action.READ, Module);
    can(Action.DELETE, Module);
    cannot(Action.CREATE, Module);
    cannot(Action.UPDATE, Module);

    /***************
     *   CONTENT   *
     ***************/
    can(Action.READ, Content);
    can(Action.DELETE, Content);
    cannot(Action.CREATE, Content);
    cannot(Action.UPDATE, Content);

    /***************
     * ENROLLMENT  *
     ***************/
    can(Action.READ, Enrollment, {
      'user.role': Role.ADMIN,
      'user.id': id,
    });
    cannot(Action.UPDATE, Enrollment);
    can(Action.DELETE, Enrollment);

    return build({
      detectSubjectType: (type) =>
        type.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
