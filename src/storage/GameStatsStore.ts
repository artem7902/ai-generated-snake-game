import AsyncStorage from '@react-native-async-storage/async-storage';
import { Difficulty } from '../game/constants';

const STORAGE_KEY = '@snake_game_stats_v1';

export interface GameStats {
  highScore: number;
  gamesPlayed: number;
  longestSnake: number;
  lastDifficulty: Difficulty;
}

const DEFAULT_STATS: GameStats = {
  highScore: 0,
  gamesPlayed: 0,
  longestSnake: 0,
  lastDifficulty: Difficulty.Normal,
};

export async function loadGameStats(): Promise<GameStats> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_STATS };
    }

    const parsed = JSON.parse(raw) as Partial<GameStats>;
    return {
      highScore: parsed.highScore ?? 0,
      gamesPlayed: parsed.gamesPlayed ?? 0,
      longestSnake: parsed.longestSnake ?? 0,
      lastDifficulty: parsed.lastDifficulty ?? Difficulty.Normal,
    };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

export async function saveGameStats(stats: GameStats): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export async function recordGameResult(
  score: number,
  snakeLength: number,
  difficulty: Difficulty,
): Promise<GameStats> {
  const current = await loadGameStats();
  const next: GameStats = {
    highScore: Math.max(current.highScore, score),
    gamesPlayed: current.gamesPlayed + 1,
    longestSnake: Math.max(current.longestSnake, snakeLength),
    lastDifficulty: difficulty,
  };

  await saveGameStats(next);
  return next;
}
