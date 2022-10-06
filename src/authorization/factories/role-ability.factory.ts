import { User } from '../../user/entities/user.entity';
import { StudentAbility } from '../abilities/student.abilities';
import { Role } from '../enums/role.enum';
import { AppAbilityBuilder } from '../types/app-ability-builder.type';

const rolesAbilityDraft = {
  admin: (abilityBuilder: AppAbilityBuilder, user: User) =>
    new StudentAbility(abilityBuilder, user),
  instructor: (abilityBuilder: AppAbilityBuilder, user: User) =>
    new StudentAbility(abilityBuilder, user),
  student: (abilityBuilder: AppAbilityBuilder, user: User) =>
    new StudentAbility(abilityBuilder, user),
};

export const roleAbilityFactory = {
  create: (role: Role) => {
    return (abilityBuilder: AppAbilityBuilder, user: User) =>
      rolesAbilityDraft[role](abilityBuilder, user);
  },
};
