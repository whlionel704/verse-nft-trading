import { Injectable } from '@nestjs/common';
import { createPublicClient, createWalletClient, http } from 'viem';
import { abi, qbftChain } from 'blockchain/utils/viem.util.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NftContract {
  private publicClient: any;
  private walletClient: any;
  private contractAddress: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.contractAddress = this.configService.get<string>('VERSE_NFT_CONTRACT_ADDRESS');
    this.publicClient = createPublicClient({
      chain: qbftChain,
      transport: http(this.configService.get<string>('HOST_URL')),
    });
    this.walletClient = createWalletClient({
      chain: qbftChain,
      transport: http(this.configService.get<string>('HOST_URL'))
    })
  }

  // --- Read-only calls ---

  async getTokenURI(tokenId: number): Promise<string> {
    return this.publicClient.readContract({
      address: this.contractAddress,
      abi,
      functionName: 'tokenURI',
      args: [BigInt(tokenId)],
    });
  }

  async getReflections(tokenId: number) {
    return this.publicClient.readContract({
      address: this.contractAddress,
      abi,
      functionName: 'getReflections',
      args: [BigInt(tokenId)],
    });
  }

  // --- Write transactions via signer (user wallet) ---

  async mintNft(
    to: string,
    uri: string,
    verseReference: string,
    artworkURI: string,
    artistName: string,
    verseText: string
  ) {
    return this.walletClient.writeContract({
      address: this.contractAddress,
      abi,
      functionName: 'mintNft',
      args: [ to, uri, verseReference, artworkURI, artistName, verseText ],
    });
  }

  async transferNft(
    to: string,
    tokenId: number
  ) {
    return this.walletClient.writeContract({
      address: this.contractAddress,
      abi,
      functionName: 'transferNft',
      args: [ to, tokenId ],
    });
  }

  async burnNft(tokenId: number) {
    return this.walletClient.writeContract({
      address: this.contractAddress,
      abi,
      functionName: 'burnNft',
      args: [ tokenId ],
    });
  } 

  async addReflection(
    tokenId: number,
    text: string,
    anonymity: boolean
  ) {
    return this.walletClient.writeContract({
      address: this.contractAddress,
      abi,
      functionName: 'addReflection',
      args: [BigInt(tokenId), text, anonymity],
    });
  }
}
