import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslAbilityFactory } from '../authorization/factories/casl-ability.factory';
import { ContentController } from './controller/content.controller';
import { Content } from './entities/content.entity';
import { ContentService } from './service/content.service';

@Module({
  imports: [TypeOrmModule.forFeature([Content])],
  controllers: [ContentController],
  providers: [ContentService, CaslAbilityFactory],
  exports: [ContentService],
})
export class ContentModule {}
