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
  imageFilePath!: string;

  @IsString()
  @IsNotEmpty()
  artistName!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;
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