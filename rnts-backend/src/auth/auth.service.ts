import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { User } from '../users/entities/user.entity';
import { UserSettings } from '../users/entities/user-settings.entity';
import { UsersService } from '../users/users.service';
import {
  ForgotPasswordDto,
  LoginDto,
  LoginResponseDto,
  OtpResendDto,
  OtpSendDto,
  OtpVerifyDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { OtpToken, PasswordResetToken } from './entities/auth-token.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserSettings)
    private readonly settingsRepository: Repository<UserSettings>,
    @InjectRepository(OtpToken)
    private readonly otpRepository: Repository<OtpToken>,
    @InjectRepository(PasswordResetToken)
    private readonly resetRepository: Repository<PasswordResetToken>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  private async signToken(user: User): Promise<LoginResponseDto> {
    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });
    return {
      id: user.id,
      name: user.name,
      email: user.email ?? '',
      token,
    };
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.signToken(user);
  }

  async register(dto: RegisterDto): Promise<LoginResponseDto> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = this.usersRepository.create({
      email: dto.email,
      name: dto.name ?? dto.email.split('@')[0] ?? 'User',
      passwordHash,
      emailVerified: false,
    });
    await this.usersRepository.save(user);

    const settings = this.settingsRepository.create({ user, lang: 'en' });
    await this.settingsRepository.save(settings);

    return this.signToken(user);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      return { message: 'If the email exists, a reset link has been sent' };
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await this.resetRepository.save(
      this.resetRepository.create({ userId: user.id, token, expiresAt }),
    );

    if (this.configService.get('NODE_ENV') !== 'production') {
      console.log(`[dev] Password reset token for ${dto.email}: ${token}`);
    }

    return { message: 'If the email exists, a reset link has been sent' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const reset = await this.resetRepository.findOne({
      where: { token: dto.token, used: false },
    });
    if (!reset || reset.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const user = await this.usersService.findById(reset.userId);
    user.passwordHash = await bcrypt.hash(dto.password, 12);
    await this.usersRepository.save(user);

    reset.used = true;
    await this.resetRepository.save(reset);

    return { message: 'Password reset successfully' };
  }

  private generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtp(dto: OtpSendDto) {
    const code = this.generateOtpCode();
    const expiresMinutes = this.configService.get<number>('OTP_EXPIRES_MINUTES', 10);
    const expiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000);

    await this.otpRepository.save(
      this.otpRepository.create({ phone: dto.phone, code, expiresAt }),
    );

    if (this.configService.get('NODE_ENV') !== 'production') {
      console.log(`[dev] OTP for ${dto.phone}: ${code}`);
    }

    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(dto: OtpVerifyDto): Promise<LoginResponseDto> {
    const otp = await this.otpRepository.findOne({
      where: { phone: dto.phone, code: dto.code, verified: false },
      order: { createdAt: 'DESC' },
    });

    if (!otp || otp.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    otp.verified = true;
    await this.otpRepository.save(otp);

    let user = await this.usersService.findByPhone(dto.phone);
    if (!user) {
      const passwordHash = await bcrypt.hash(randomBytes(16).toString('hex'), 12);
      user = this.usersRepository.create({
        phone: dto.phone,
        name: dto.phone,
        passwordHash,
        phoneVerified: true,
      });
      await this.usersRepository.save(user);
      const settings = this.settingsRepository.create({ user, lang: 'en' });
      await this.settingsRepository.save(settings);
    } else {
      user.phoneVerified = true;
      await this.usersRepository.save(user);
    }

    return this.signToken(user);
  }

  async resendOtp(dto: OtpResendDto) {
    return this.sendOtp({ phone: dto.phone });
  }
}
