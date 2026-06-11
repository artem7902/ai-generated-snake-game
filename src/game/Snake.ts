import { Direction, getDelta, isOppositeDirection } from './Direction';
import { Position, positionKey } from './Position';

export class Snake {
  private body: Position[];
  private direction: Direction;

  constructor(
    startPosition: Position,
    initialLength: number,
    initialDirection: Direction = Direction.Right,
  ) {
    this.direction = initialDirection;
    this.body = [];

    for (let i = 0; i < initialLength; i++) {
      this.body.push({ x: startPosition.x - i, y: startPosition.y });
    }
  }

  getHead(): Position {
    return this.body[0];
  }

  getBody(): Position[] {
    return this.body.map((segment) => ({ ...segment }));
  }

  getLength(): number {
    return this.body.length;
  }

  getDirection(): Direction {
    return this.direction;
  }

  setDirection(direction: Direction): void {
    if (isOppositeDirection(this.direction, direction)) {
      return;
    }
    this.direction = direction;
  }

  getNextHead(): Position {
    const { dx, dy } = getDelta(this.direction);
    const head = this.getHead();
    return { x: head.x + dx, y: head.y + dy };
  }

  willCollideWithSelf(nextHead: Position): boolean {
    return this.body.some((segment) => positionKey(segment) === positionKey(nextHead));
  }

  move(grow: boolean): void {
    const nextHead = this.getNextHead();
    this.body.unshift(nextHead);

    if (!grow) {
      this.body.pop();
    }
  }

  reset(startPosition: Position, initialLength: number, initialDirection: Direction): void {
    this.direction = initialDirection;
    this.body = [];

    for (let i = 0; i < initialLength; i++) {
      this.body.push({ x: startPosition.x - i, y: startPosition.y });
    }
  }
}
