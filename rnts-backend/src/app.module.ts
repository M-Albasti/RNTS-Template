import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { DashboardModule } from './dashboard/dashboard.module';
import { DatabaseModule } from './database/database.module';
import { DeliveryModule } from './delivery/delivery.module';
import { FeedModule } from './feed/feed.module';
import { MediaModule } from './media/media.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { UserSettings } from './users/entities/user-settings.entity';
import { OtpToken, PasswordResetToken } from './auth/entities/auth-token.entity';
import { MediaFile, Audio, Video } from './media/entities/media.entity';
import { Post } from './feed/entities/post.entity';
import { DeliveryOrder } from './delivery/entities/delivery-order.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbPath = config.get<string>(
          'DATABASE_PATH',
          './data/rnts.sqlite',
        );
        return {
          type: 'better-sqlite3' as const,
          database: dbPath,
          entities: [
            User,
            UserSettings,
            OtpToken,
            PasswordResetToken,
            MediaFile,
            Audio,
            Video,
            Post,
            DeliveryOrder,
          ],
          synchronize: config.get('NODE_ENV') !== 'production',
        };
      },
    }),
    AuthModule,
    UsersModule,
    MediaModule,
    FeedModule,
    DashboardModule,
    DeliveryModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  ],
})
export class AppModule {}
