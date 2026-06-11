import { Pressable, Text, View } from 'react-native';
import { DIFFICULTY_LABELS } from '../game/constants';
import { GameStatus } from '../game/types';

interface ScoreBarProps {
  score: number;
  highScore: number;
  status: GameStatus;
  difficultyLabel: string;
  onPauseToggle: () => void;
}

export function ScoreBar({
  score,
  highScore,
  status,
  difficultyLabel,
  onPauseToggle,
}: ScoreBarProps) {
  const canPause = status === 'running' || status === 'paused';

  return (
    <View className="mb-4 w-full max-w-md flex-row items-center justify-between px-1">
      <View className="items-start">
        <Text className="font-mono text-[10px] tracking-[2px] text-[#8a9a8a]">
          SCORE
        </Text>
        <Text className="font-mono text-xl font-bold text-[#39ff14]">
          {score.toString().padStart(3, '0')}
        </Text>
      </View>

      <View className="items-center">
        <Text className="font-mono text-[10px] tracking-[2px] text-[#8a9a8a]">
          BEST
        </Text>
        <Text className="font-mono text-lg font-bold text-[#c8d6c8]">
          {highScore.toString().padStart(3, '0')}
        </Text>
        <Text className="mt-0.5 font-mono text-[10px] text-[#8a9a8a]">
          {difficultyLabel}
        </Text>
      </View>

      <Pressable
        disabled={!canPause}
        onPress={onPauseToggle}
        className={`min-w-[72px] items-center border border-[#4a4a6a] px-3 py-2 ${
          canPause ? 'bg-[#2d4a3e] active:bg-[#1e3329]' : 'bg-[#16213e] opacity-40'
        }`}
      >
        <Text className="font-mono text-xs font-bold text-[#c8d6c8]">
          {status === 'paused' ? 'RESUME' : 'PAUSE'}
        </Text>
      </Pressable>
    </View>
  );
}

export function getDifficultyLabel(difficulty: string): string {
  return DIFFICULTY_LABELS[difficulty as keyof typeof DIFFICULTY_LABELS] ?? 'Normal';
}
