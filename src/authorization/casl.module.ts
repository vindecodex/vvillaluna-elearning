import { Module } from '@nestjs/common';
import { CourseModule } from 'src/course/course.module';
import { ModuleModule } from 'src/module/module.module';
import { SubjectModule } from 'src/subject/subject.module';
import { UserModule } from 'src/user/user.module';
import { CaslAbilityFactory } from './factories/casl-ability.factory';
import { coursePolicyProviders } from './provider/course';
import { modulePolicyProviders } from './provider/module';
import { subjectPolicyProviders } from './provider/subject';
import { userPolicyProviders } from './provider/user';

@Module({
  imports: [UserModule, SubjectModule, CourseModule, ModuleModule],
  providers: [
    CaslAbilityFactory,
    ...userPolicyProviders,
    ...subjectPolicyProviders,
    ...coursePolicyProviders,
    ...modulePolicyProviders,
  ],
  exports: [
    CaslAbilityFactory,
    ...userPolicyProviders,
    ...subjectPolicyProviders,
    ...coursePolicyProviders,
    ...modulePolicyProviders,
  ],
})
export class CaslModule {}
