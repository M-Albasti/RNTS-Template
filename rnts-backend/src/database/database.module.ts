import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UserSettings } from '../users/entities/user-settings.entity';
import { Post } from '../feed/entities/post.entity';
import { DeliveryOrder } from '../delivery/entities/delivery-order.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserSettings, Post, DeliveryOrder]),
  ],
  providers: [SeedService],
})
export class DatabaseModule {}
