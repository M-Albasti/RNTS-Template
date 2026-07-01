import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_settings')
export class UserSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'en' })
  lang: 'en' | 'ar';

  @Column({ default: true })
  notificationsEnabled: boolean;

  @OneToOne(() => User, (user) => user.settings, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
