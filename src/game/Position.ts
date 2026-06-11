export interface Position {
  x: number;
  y: number;
}

export function positionsEqual(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

export function positionKey(position: Position): string {
  return `${position.x},${position.y}`;
}
