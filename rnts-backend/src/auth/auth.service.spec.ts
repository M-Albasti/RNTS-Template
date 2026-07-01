import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { UserSettings } from '../users/entities/user-settings.entity';
import { OtpToken, PasswordResetToken } from './entities/auth-token.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    passwordHash: '',
  };

  beforeAll(async () => {
    mockUser.passwordHash = await bcrypt.hash('Password@123', 12);
  });

  const usersRepository = {
    create: jest.fn((data) => ({ id: 2, ...data })),
    save: jest.fn((user) => Promise.resolve(user)),
    findOne: jest.fn(),
  };

  const usersService = {
    findByEmail: jest.fn(),
    findByPhone: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: usersRepository },
        {
          provide: getRepositoryToken(UserSettings),
          useValue: { create: jest.fn(), save: jest.fn() },
        },
        {
          provide: getRepositoryToken(OtpToken),
          useValue: { create: jest.fn(), save: jest.fn(), findOne: jest.fn() },
        },
        {
          provide: getRepositoryToken(PasswordResetToken),
          useValue: { create: jest.fn(), save: jest.fn(), findOne: jest.fn() },
        },
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn().mockResolvedValue('test-token') },
        },
        { provide: UsersService, useValue: usersService },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('development') },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('login returns token for valid credentials', async () => {
    usersService.findByEmail.mockResolvedValue(mockUser);
    const result = await service.login({
      email: 'test@example.com',
      password: 'Password@123',
    });
    expect(result.token).toBe('test-token');
    expect(result.email).toBe('test@example.com');
  });

  it('login throws for invalid password', async () => {
    usersService.findByEmail.mockResolvedValue(mockUser);
    await expect(
      service.login({ email: 'test@example.com', password: 'WrongPass1!' }),
    ).rejects.toThrow('Invalid email or password');
  });
});
