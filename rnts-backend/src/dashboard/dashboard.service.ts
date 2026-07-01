import { Injectable } from '@nestjs/common';

export type DashboardStatsDto = {
  postsCount: number;
  openTodos: number;
  unreadChats: number;
  walletBalance: number;
  gameCoins: number;
};

@Injectable()
export class DashboardService {
  getStats(): DashboardStatsDto {
    return {
      postsCount: 4,
      openTodos: 2,
      unreadChats: 3,
      walletBalance: 1280,
      gameCoins: 450,
    };
  }
}
