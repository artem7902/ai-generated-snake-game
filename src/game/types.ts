import { Direction } from './Direction';
import { Position } from './Position';

export type GameStatus = 'idle' | 'running' | 'paused' | 'gameOver';

export interface GameSnapshot {
  status: GameStatus;
  score: number;
  snakeBody: Position[];
  food: Position;
  direction: Direction;
  gridWidth: number;
  gridHeight: number;
}
