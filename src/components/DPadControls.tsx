import { Pressable, Text, View } from 'react-native';
import { Direction } from '../game/Direction';

interface DPadControlsProps {
  onDirection: (direction: Direction) => void;
  disabled?: boolean;
}

export function DPadControls({ onDirection, disabled = false }: DPadControlsProps) {
  return (
    <View className="mt-6 items-center">
      <View className="flex-row items-center">
        <View className="h-14 w-14" />
        <DirectionButton
          label="▲"
          onPress={() => onDirection(Direction.Up)}
          disabled={disabled}
        />
        <View className="h-14 w-14" />
      </View>
      <View className="flex-row items-center">
        <DirectionButton
          label="◀"
          onPress={() => onDirection(Direction.Left)}
          disabled={disabled}
        />
        <View className="h-14 w-14" />
        <DirectionButton
          label="▶"
          onPress={() => onDirection(Direction.Right)}
          disabled={disabled}
        />
      </View>
      <View className="flex-row items-center">
        <View className="h-14 w-14" />
        <DirectionButton
          label="▼"
          onPress={() => onDirection(Direction.Down)}
          disabled={disabled}
        />
        <View className="h-14 w-14" />
      </View>
    </View>
  );
}

interface DirectionButtonProps {
  label: string;
  onPress: () => void;
  disabled: boolean;
}

function DirectionButton({ label, onPress, disabled }: DirectionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`m-1 h-14 w-14 items-center justify-center border border-[#4a4a6a] bg-[#2d4a3e] active:bg-[#1e3329] ${
        disabled ? 'opacity-40' : ''
      }`}
    >
      <Text className="text-[22px] text-[#c8d6c8]">{label}</Text>
    </Pressable>
  );
}
