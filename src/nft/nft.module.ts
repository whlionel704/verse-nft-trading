import { Module } from '@nestjs/common';
import { NftContract } from './nft.contract.js';
import { NftController } from './nft.controller.js';

@Module({
  controllers: [NftController],
  providers: [NftContract],
  exports: [NftContract],
})
export class NftModule {}