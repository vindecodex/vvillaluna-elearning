import { AnyAbility } from '@casl/ability';
import { AppAbility } from './app-ability-builder.type';

/*
 * Return type for actual casl build method
 * Aliased with `AbilityBuild`
 */
export type AbilityBuild = AppAbility & AnyAbility;
