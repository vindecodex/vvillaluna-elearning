import { Module } from '@nestjs/common';
import { ContentModule } from '../content/content.module';
import { CourseModule } from '../course/course.module';
import { EnrollmentModule } from '../enrollment/enrollment.module';
import { ModuleModule } from '../module/module.module';
import { SubjectModule } from '../subject/subject.module';
import { UserModule } from '../user/user.module';
import { CaslAbilityFactory } from './factories/casl-ability.factory';
import { contentPolicyProviders } from './provider/content';
import { coursePolicyProviders } from './provider/course';
import { enrollmentPolicyProviders } from './provider/enrollment';
import { modulePolicyProviders } from './provider/module';
import { subjectPolicyProviders } from './provider/subject';
import { userPolicyProviders } from './provider/user';

@Module({
  imports: [
    UserModule,
    SubjectModule,
    CourseModule,
    ModuleModule,
    ContentModule,
    EnrollmentModule,
  ],
  providers: [
    CaslAbilityFactory,
    ...userPolicyProviders,
    ...subjectPolicyProviders,
    ...coursePolicyProviders,
    ...modulePolicyProviders,
    ...contentPolicyProviders,
    ...enrollmentPolicyProviders,
  ],
  exports: [
    CaslAbilityFactory,
    ...userPolicyProviders,
    ...subjectPolicyProviders,
    ...coursePolicyProviders,
    ...modulePolicyProviders,
    ...contentPolicyProviders,
    ...enrollmentPolicyProviders,
  ],
})
export class CaslModule {}
