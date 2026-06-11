import { Board } from './Board';
import { Direction } from './Direction';
import { Food } from './Food';
import { Position } from './Position';
import { Snake } from './Snake';
import {
  GRID_HEIGHT,
  GRID_WIDTH,
  INITIAL_SNAKE_LENGTH,
} from './constants';
import { GameSnapshot, GameStatus } from './types';

export class GameEngine {
  private board: Board;
  private snake: Snake;
  private food: Food;
  private score: number;
  private status: GameStatus;

  constructor() {
    this.board = new Board(GRID_WIDTH, GRID_HEIGHT);
    this.snake = new Snake(this.getStartPosition(), INITIAL_SNAKE_LENGTH);
    this.food = new Food({ x: 0, y: 0 });
    this.score = 0;
    this.status = 'idle';
    this.food.spawn(this.board, this.snake.getBody());
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

  reset(): void {
    this.board = new Board(GRID_WIDTH, GRID_HEIGHT);
    this.snake = new Snake(this.getStartPosition(), INITIAL_SNAKE_LENGTH);
    this.food = new Food({ x: 0, y: 0 });
    this.score = 0;
    this.status = 'idle';
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
      return;
    }

    if (this.snake.willCollideWithSelf(nextHead)) {
      this.status = 'gameOver';
      return;
    }

    const ateFood = this.food.isEatenBy(nextHead);
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
    };
  }

  private getStartPosition(): Position {
    return {
      x: Math.floor(GRID_WIDTH / 2),
      y: Math.floor(GRID_HEIGHT / 2),
    };
  }
}
