import { IsNumber, IsOptional, IsString, IsIn, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const DELIVERY_STATUSES = [
  'pending',
  'accepted',
  'picked_up',
  'in_transit',
  'delivered',
  'cancelled',
] as const;

export class CreateDeliveryOrderDto {
  @ApiProperty()
  @IsString()
  pickupId: string;

  @ApiProperty()
  @IsString()
  dropoffId: string;

  @ApiProperty({ example: 'parcel' })
  @IsString()
  packageType: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  etaMinutes: number;
}

export class DriverLocationDto {
  @ApiProperty()
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @IsNumber()
  longitude: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  recordedAt?: string;
}

export class OrderStatusDto {
  @ApiProperty({ enum: DELIVERY_STATUSES })
  @IsIn(DELIVERY_STATUSES)
  status: (typeof DELIVERY_STATUSES)[number];

  @ApiProperty()
  @IsString()
  label: string;
}
