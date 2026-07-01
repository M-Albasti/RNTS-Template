import { PartialType } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsIn(['en', 'ar'])
  lang?: 'en' | 'ar';

  @IsOptional()
  notificationsEnabled?: boolean;
}

export class SettingsResponseDto extends PartialType(UpdateSettingsDto) {}
