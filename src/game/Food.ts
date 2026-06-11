import { Board } from './Board';
import { Position, positionKey } from './Position';

export class Food {
  private position: Position;

  constructor(position: Position) {
    this.position = { ...position };
  }

  getPosition(): Position {
    return { ...this.position };
  }

  spawn(board: Board, snakeBody: Position[]): void {
    const occupied = new Set(snakeBody.map(positionKey));
    const emptyCells: Position[] = [];

    for (let y = 0; y < board.height; y++) {
      for (let x = 0; x < board.width; x++) {
        const cell = { x, y };
        if (!occupied.has(positionKey(cell))) {
          emptyCells.push(cell);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const index = Math.floor(Math.random() * emptyCells.length);
    this.position = { ...emptyCells[index] };
  }

  isEatenBy(head: Position): boolean {
    return positionKey(this.position) === positionKey(head);
  }
}
