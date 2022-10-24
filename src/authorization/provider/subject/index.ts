import { CreateSubjectPolicyProvider } from './create-subject-policy.provider';
import { DeleteSubjectPolicyProvider } from './delete-subject-policy.provider';
import { ReadSubjectPolicyProvider } from './read-subject-policy.provider';
import { UpdateSubjectPolicyProvider } from './update-subject-policy.provider';

export const subjectPolicyProviders = [
  CreateSubjectPolicyProvider,
  ReadSubjectPolicyProvider,
  UpdateSubjectPolicyProvider,
  DeleteSubjectPolicyProvider,
];
