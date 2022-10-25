import { CreateEnrollmentPolicyProvider } from './create-enrollment-policy.provider';
import { DeleteEnrollmentPolicyProvider } from './delete-enrollment-policy.provider';
import { ReadEnrollmentPolicyProvider } from './read-enrollment-policy.provider';
import { UpdateEnrollmentPolicyProvider } from './update-enrollment-policy.provider';

export const enrollmentPolicyProviders = [
  CreateEnrollmentPolicyProvider,
  ReadEnrollmentPolicyProvider,
  UpdateEnrollmentPolicyProvider,
  DeleteEnrollmentPolicyProvider,
];
