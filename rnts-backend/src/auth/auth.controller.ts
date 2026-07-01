import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  LoginDto,
  LoginResponseDto,
  MessageResponseDto,
  OtpResendDto,
  OtpSendDto,
  OtpVerifyDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/auth.dto';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(dto);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  register(@Body() dto: RegisterDto): Promise<LoginResponseDto> {
    return this.authService.register(dto);
  }

  @Public()
  @Post('auth/forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  forgotPassword(@Body() dto: ForgotPasswordDto): Promise<MessageResponseDto> {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Post('auth/reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  resetPassword(@Body() dto: ResetPasswordDto): Promise<MessageResponseDto> {
    return this.authService.resetPassword(dto);
  }

  @Public()
  @Post('auth/otp/send')
  @ApiOperation({ summary: 'Send OTP to phone number' })
  sendOtp(@Body() dto: OtpSendDto): Promise<MessageResponseDto> {
    return this.authService.sendOtp(dto);
  }

  @Public()
  @Post('auth/otp/verify')
  @ApiOperation({ summary: 'Verify OTP and login/register' })
  verifyOtp(@Body() dto: OtpVerifyDto): Promise<LoginResponseDto> {
    return this.authService.verifyOtp(dto);
  }

  @Public()
  @Post('auth/otp/resend')
  @ApiOperation({ summary: 'Resend OTP' })
  resendOtp(@Body() dto: OtpResendDto): Promise<MessageResponseDto> {
    return this.authService.resendOtp(dto);
  }
}
