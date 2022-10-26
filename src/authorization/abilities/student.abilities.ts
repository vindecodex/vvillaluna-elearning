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

export class StudentAbility implements RolesAbility {
  constructor(private abilityBuilder: AppAbilityBuilder, private user: User) {}
  build(): AbilityBuild {
    const { can, build } = this.abilityBuilder;
    const { id } = this.user;

    /***************
     *    USER     *
     ***************/
    can(Action.READ, User, { id });
    can(Action.UPDATE, User, { id });
    can(Action.DELETE, User, { id });
    can(Action.READ, User, { role: Role.INSTRUCTOR });

    /***************
     *   SUBJECT   *
     ***************/
    can(Action.READ, Subject, { isPublished: true });

    /***************
     *   COURSE    *
     ***************/
    can(Action.READ, Course, { isPublished: true });

    /***************
     *   MODULE    *
     ***************/
    can(Action.READ, Module, { isPublished: true });

    /***************
     *   CONTENT   *
     ***************/
    can(Action.READ, Content, { isPublished: true });

    /***************
     * ENROLLMENT  *
     ***************/
    can(Action.READ, Enrollment, {
      'user.role': Role.STUDENT,
      'user.id': id,
    });
    can(Action.UPDATE, Enrollment, { 'user.id': id });
    can(Action.DELETE, Enrollment, { 'user.id': id });

    return build({
      detectSubjectType: (type) =>
        type.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
