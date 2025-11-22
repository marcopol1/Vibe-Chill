export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
}

export enum VibeType {
  VALID = 'VALID',
  CRINGE = 'CRINGE',
}

export interface VibeItem {
  id: string;
  text: string;
  type: VibeType;
  emoji: string;
}

export interface Score {
  current: number;
  high: number;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  timestamp: number;
}