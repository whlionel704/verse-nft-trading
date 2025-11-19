import { Module } from '@nestjs/common';
import { NftService } from 'src/nft/nft.service.js';
import { NftController } from 'src/nft/nft.controller.js';
import { MetadataService } from 'src/metadata/metadata.service.js';

@Module({
  controllers: [NftController],
  providers: [NftService, MetadataService],
  exports: [NftService],
})
export class NftModule {}