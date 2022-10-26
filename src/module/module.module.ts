import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleController } from './controller/module.controller';
import { ModuleService } from './service/module.service';
import { Module as ModuleEntity } from './entities/module.entity';
import { CaslAbilityFactory } from '../authorization/factories/casl-ability.factory';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleEntity])],
  controllers: [ModuleController],
  providers: [ModuleService, CaslAbilityFactory],
  exports: [ModuleService],
})
export class ModuleModule {}
