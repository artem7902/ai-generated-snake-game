import { View } from 'react-native';
import { positionKey } from '../game/Position';
import { GameSnapshot } from '../game/types';

interface GameBoardProps {
  snapshot: GameSnapshot;
}

const WALL_CELL_CLASS_NAME = 'bg-[#5f4b32]';
const EMPTY_CELL_CLASS_NAME = 'bg-[#16213e]';

export function GameBoard({ snapshot }: GameBoardProps) {
  const snakeSet = new Set(snapshot.snakeBody.map(positionKey));
  const headKey = snapshot.snakeBody.length > 0 ? positionKey(snapshot.snakeBody[0]) : '';
  const foodKey = positionKey(snapshot.food);

  const rows = Array.from({ length: snapshot.gridHeight + 2 }, (_, visualY) =>
    Array.from({ length: snapshot.gridWidth + 2 }, (_, visualX) => {
      const isWall =
        visualX === 0 ||
        visualY === 0 ||
        visualX === snapshot.gridWidth + 1 ||
        visualY === snapshot.gridHeight + 1;

      if (isWall) {
        return WALL_CELL_CLASS_NAME;
      }

      const x = visualX - 1;
      const y = visualY - 1;
      const key = positionKey({ x, y });

      if (key === headKey) {
        return 'bg-[#39ff14]';
      }
      if (snakeSet.has(key)) {
        return 'bg-[#2ecc40]';
      }
      if (key === foodKey) {
        return 'bg-[#f5f5dc]';
      }
      return EMPTY_CELL_CLASS_NAME;
    }),
  );

  return (
    <View className="border-2 border-[#8a6f46] bg-[#16213e]">
      {rows.map((row, y) => (
        <View key={y} className="flex-row">
          {row.map((cellClassName, x) => (
            <View
              key={`${x}-${y}`}
              className={`h-3.5 w-3.5 border border-[#4a4a6a] ${cellClassName}`}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
