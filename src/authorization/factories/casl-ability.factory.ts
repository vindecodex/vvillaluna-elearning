import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { Action } from '../enums/action.enum';
import { AppAbility, Subjects } from '../types/app-ability-builder.type';
import { roleAbilityFactory } from './role-ability.factory';

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const abilityBuilder = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );

    const setRolesAbility = roleAbilityFactory.create(user.role);
    const ability = setRolesAbility(abilityBuilder, user);
    const builder = ability();

    return builder.build();
  }
}
