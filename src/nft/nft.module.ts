import { Module } from '@nestjs/common';
import { NftService } from './nft.service.js';
import { NftController } from './nft.controller.js';
import { MetadataService } from './metadata.service.js';

@Module({
  controllers: [NftController],
  providers: [NftService, MetadataService],
  exports: [NftService, MetadataService],
})
export class NftModule {}