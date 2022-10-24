import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslAbilityFactory } from '../authorization/factories/casl-ability.factory';
import { UserController } from './controller/user.controller';
import { User } from './entities/user.entity';
import { UserService } from './service/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, CaslAbilityFactory],
  exports: [UserService],
})
export class UserModule {}
