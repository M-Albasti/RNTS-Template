import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserSettings } from '../users/entities/user-settings.entity';
import { Post } from '../feed/entities/post.entity';
import { DeliveryOrder } from '../delivery/entities/delivery-order.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserSettings)
    private readonly settingsRepository: Repository<UserSettings>,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(DeliveryOrder)
    private readonly ordersRepository: Repository<DeliveryOrder>,
  ) {}

  async onModuleInit() {
    await this.seedUsers();
    await this.seedFeed();
    await this.seedDeliveryOrders();
  }

  private async seedUsers() {
    const count = await this.usersRepository.count();
    if (count > 0) return;

    const users = [
      {
        email: 'mahmoud@gmail.com',
        name: 'Mahmoud Albasti',
        password: 'Password@123',
      },
      {
        email: 'albasti@gmail.com',
        name: 'Albasti Mahmoud',
        password: 'Password@1234',
      },
    ];

    for (const entry of users) {
      const user = this.usersRepository.create({
        email: entry.email,
        name: entry.name,
        passwordHash: await bcrypt.hash(entry.password, 12),
        emailVerified: true,
      });
      await this.usersRepository.save(user);
      await this.settingsRepository.save(
        this.settingsRepository.create({ user, lang: 'en' }),
      );
    }

    console.log('[seed] Created demo users (see README for credentials)');
  }

  private async seedFeed() {
    const count = await this.postsRepository.count();
    if (count > 0) return;

    const posts: Partial<Post>[] = [
      {
        author: 'Mahmoud',
        avatar: 'https://i.pravatar.cc/100?u=1',
        content: 'Welcome to RNTS social feed! #welcome #rnts',
        mediaType: 'text',
        likes: 12,
        comments: [],
        hashtags: ['welcome', 'rnts'],
      },
      {
        author: 'Sara',
        avatar: 'https://i.pravatar.cc/100?u=2',
        content: 'Sunset from the beach today. #travel #photography',
        mediaType: 'image',
        mediaUrl: 'https://picsum.photos/seed/beach/800/500',
        likes: 34,
        comments: [
          {
            id: 'c1',
            author: 'Ali',
            text: 'Beautiful shot!',
            createdAt: new Date().toISOString(),
          },
        ],
        hashtags: ['travel', 'photography'],
      },
      {
        author: 'Ali',
        avatar: 'https://i.pravatar.cc/100?u=3',
        content: 'New audio track uploaded. #music',
        mediaType: 'audio',
        mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        likes: 8,
        comments: [],
        hashtags: ['music'],
      },
      {
        author: 'Team RNTS',
        avatar: 'https://i.pravatar.cc/100?u=8',
        content: 'Which feature should we ship next?',
        mediaType: 'poll',
        likes: 5,
        comments: [],
        hashtags: ['poll'],
        poll: {
          options: [
            { id: 'o1', text: 'Video calls in chat', votes: 14 },
            { id: 'o2', text: 'Wallet QR pay', votes: 22 },
            { id: 'o3', text: 'Gallery slideshow', votes: 9 },
          ],
        },
      },
    ];

    await this.postsRepository.save(
      posts.map((p) => this.postsRepository.create(p)),
    );
    console.log('[seed] Created feed posts');
  }

  private async seedDeliveryOrders() {
    const count = await this.ordersRepository.count();
    if (count > 0) return;

    const now = new Date().toISOString();
    await this.ordersRepository.save(
      this.ordersRepository.create({
        status: 'in_transit',
        pickupId: 'addr-1',
        dropoffId: 'addr-2',
        packageType: 'parcel',
        notes: 'Handle with care',
        price: 45,
        etaMinutes: 18,
        timeline: [
          { id: '1', status: 'pending', label: 'Order placed', timestamp: now },
          { id: '2', status: 'accepted', label: 'Driver accepted', timestamp: now },
          { id: '3', status: 'picked_up', label: 'Package picked up', timestamp: now },
          { id: '4', status: 'in_transit', label: 'On the way', timestamp: now },
        ],
        driver: {
          id: 'driver-1',
          name: 'Ahmed Hassan',
          phone: '+201234567890',
          rating: 4.8,
          vehicle: 'Motorcycle - ABC 123',
          latitude: 30.05,
          longitude: 31.24,
        },
      }),
    );
    console.log('[seed] Created sample delivery order');
  }
}
