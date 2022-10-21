import { User } from '../../user/entities/user.entity';
import { AdminAbility } from '../abilities/admin.abilities';
import { InstructorAbility } from '../abilities/instructor.abilities';
import { StudentAbility } from '../abilities/student.abilities';
import { Role } from '../enums/role.enum';
import { RolesAbility } from '../interfaces/roles-ability.interface';
import { AppAbilityBuilder } from '../types/app-ability-builder.type';

/*
 * Used by rolesAbilityFactory
 * A function that returns a hashmap with [key=Role, value=RolesAbility]
 */
const rolesAbilityDraft = (abilityBuilder: AppAbilityBuilder, user: User) => ({
  admin: (): RolesAbility => new AdminAbility(abilityBuilder, user),
  instructor: (): RolesAbility => new InstructorAbility(abilityBuilder, user),
  student: (): RolesAbility => new StudentAbility(abilityBuilder, user),
});

/*
 * Handles which ability to be used
 * depends on what the role of a user
 *
 * usage: roleAbilityFactory.create(role: Role);
 * returns: class that implements RolesAbility build method
 */
export const roleAbilityFactory = {
  create: (role: Role) => {
    return (abilityBuilder: AppAbilityBuilder, user: User) =>
      rolesAbilityDraft(abilityBuilder, user)[role];
  },
};
