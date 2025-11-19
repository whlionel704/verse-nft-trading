import { Injectable } from '@nestjs/common';
import { createPublicClient, createWalletClient, http } from 'viem';
import { ConfigService } from '@nestjs/config';
import { qbftChain, abi } from '../../blockchain/utils/viem.util.js';
import { MetadataService } from './metadata.service.js';

@Injectable()
export class NftService {
  private publicClient: any;
  private walletClient: any;
  private contractAddress: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly metadataService: MetadataService,
  ) {
    this.contractAddress = this.configService.getOrThrow('NFT_CONTRACT_ADDRESS');
    this.publicClient = createPublicClient({
      chain: qbftChain,
      transport: http(this.configService.getOrThrow('HOST_URL')),
    });
    this.walletClient = createWalletClient({
      account: `0x${this.configService.getOrThrow('ALLOC_1_ADDRESS')}`,
      chain: qbftChain,
      transport: http(this.configService.getOrThrow('HOST_URL'))
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
    //imageFilePath: string,
    artistName: string,
    description: string,
  ) {

    const artworkURI = this.metadataService.getArtworkURI();
    const metadataURI = this.metadataService.generateMetadata({description, artistName});

    // Step 1: Upload image to IPFS to obtain the CID which is the artworkURI
    //const artworkURI = await this.metadataService.uploadLocalImageToIPFS(imageFilePath);

    // Step 2: generateMetaData
    // const metadata = this.metadataService.generateMetadata({
    //   verseReference,
    //   artworkURI,
    //   artistName,
    //   verseText: ''
    // });

    // Step 3: Upload metadata to IPFS to get the token uri - to con
    //const tokenURI = await this.metadataService.uploadMetadataToIPFS(metadata));

    //Calls the smart contract to mint the NFT
    console.log('Minting NFT with the following details:');
    return this.walletClient.writeContract({
      address: this.contractAddress,
      abi,
      functionName: 'mintNft',
      args: [ to, metadataURI, artworkURI, artistName, description ],
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
