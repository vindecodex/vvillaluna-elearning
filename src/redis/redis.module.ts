import { CacheModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (config: ConfigService) => ({
        store: redisStore,
        port: +config.get('REDIS_PORT'),
        host: config.get('REDIS_HOST'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class RedisModule {}
