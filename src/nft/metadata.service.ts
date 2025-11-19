import { Injectable } from '@nestjs/common';
//import { NFTStorage, File } from 'nft.storage';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class MetadataService {
  //private readonly client: NFTStorage;

  constructor(
    private readonly configService: ConfigService,
  ) {
    //this.client = new NFTStorage({ token: process.env.NFT_STORAGE_KEY! });
  }

  generateMetadata(params: {
    description: string;
    artistName: string;
  }) {
    const { description, artistName } = params;
    const metadata = {
      name: `NFT`,
      description,
      image: this.getArtworkURI(),
      attributes: [
        { trait_type: 'description', value: description },
        { trait_type: 'Artist', value: artistName },
        { trait_type: 'Theme', value: 'Faith' },
      ],
    };
    return metadata;
  }

  getArtworkURI(): string  {
    return `ipfs//${this.configService.getOrThrow('ARTWORK_URI')}`;
  }
}