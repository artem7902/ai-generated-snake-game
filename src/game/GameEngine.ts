import { Board } from './Board';
import {
  Difficulty,
  GRID_HEIGHT,
  GRID_WIDTH,
  INITIAL_SNAKE_LENGTH,
} from './constants';
import { Direction } from './Direction';
import { Food } from './Food';
import { Position } from './Position';
import { Snake } from './Snake';
import { GameOverReason, GameSnapshot, GameStatus } from './types';

export class GameEngine {
  private board: Board;
  private snake: Snake;
  private food: Food;
  private score: number;
  private status: GameStatus;
  private difficulty: Difficulty;
  private gameOverReason: GameOverReason | null;
  private collisionPosition: Position | null;

  constructor(difficulty: Difficulty = Difficulty.Normal) {
    this.difficulty = difficulty;
    this.board = new Board(GRID_WIDTH, GRID_HEIGHT);
    this.snake = new Snake(this.getStartPosition(), INITIAL_SNAKE_LENGTH);
    this.food = new Food({ x: 0, y: 0 });
    this.score = 0;
    this.status = 'idle';
    this.gameOverReason = null;
    this.collisionPosition = null;
    this.food.spawn(this.board, this.snake.getBody());
  }

  getDifficulty(): Difficulty {
    return this.difficulty;
  }

  setDifficulty(difficulty: Difficulty): void {
    if (this.status === 'running' || this.status === 'paused') {
      return;
    }
    this.difficulty = difficulty;
  }

  start(): void {
    if (this.status === 'running') {
      return;
    }
    this.status = 'running';
  }

  pause(): void {
    if (this.status === 'running') {
      this.status = 'paused';
    }
  }

  resume(): void {
    if (this.status === 'paused') {
      this.status = 'running';
    }
  }

  togglePause(): void {
    if (this.status === 'running') {
      this.pause();
    } else if (this.status === 'paused') {
      this.resume();
    }
  }

  reset(): void {
    this.board = new Board(GRID_WIDTH, GRID_HEIGHT);
    this.snake = new Snake(this.getStartPosition(), INITIAL_SNAKE_LENGTH);
    this.food = new Food({ x: 0, y: 0 });
    this.score = 0;
    this.status = 'idle';
    this.gameOverReason = null;
    this.collisionPosition = null;
    this.food.spawn(this.board, this.snake.getBody());
  }

  setDirection(direction: Direction): void {
    this.snake.setDirection(direction);

    if (this.status === 'idle') {
      this.start();
    }
  }

  tick(): void {
    if (this.status !== 'running') {
      return;
    }

    const nextHead = this.snake.getNextHead();

    if (!this.board.isInside(nextHead)) {
      this.status = 'gameOver';
      this.gameOverReason = 'wall';
      this.collisionPosition = nextHead;
      return;
    }

    const ateFood = this.food.isEatenBy(nextHead);

    if (this.snake.willCollideWithSelf(nextHead, ateFood)) {
      this.status = 'gameOver';
      this.gameOverReason = 'self';
      this.collisionPosition = nextHead;
      return;
    }

    this.snake.move(ateFood);

    if (ateFood) {
      this.score += 1;
      this.food.spawn(this.board, this.snake.getBody());
    }
  }

  getSnapshot(): GameSnapshot {
    return {
      status: this.status,
      score: this.score,
      snakeBody: this.snake.getBody(),
      food: this.food.getPosition(),
      direction: this.snake.getDirection(),
      gridWidth: this.board.width,
      gridHeight: this.board.height,
      difficulty: this.difficulty,
      gameOverReason: this.gameOverReason,
      collisionPosition: this.collisionPosition
        ? { ...this.collisionPosition }
        : null,
    };
  }

  getSnakeLength(): number {
    return this.snake.getLength();
  }

  private getStartPosition(): Position {
    return {
      x: Math.floor(GRID_WIDTH / 2),
      y: Math.floor(GRID_HEIGHT / 2),
    };
  }
}
