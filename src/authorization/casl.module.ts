import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { CaslAbilityFactory } from './factories/casl-ability.factory';
import { ReadUserPolicyProvider } from './provider/user/read-user-policy.provider';

@Module({
  imports: [UserModule],
  providers: [CaslAbilityFactory, ReadUserPolicyProvider],
  exports: [CaslAbilityFactory, ReadUserPolicyProvider],
})
export class CaslModule {}
