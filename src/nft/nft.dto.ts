import { IsString, IsNotEmpty, IsBoolean, IsNumber } from 'class-validator';

export class MintNftDto {
  @IsString()
  @IsNotEmpty()
  to!: string;

  @IsString()
  @IsNotEmpty()
  uri!: string;

  @IsString()
  @IsNotEmpty()
  verseReference!: string;

  @IsString()
  @IsNotEmpty()
  artworkURI!: string;

  @IsString()
  @IsNotEmpty()
  artistName!: string;

  @IsString()
  verseText!: string; // optional text can be empty
}

export class TransferNftDto {
  @IsString()
  @IsNotEmpty()
  to!: string;

  @IsNumber()
  tokenId!: number;
}

export class BurnNftDto {
  @IsNumber()
  tokenId!: number;
}

export class AddReflectionDto {
  @IsNumber()
  tokenId!: number;

  @IsString()
  @IsNotEmpty()
  text!: string;

  @IsBoolean()
  anonymity!: boolean;
}