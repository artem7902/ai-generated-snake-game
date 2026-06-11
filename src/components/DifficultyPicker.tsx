import { Pressable, Text, View } from 'react-native';
import {
  DIFFICULTY_LABELS,
  DIFFICULTY_TICK_MS,
  Difficulty,
} from '../game/constants';

interface DifficultyPickerProps {
  value: Difficulty;
  onChange: (difficulty: Difficulty) => void;
  disabled?: boolean;
}

const DIFFICULTIES = [Difficulty.Easy, Difficulty.Normal, Difficulty.Hard];

export function DifficultyPicker({
  value,
  onChange,
  disabled = false,
}: DifficultyPickerProps) {
  return (
    <View className="mt-4 w-full max-w-xs">
      <Text className="mb-2 text-center font-mono text-xs tracking-[2px] text-[#c8d6c8]">
        DIFFICULTY
      </Text>
      <View className="flex-row justify-center gap-2">
        {DIFFICULTIES.map((difficulty) => {
          const isSelected = value === difficulty;

          return (
            <Pressable
              key={difficulty}
              disabled={disabled}
              onPress={() => onChange(difficulty)}
              className={`min-w-[72px] items-center border px-2 py-2 ${
                isSelected
                  ? 'border-[#39ff14] bg-[#2d4a3e]'
                  : 'border-[#4a4a6a] bg-[#16213e]'
              } ${disabled ? 'opacity-40' : 'active:opacity-80'}`}
            >
              <Text
                className={`font-mono text-xs font-bold ${
                  isSelected ? 'text-[#39ff14]' : 'text-[#c8d6c8]'
                }`}
              >
                {DIFFICULTY_LABELS[difficulty]}
              </Text>
              <Text className="mt-0.5 font-mono text-[10px] text-[#8a9a8a]">
                {DIFFICULTY_TICK_MS[difficulty]}ms
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
