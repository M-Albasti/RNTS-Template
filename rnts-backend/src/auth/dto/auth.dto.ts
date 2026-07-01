import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?!.*\s).{6,}$/;

export class LoginDto {
  @ApiProperty({ example: 'mahmoud@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString()
  @MinLength(6)
  @Matches(PASSWORD_REGEX, {
    message:
      'Password must contain uppercase, lowercase, special character, and no spaces',
  })
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString()
  @MinLength(6)
  @Matches(PASSWORD_REGEX, {
    message:
      'Password must contain uppercase, lowercase, special character, and no spaces',
  })
  password: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  name?: string;
}

export class LoginResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  token: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @Matches(PASSWORD_REGEX)
  password: string;
}

export class OtpSendDto {
  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class OtpVerifyDto {
  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class OtpResendDto {
  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class MessageResponseDto {
  @ApiProperty()
  message: string;
}
