import { CreateModulePolicyProvider } from './create-module-policy.provider';
import { DeleteModulePolicyProvider } from './delete-module-policy.provider';
import { ReadModulePolicyProvider } from './read-module-policy.provider';
import { UpdateModulePolicyProvider } from './update-module-policy.provider';

export const modulePolicyProviders = [
  CreateModulePolicyProvider,
  ReadModulePolicyProvider,
  UpdateModulePolicyProvider,
  DeleteModulePolicyProvider,
];
