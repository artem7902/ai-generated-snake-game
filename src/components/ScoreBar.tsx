import { Text, View } from 'react-native';

interface ScoreBarProps {
  score: number;
}

export function ScoreBar({ score }: ScoreBarProps) {
  return (
    <View className="mb-4 flex-row items-center justify-center gap-3">
      <Text className="font-mono text-sm tracking-[2px] text-[#c8d6c8]">
        SCORE
      </Text>
      <Text className="font-mono text-xl font-bold text-[#39ff14]">
        {score.toString().padStart(3, '0')}
      </Text>
    </View>
  );
}
