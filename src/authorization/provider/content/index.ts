import { CreateContentPolicyProvider } from './create-content-policy.provider';
import { DeleteContentPolicyProvider } from './delete-content-policy.provider';
import { ReadContentPolicyProvider } from './read-content-policy.provider';
import { UpdateContentPolicyProvider } from './update-content-policy.provider';

export const contentPolicyProviders = [
  CreateContentPolicyProvider,
  ReadContentPolicyProvider,
  UpdateContentPolicyProvider,
  DeleteContentPolicyProvider,
];
