export type GameHistoryEntry = {
  id: string;
  reward: string;
  coinsDelta: number;
  createdAt: string;
};

export type GameShopItem = {
  id: string;
  title: string;
  cost: number;
  description: string;
};

export type LeaderboardEntry = {
  id: string;
  name: string;
  coins: number;
  rank: number;
};

export type GameAchievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
};
