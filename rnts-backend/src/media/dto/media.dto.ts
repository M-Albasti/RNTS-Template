import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAudioDto {
  @ApiProperty()
  @IsString()
  savedFileName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  artist?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  album?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  artwork?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  duration?: number;
}

export class CreateVideoDto {
  @ApiProperty()
  @IsString()
  savedFileName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thumb?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  sources?: string[];
}

export class UploadResponseDto {
  @ApiProperty()
  savedFileName: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  mimeType: string;

  @ApiProperty()
  size: number;
}
