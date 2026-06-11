import { Pressable, Text, View } from 'react-native';
import { DifficultyPicker } from './DifficultyPicker';
import { Difficulty } from '../game/constants';
import { GameOverReason, GameStatus } from '../game/types';

interface GameOverlayProps {
  status: GameStatus;
  score: number;
  highScore: number;
  gameOverReason: GameOverReason | null;
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onRestart: () => void;
  onResume: () => void;
}

export function GameOverlay({
  status,
  score,
  highScore,
  gameOverReason,
  difficulty,
  onDifficultyChange,
  onRestart,
  onResume,
}: GameOverlayProps) {
  if (status === 'idle') {
    return (
      <View className="absolute inset-0 items-center justify-center bg-black/80 p-4">
        <Text className="mb-1 font-mono text-xl font-bold text-[#39ff14]">
          READY?
        </Text>
        <Text className="text-center font-mono text-sm text-[#c8d6c8]">
          Press a direction or swipe to start
        </Text>
        <Text className="mt-2 font-mono text-xs text-[#8a9a8a]">
          Best: {highScore.toString().padStart(3, '0')}
        </Text>
        <DifficultyPicker value={difficulty} onChange={onDifficultyChange} />
      </View>
    );
  }

  if (status === 'paused') {
    return (
      <Pressable
        className="absolute inset-0 items-center justify-center bg-black/80 p-4"
        onPress={onResume}
      >
        <Text className="mb-2 font-mono text-2xl font-bold text-[#f5f5dc]">
          PAUSED
        </Text>
        <Text className="text-center font-mono text-sm text-[#c8d6c8]">
          Tap to resume
        </Text>
        <Text className="mt-2 font-mono text-xs text-[#8a9a8a]">
          Score: {score.toString().padStart(3, '0')}
        </Text>
      </Pressable>
    );
  }

  if (status === 'gameOver') {
    const isNewBest = score >= highScore && score > 0;
    const collisionMessage =
      gameOverReason === 'wall'
        ? 'Wall hit'
        : gameOverReason === 'self'
          ? 'Bit yourself'
          : 'Collision';

    return (
      <Pressable
        className="absolute inset-0 items-center justify-center bg-black/60 p-4"
        onPress={onRestart}
      >
        <Text className="mb-2 font-mono text-2xl font-bold text-[#f5f5dc]">
          GAME OVER
        </Text>
        <Text className="mb-2 rounded-full border border-[#ffd1d1] bg-[#ff3131] px-3 py-1 font-mono text-sm font-bold uppercase tracking-[3px] text-white">
          {collisionMessage}
        </Text>
        <Text className="mb-3 text-center font-mono text-xs text-[#c8d6c8]">
          Red marks the crash
        </Text>
        <Text className="font-mono text-base text-[#c8d6c8]">
          Score: {score.toString().padStart(3, '0')}
        </Text>
        <Text className="mt-1 font-mono text-sm text-[#8a9a8a]">
          Best: {highScore.toString().padStart(3, '0')}
        </Text>
        {isNewBest && (
          <Text className="mt-2 font-mono text-sm font-bold text-[#39ff14]">
            NEW BEST!
          </Text>
        )}
        <DifficultyPicker
          value={difficulty}
          onChange={onDifficultyChange}
          disabled={false}
        />
        <Text className="mt-4 font-mono text-sm text-[#39ff14]">
          Tap to restart
        </Text>
      </Pressable>
    );
  }

  return null;
}
