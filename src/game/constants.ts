export const GRID_WIDTH = 20;
export const GRID_HEIGHT = 20;
export const INITIAL_SNAKE_LENGTH = 3;

export enum Difficulty {
  Easy = 'easy',
  Normal = 'normal',
  Hard = 'hard',
}

export const DIFFICULTY_TICK_MS: Record<Difficulty, number> = {
  [Difficulty.Easy]: 200,
  [Difficulty.Normal]: 150,
  [Difficulty.Hard]: 100,
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  [Difficulty.Easy]: 'Easy',
  [Difficulty.Normal]: 'Normal',
  [Difficulty.Hard]: 'Hard',
};
