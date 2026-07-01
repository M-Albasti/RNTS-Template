import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('media_files')
export class MediaFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  savedFileName: string;

  @Column()
  originalName: string;

  @Column()
  mimeType: string;

  @Column({ type: 'integer' })
  size: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  user: User | null;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('audios')
export class Audio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  artist: string;

  @Column()
  album: string;

  @Column()
  artwork: string;

  @Column()
  url: string;

  @Column({ nullable: true, type: 'real' })
  duration: number | null;

  @Column()
  savedFileName: string;

  @ManyToOne(() => User, (user) => user.audios, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  subtitle: string;

  @Column()
  thumb: string;

  @Column('simple-json')
  sources: string[];

  @Column()
  savedFileName: string;

  @ManyToOne(() => User, (user) => user.videos, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
