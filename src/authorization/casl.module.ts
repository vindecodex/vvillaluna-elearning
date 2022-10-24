import { Module } from '@nestjs/common';
import { CourseModule } from 'src/course/course.module';
import { SubjectModule } from 'src/subject/subject.module';
import { UserModule } from 'src/user/user.module';
import { CaslAbilityFactory } from './factories/casl-ability.factory';
import { coursePolicyProviders } from './provider/course';
import { subjectPolicyProviders } from './provider/subject';
import { userPolicyProviders } from './provider/user';

@Module({
  imports: [UserModule, SubjectModule, CourseModule],
  providers: [
    CaslAbilityFactory,
    ...userPolicyProviders,
    ...subjectPolicyProviders,
    ...coursePolicyProviders,
  ],
  exports: [
    CaslAbilityFactory,
    ...userPolicyProviders,
    ...subjectPolicyProviders,
    ...coursePolicyProviders,
  ],
})
export class CaslModule {}
