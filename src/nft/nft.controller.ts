import { Body, Controller, Param, Post, Get } from '@nestjs/common';
import { NftService } from 'src/nft/nft.service.js';
import { MintNftDto, TransferNftDto, BurnNftDto, AddReflectionDto } from 'src/nft/nft.dto.js';

@Controller('nft')
export class NftController {
  constructor(private readonly NftService: NftService) {}

  // --- Read-only endpoints ---
  @Get('token-uri/:tokenId')
  async getTokenURI(@Param('tokenId') tokenId: string) {
    return this.NftService.getTokenURI(Number(tokenId));
  }

  @Get('reflections/:tokenId')
  async getReflections(@Param('tokenId') tokenId: string) {
    return this.NftService.getReflections(Number(tokenId));
  }

  // --- Write endpoints ---
  @Post('mint')
  async mintNft(@Body() body: MintNftDto) {
    return this.NftService.mintNft(
      body.to,
      body.uri,
      //body.imageFilePath,
      body.artistName,
      body.description,
    );
  }

  @Post('transfer')
  async transferNft(@Body() body: TransferNftDto) {
    return this.NftService.transferNft(body.to, body.tokenId);
  }

  @Post('burn')
  async burnNft(@Body() body: BurnNftDto) {
    return this.NftService.burnNft(body.tokenId);
  }

  @Post('add-reflection')
  async addReflection(@Body() body: AddReflectionDto) {
    return this.NftService.addReflection(body.tokenId, body.text, body.anonymity);
  }
}