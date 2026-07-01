import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type PostMediaType = 'text' | 'image' | 'video' | 'audio' | 'poll';
export type ReactionType = 'like' | 'love' | 'wow' | 'sad';
export type FeedSort = 'recent' | 'popular';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  author: string;

  @Column()
  avatar: string;

  @Column('text')
  content: string;

  @Column({ default: 'text' })
  mediaType: PostMediaType;

  @Column({ type: 'varchar', nullable: true })
  mediaUrl: string | null;

  @Column({ default: 0 })
  likes: number;

  @Column('simple-json', { default: '[]' })
  comments: Array<{
    id: string;
    author: string;
    text: string;
    createdAt: string;
  }>;

  @Column('simple-json', { default: '[]' })
  hashtags: string[];

  @Column('simple-json', { nullable: true })
  poll: {
    options: Array<{ id: string; text: string; votes: number }>;
  } | null;

  @CreateDateColumn()
  createdAt: Date;
}
