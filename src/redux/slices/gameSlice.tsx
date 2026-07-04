import {PayloadAction, createSlice} from '@reduxjs/toolkit';

import {
  GameAchievement,
  GameHistoryEntry,
  GameShopItem,
  LeaderboardEntry,
} from '@Types/gameTypes';

export type GameState = {
  coins: number;
  lastReward: string;
  spinCount: number;
  history: GameHistoryEntry[];
  shopItems: GameShopItem[];
  leaderboard: LeaderboardEntry[];
  achievements: GameAchievement[];
  lastDailyClaim: string;
};

const shopItems: GameShopItem[] = [
  {id: 's1', title: 'Extra spin', cost: 20, description: 'One bonus wheel spin'},
  {id: 's2', title: 'Coin boost', cost: 50, description: '+30 coins instantly'},
  {id: 's3', title: 'VIP badge', cost: 100, description: 'Show off on leaderboard'},
];

const leaderboard: LeaderboardEntry[] = [
  {id: 'l1', name: 'Sara', coins: 420, rank: 1},
  {id: 'l2', name: 'Ali', coins: 380, rank: 2},
  {id: 'l3', name: 'You', coins: 100, rank: 3},
  {id: 'l4', name: 'Omar', coins: 90, rank: 4},
];

const achievements: GameAchievement[] = [
  {id: 'a1', title: 'First spin', description: 'Spin the wheel once', unlocked: false, icon: 'slot-machine'},
  {id: 'a2', title: 'High roller', description: 'Reach 200 coins', unlocked: false, icon: 'trophy'},
  {id: 'a3', title: 'Shopper', description: 'Buy from the coin shop', unlocked: false, icon: 'cart'},
  {id: 'a4', title: 'Jackpot hunter', description: 'Win the jackpot reward', unlocked: false, icon: 'star'},
];

const rewards = ['+10 coins', '+25 coins', '+5 coins', 'Try again', '+50 coins', 'Jackpot +100'];

const parseCoinsDelta = (reward: string): number => {
  if (reward.includes('100')) return 100;
  if (reward.includes('50')) return 50;
  if (reward.includes('25')) return 25;
  if (reward.includes('10')) return 10;
  if (reward.includes('5')) return 5;
  return 0;
};

const unlockAchievements = (state: GameState) => {
  if (state.spinCount >= 1) state.achievements.find(a => a.id === 'a1')!.unlocked = true;
  if (state.coins >= 200) state.achievements.find(a => a.id === 'a2')!.unlocked = true;
  if (state.history.some(h => h.reward.startsWith('Purchased'))) {
    state.achievements.find(a => a.id === 'a3')!.unlocked = true;
  }
  if (state.history.some(h => h.reward.includes('Jackpot'))) {
    state.achievements.find(a => a.id === 'a4')!.unlocked = true;
  }
};

const initialState: GameState = {
  coins: 100,
  lastReward: '',
  spinCount: 0,
  history: [],
  shopItems,
  leaderboard,
  achievements,
  lastDailyClaim: '',
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    spin: state => {
      const reward = rewards[Math.floor(Math.random() * rewards.length)];
      const delta = parseCoinsDelta(reward);
      state.lastReward = reward;
      state.spinCount += 1;
      state.coins += delta;
      state.history.unshift({
        id: Date.now().toString(),
        reward,
        coinsDelta: delta,
        createdAt: new Date().toISOString(),
      });
      const you = state.leaderboard.find(e => e.name === 'You');
      if (you) you.coins = state.coins;
      unlockAchievements(state);
    },
    purchaseItem: (state, action: PayloadAction<string>) => {
      const item = state.shopItems.find(i => i.id === action.payload);
      if (!item || state.coins < item.cost) return;
      state.coins -= item.cost;
      if (item.title === 'Coin boost') state.coins += 30;
      if (item.title === 'Extra spin') state.spinCount += 1;
      state.history.unshift({
        id: Date.now().toString(),
        reward: `Purchased ${item.title}`,
        coinsDelta: item.title === 'Coin boost' ? 30 - item.cost : -item.cost,
        createdAt: new Date().toISOString(),
      });
      const you = state.leaderboard.find(e => e.name === 'You');
      if (you) you.coins = state.coins;
      unlockAchievements(state);
    },
    claimDailyReward: state => {
      const today = new Date().toISOString().slice(0, 10);
      if (state.lastDailyClaim === today) return;
      state.lastDailyClaim = today;
      state.coins += 15;
      state.history.unshift({
        id: Date.now().toString(),
        reward: 'Daily bonus +15',
        coinsDelta: 15,
        createdAt: new Date().toISOString(),
      });
      const you = state.leaderboard.find(e => e.name === 'You');
      if (you) you.coins = state.coins;
    },
    syncLeaderboard: (state, action: PayloadAction<number>) => {
      const you = state.leaderboard.find(e => e.name === 'You');
      if (you) you.coins = action.payload;
      state.leaderboard.sort((a, b) => b.coins - a.coins);
      state.leaderboard.forEach((entry, index) => {
        entry.rank = index + 1;
      });
    },
  },
});

export const {spin, purchaseItem, claimDailyReward, syncLeaderboard} = gameSlice.actions;
export default gameSlice.reducer;
