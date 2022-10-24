import { Module } from '@nestjs/common';
import { SubjectModule } from 'src/subject/subject.module';
import { UserModule } from 'src/user/user.module';
import { CaslAbilityFactory } from './factories/casl-ability.factory';
import { subjectPolicyProviders } from './provider/subject';
import { userPolicyProviders } from './provider/user';

@Module({
  imports: [UserModule, SubjectModule],
  providers: [
    CaslAbilityFactory,
    ...userPolicyProviders,
    ...subjectPolicyProviders,
  ],
  exports: [
    CaslAbilityFactory,
    ...userPolicyProviders,
    ...subjectPolicyProviders,
  ],
})
export class CaslModule {}
