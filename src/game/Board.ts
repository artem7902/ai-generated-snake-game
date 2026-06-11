import { Position, positionKey } from './Position';

export class Board {
  constructor(
    public readonly width: number,
    public readonly height: number,
  ) {}

  isInside(position: Position): boolean {
    return (
      position.x >= 0 &&
      position.x < this.width &&
      position.y >= 0 &&
      position.y < this.height
    );
  }

  isOccupied(position: Position, snakeBody: Position[]): boolean {
    return snakeBody.some((segment) => positionKey(segment) === positionKey(position));
  }
}
