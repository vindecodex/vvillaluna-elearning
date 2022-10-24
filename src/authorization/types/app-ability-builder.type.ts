import { Ability, AbilityBuilder, InferSubjects } from '@casl/ability';
import { Content } from 'src/content/entities/content.entity';
import { Course } from 'src/course/entities/course.entity';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { Module } from 'src/module/entities/module.entity';
import { Subject } from 'src/subject/entities/subject.entity';
import { User } from '../../user/entities/user.entity';
import { Action } from '../enums/action.enum';

export type Subjects =
  | InferSubjects<
      | typeof User
      | typeof Subject
      | typeof Course
      | typeof Module
      | typeof Content
      | typeof Enrollment
    >
  | 'all';
export type AppAbility = Ability<[Action, Subjects]>;
export type AppAbilityBuilder = AbilityBuilder<AppAbility>;
