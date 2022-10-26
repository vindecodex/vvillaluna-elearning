import { AbilityBuilder, InferSubjects, PureAbility } from '@casl/ability';
import { Content } from '../../content/entities/content.entity';
import { Course } from '../../course/entities/course.entity';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';
import { Module } from '../../module/entities/module.entity';
import { Subject } from '../../subject/entities/subject.entity';
import { User } from '../../user/entities/user.entity';
import { Action } from '../enums/action.enum';

export type Subjects = InferSubjects<
  | typeof User
  | typeof Subject
  | typeof Course
  | typeof Module
  | typeof Content
  | typeof Enrollment
  | 'all'
>;
export type AppAbility = PureAbility<[Action, Subjects]>;
export type AppAbilityBuilder = AbilityBuilder<AppAbility>;
