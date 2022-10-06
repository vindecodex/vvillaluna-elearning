import { Ability, AbilityBuilder, InferSubjects } from '@casl/ability';
import { User } from '../../user/entities/user.entity';
import { Action } from '../enums/action.enum';

export type Subjects = InferSubjects<typeof User> | 'all';
export type AppAbility = Ability<[Action, Subjects]>;
export type AppAbilityBuilder = AbilityBuilder<AppAbility>;
