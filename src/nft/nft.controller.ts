import { Body, Controller, Param, Post, Get } from '@nestjs/common';
import { NftContract } from './nft.contract.js';
import { MintNftDto, TransferNftDto, BurnNftDto, AddReflectionDto } from './nft.dto.js';

@Controller('nft')
export class NftController {
  constructor(private readonly nftContract: NftContract) {}

  // --- Read-only endpoints ---
  @Get('token-uri/:tokenId')
  async getTokenURI(@Param('tokenId') tokenId: string) {
    return this.nftContract.getTokenURI(Number(tokenId));
  }

  @Get('reflections/:tokenId')
  async getReflections(@Param('tokenId') tokenId: string) {
    return this.nftContract.getReflections(Number(tokenId));
  }

  // --- Write endpoints ---
  @Post('mint')
  async mintNft(@Body() body: MintNftDto) {
    return this.nftContract.mintNft(
      body.to,
      body.uri,
      body.verseReference,
      body.artworkURI,
      body.artistName,
      body.verseText
    );
  }

  @Post('transfer')
  async transferNft(@Body() body: TransferNftDto) {
    return this.nftContract.transferNft(body.to, body.tokenId);
  }

  @Post('burn')
  async burnNft(@Body() body: BurnNftDto) {
    return this.nftContract.burnNft(body.tokenId);
  }

  @Post('add-reflection')
  async addReflection(@Body() body: AddReflectionDto) {
    return this.nftContract.addReflection(body.tokenId, body.text, body.anonymity);
  }
}