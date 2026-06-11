import { ReactNode, useRef } from 'react';
import { PanResponder, View } from 'react-native';
import { Direction } from '../game/Direction';

interface SwipeControlsProps {
  onDirection: (direction: Direction) => void;
  disabled?: boolean;
  children: ReactNode;
}

const SWIPE_THRESHOLD = 24;

export function SwipeControls({
  onDirection,
  disabled = false,
  children,
}: SwipeControlsProps) {
  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabledRef.current,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        !disabledRef.current &&
        (Math.abs(gestureState.dx) > 8 || Math.abs(gestureState.dy) > 8),
      onPanResponderRelease: (_, gestureState) => {
        if (disabledRef.current) {
          return;
        }

        const { dx, dy } = gestureState;

        if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) {
          return;
        }

        if (Math.abs(dx) > Math.abs(dy)) {
          onDirection(dx > 0 ? Direction.Right : Direction.Left);
          return;
        }

        onDirection(dy > 0 ? Direction.Down : Direction.Up);
      },
    }),
  ).current;

  return (
    <View {...panResponder.panHandlers} className="relative">
      {children}
    </View>
  );
}
