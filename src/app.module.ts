import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { NftModule } from './nft/nft.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,        // <--- important
      envFilePath: '.env',   // loads your environment file
    }),
    NftModule,               // <--- register NFT module
  ],
})
export class AppModule {}
