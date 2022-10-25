import { DeleteUserPolicyProvider } from './delete-user-policy.provider';
import { ReadUserPolicyProvider } from './read-user-policy.provider';
import { UpdateUserPolicyProvider } from './update-user-policy.provider';

export const userPolicyProviders = [
  ReadUserPolicyProvider,
  UpdateUserPolicyProvider,
  DeleteUserPolicyProvider,
];
