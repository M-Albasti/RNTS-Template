import type {DashboardStatsDto} from '@api/server/dashboard.dto';

export type DashboardStats = DashboardStatsDto;

export const mapDashboardDto = (dto: DashboardStatsDto): DashboardStats => ({
  postsCount: dto.postsCount,
  openTodos: dto.openTodos,
  unreadChats: dto.unreadChats,
  walletBalance: dto.walletBalance,
  gameCoins: dto.gameCoins,
});
