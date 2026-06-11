import { useMemo } from 'react';
import { View } from 'react-native';
import { Direction } from '../game/Direction';
import { positionKey } from '../game/Position';
import { GameSnapshot } from '../game/types';

interface GameBoardProps {
  snapshot: GameSnapshot;
  cellSize: number;
}

const WALL_CELL_CLASS_NAME = 'bg-[#5f4b32]';
const EMPTY_CELL_CLASS_NAME = 'bg-[#16213e]';
const SNAKE_BODY_CLASS_NAME = 'bg-[#2ecc40]';
const SNAKE_HEAD_CLASS_NAME = 'bg-[#39ff14] border-2 border-[#c8ffc8]';
const FOOD_CLASS_NAME = 'bg-[#f5f5dc] rounded-full scale-75';
const COLLISION_CELL_CLASS_NAME = 'bg-[#ff3131] border-2 border-[#ffd1d1]';

function getHeadCornerClass(direction: Direction): string {
  switch (direction) {
    case Direction.Up:
      return 'rounded-t-md';
    case Direction.Down:
      return 'rounded-b-md';
    case Direction.Left:
      return 'rounded-l-md';
    case Direction.Right:
      return 'rounded-r-md';
  }
}

export function GameBoard({ snapshot, cellSize }: GameBoardProps) {
  const snakeSet = useMemo(
    () => new Set(snapshot.snakeBody.map(positionKey)),
    [snapshot.snakeBody],
  );
  const headKey =
    snapshot.snakeBody.length > 0 ? positionKey(snapshot.snakeBody[0]) : '';
  const foodKey = positionKey(snapshot.food);
  const collisionKey = snapshot.collisionPosition
    ? positionKey(snapshot.collisionPosition)
    : '';
  const headCornerClass = getHeadCornerClass(snapshot.direction);

  const rows = useMemo(
    () =>
      Array.from({ length: snapshot.gridHeight + 2 }, (_, visualY) =>
        Array.from({ length: snapshot.gridWidth + 2 }, (_, visualX) => {
          const isWall =
            visualX === 0 ||
            visualY === 0 ||
            visualX === snapshot.gridWidth + 1 ||
            visualY === snapshot.gridHeight + 1;
          const key = positionKey({ x: visualX - 1, y: visualY - 1 });

          if (isWall) {
            return {
              className:
                key === collisionKey
                  ? COLLISION_CELL_CLASS_NAME
                  : WALL_CELL_CLASS_NAME,
              key: `wall-${visualX}-${visualY}`,
            };
          }

          const x = visualX - 1;
          const y = visualY - 1;

          if (key === collisionKey) {
            return {
              className: COLLISION_CELL_CLASS_NAME,
              key: `collision-${x}-${y}`,
            };
          }
          if (key === headKey) {
            return {
              className: `${SNAKE_HEAD_CLASS_NAME} ${headCornerClass}`,
              key: `head-${x}-${y}`,
            };
          }
          if (snakeSet.has(key)) {
            return { className: SNAKE_BODY_CLASS_NAME, key: `body-${x}-${y}` };
          }
          if (key === foodKey) {
            return { className: FOOD_CLASS_NAME, key: `food-${x}-${y}` };
          }
          return { className: EMPTY_CELL_CLASS_NAME, key: `empty-${x}-${y}` };
        }),
      ),
    [
      snapshot.gridHeight,
      snapshot.gridWidth,
      headKey,
      foodKey,
      collisionKey,
      snakeSet,
      headCornerClass,
    ],
  );

  return (
    <View className="border-2 border-[#8a6f46] bg-[#16213e]">
      {rows.map((row, y) => (
        <View key={y} className="flex-row">
          {row.map((cell) => (
            <View
              key={cell.key}
              style={{ width: cellSize, height: cellSize }}
              className={`border border-[#4a4a6a]/60 ${cell.className}`}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

export function computeCellSize(
  containerWidth: number,
  containerHeight: number,
  gridWidth: number,
  gridHeight: number,
): number {
  const boardColumns = gridWidth + 2;
  const boardRows = gridHeight + 2;
  const maxWidth = Math.max(containerWidth - 16, 120);
  const maxHeight = Math.max(containerHeight - 16, 120);

  const widthBased = Math.floor(maxWidth / boardColumns);
  const heightBased = Math.floor(maxHeight / boardRows);

  return Math.max(8, Math.min(widthBased, heightBased, 20));
}
