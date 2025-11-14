import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NftModule } from './nft/nft.module.js';
import { HealthModule } from './health/health.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    NftModule,
    HealthModule
  ],
})
export class AppModule {}
