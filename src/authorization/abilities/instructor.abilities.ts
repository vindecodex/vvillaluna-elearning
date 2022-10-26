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

export class InstructorAbility implements RolesAbility {
  constructor(private abilityBuilder: AppAbilityBuilder, private user: User) {}
  build(): AbilityBuild {
    const { can, cannot, build } = this.abilityBuilder;
    const { id } = this.user;
    const { INSTRUCTOR, STUDENT } = Role;

    /***************
     *    USER     *
     ***************/
    can(Action.READ, User, { id });
    can(Action.UPDATE, User, { id });
    can(Action.DELETE, User, { id });
    can(Action.READ, User, { role: { $in: [INSTRUCTOR, STUDENT] } });

    /***************
     *   SUBJECT   *
     ***************/
    can(Action.READ, Subject, { 'owner.id': id });
    can(Action.DELETE, Subject, { 'owner.id': id });
    can(Action.UPDATE, Subject, { 'owner.id': id });
    can(Action.CREATE, Subject, { 'owner.role': INSTRUCTOR });

    /***************
     *   COURSE    *
     ***************/
    can(Action.READ, Course, { 'author.id': id });
    can(Action.DELETE, Course, { 'author.id': id });
    can(Action.UPDATE, Course, { 'author.id': id });
    can(Action.CREATE, Course, { 'author.role': INSTRUCTOR });

    /***************
     *   MODULE    *
     ***************/
    can(Action.READ, Module, { 'author.id': id });
    can(Action.DELETE, Module, { 'author.id': id });
    can(Action.UPDATE, Module, { 'author.id': id });
    can(Action.CREATE, Module, { 'author.role': INSTRUCTOR });

    /***************
     *   CONTENT   *
     ***************/
    can(Action.READ, Content, { 'author.id': id });
    can(Action.DELETE, Content, { 'author.id': id });
    can(Action.UPDATE, Content, { 'author.id': id });
    can(Action.CREATE, Content, { 'author.role': INSTRUCTOR });

    /***************
     * ENROLLMENT  *
     ***************/
    cannot(Action.MANAGE, Enrollment);

    return build({
      detectSubjectType: (type) =>
        type.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
