import { Body, Controller, Param, Post, Get } from '@nestjs/common';
import { NftService } from './nft.service.js';
import { MintNftDto, TransferNftDto, BurnNftDto, AddReflectionDto } from './nft.dto.js';

@Controller('nft')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  // --- Read-only endpoints ---
  @Get('token-uri/:tokenId')
  async getTokenURI(@Param('tokenId') tokenId: string) {
    return this.nftService.getTokenURI(Number(tokenId));
  }

  @Get('reflections/:tokenId')
  async getReflections(@Param('tokenId') tokenId: string) {
    return this.nftService.getReflections(Number(tokenId));
  }

  // --- Write endpoints ---
  @Post('mint')
  async mintNft(@Body() body: MintNftDto) {
    return this.nftService.mintNft(
      body.to,
      body.uri,
      //body.imageFilePath,
      body.artistName,
      body.description,
    );
  }

  @Post('transfer')
  async transferNft(@Body() body: TransferNftDto) {
    return this.nftService.transferNft(body.to, body.tokenId);
  }

  @Post('burn')
  async burnNft(@Body() body: BurnNftDto) {
    return this.nftService.burnNft(body.tokenId);
  }

  @Post('add-reflection')
  async addReflection(@Body() body: AddReflectionDto) {
    return this.nftService.addReflection(body.tokenId, body.text, body.anonymity);
  }
}