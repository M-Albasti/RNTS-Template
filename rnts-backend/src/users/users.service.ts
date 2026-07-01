import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserSettings } from './entities/user-settings.entity';
import { UpdateSettingsDto } from './dto/settings.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserSettings)
    private readonly settingsRepository: Repository<UserSettings>,
  ) {}

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: { settings: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.phone = :phone', { phone })
      .getOne();
  }

  toProfileResponse(user: User) {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      createdAt: user.createdAt.toISOString(),
      settings: user.settings
        ? {
            lang: user.settings.lang,
            notificationsEnabled: user.settings.notificationsEnabled,
          }
        : { lang: 'en', notificationsEnabled: true },
    };
  }

  async updateSettings(userId: number, dto: UpdateSettingsDto) {
    const user = await this.findById(userId);
    if (!user.settings) {
      user.settings = this.settingsRepository.create({ user, lang: 'en' });
    }
    Object.assign(user.settings, dto);
    await this.settingsRepository.save(user.settings);
    return this.toProfileResponse(user);
  }
}
