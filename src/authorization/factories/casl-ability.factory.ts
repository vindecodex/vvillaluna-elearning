import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  PureAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { Action } from '../enums/action.enum';
import { AppAbility, Subjects } from '../types/app-ability-builder.type';
import { roleAbilityFactory } from './role-ability.factory';

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const abilityBuilder = new AbilityBuilder<PureAbility<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );

    const userAbility = roleAbilityFactory.getFor(user).using(abilityBuilder);

    return userAbility.build();
  }
}
