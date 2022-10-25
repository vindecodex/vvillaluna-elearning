import { CreateCoursePolicyProvider } from './create-course-policy.provider';
import { DeleteCoursePolicyProvider } from './delete-course-policy.provider';
import { ReadCoursePolicyProvider } from './read-course-policy.provider';
import { UpdateCoursePolicyProvider } from './update-course-policy.provider';

export const coursePolicyProviders = [
  CreateCoursePolicyProvider,
  ReadCoursePolicyProvider,
  UpdateCoursePolicyProvider,
  DeleteCoursePolicyProvider,
];
