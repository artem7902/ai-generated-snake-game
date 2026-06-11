export enum Direction {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right',
}

const OPPOSITE: Record<Direction, Direction> = {
  [Direction.Up]: Direction.Down,
  [Direction.Down]: Direction.Up,
  [Direction.Left]: Direction.Right,
  [Direction.Right]: Direction.Left,
};

export function isOppositeDirection(current: Direction, next: Direction): boolean {
  return OPPOSITE[current] === next;
}

export function getDelta(direction: Direction): { dx: number; dy: number } {
  switch (direction) {
    case Direction.Up:
      return { dx: 0, dy: -1 };
    case Direction.Down:
      return { dx: 0, dy: 1 };
    case Direction.Left:
      return { dx: -1, dy: 0 };
    case Direction.Right:
      return { dx: 1, dy: 0 };
  }
}
