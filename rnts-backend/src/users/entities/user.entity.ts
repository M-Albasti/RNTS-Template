import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Audio, Video } from '../../media/entities/media.entity';
import { UserSettings } from './user-settings.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', unique: true, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', select: false })
  passwordHash: string;

  @Column({ type: 'varchar', nullable: true })
  photoURL: string | null;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ default: false })
  phoneVerified: boolean;

  @Column({ type: 'varchar', nullable: true })
  firebaseUid: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => UserSettings, (settings) => settings.user, { cascade: true })
  settings: UserSettings;

  @OneToMany(() => Audio, (audio) => audio.user)
  audios: Audio[];

  @OneToMany(() => Video, (video) => video.user)
  videos: Video[];
}
