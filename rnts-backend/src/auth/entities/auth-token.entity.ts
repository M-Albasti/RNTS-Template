import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('otp_tokens')
export class OtpToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column()
  code: string;

  @Column()
  expiresAt: Date;

  @Column({ default: false })
  verified: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('password_reset_tokens')
export class PasswordResetToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ unique: true })
  token: string;

  @Column()
  expiresAt: Date;

  @Column({ default: false })
  used: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
