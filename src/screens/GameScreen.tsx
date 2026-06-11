import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { DPadControls } from '../components/DPadControls';
import { GameBoard } from '../components/GameBoard';
import { ScoreBar } from '../components/ScoreBar';
import { Direction } from '../game/Direction';
import { GameEngine } from '../game/GameEngine';
import { TICK_INTERVAL_MS } from '../game/constants';
import { GameSnapshot } from '../game/types';

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: Direction.Up,
  ArrowDown: Direction.Down,
  ArrowLeft: Direction.Left,
  ArrowRight: Direction.Right,
};

export function GameScreen() {
  const engineRef = useRef(new GameEngine());
  const [snapshot, setSnapshot] = useState<GameSnapshot>(() =>
    engineRef.current.getSnapshot(),
  );

  const syncSnapshot = useCallback(() => {
    setSnapshot(engineRef.current.getSnapshot());
  }, []);

  const handleDirection = useCallback(
    (direction: Direction) => {
      engineRef.current.setDirection(direction);
      syncSnapshot();
    },
    [syncSnapshot],
  );

  const handleRestart = useCallback(() => {
    engineRef.current.reset();
    syncSnapshot();
  }, [syncSnapshot]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      engineRef.current.tick();
      syncSnapshot();
    }, TICK_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [syncSnapshot]);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const direction = KEY_TO_DIRECTION[event.key];
      if (direction) {
        event.preventDefault();
        handleDirection(direction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDirection]);

  const isGameOver = snapshot.status === 'gameOver';
  const controlsDisabled = isGameOver;

  return (
    <View className="flex-1 items-center justify-center bg-[#1a1a2e] p-4">
      <Text className="mb-2 font-mono text-[28px] font-bold tracking-[6px] text-[#39ff14]">
        SNAKE
      </Text>
      <ScoreBar score={snapshot.score} />

      <View className="relative">
        <GameBoard snapshot={snapshot} />

        {snapshot.status === 'idle' && (
          <View className="absolute inset-0 items-center justify-center bg-black/75 p-4">
            <Text className="text-center font-mono text-base text-[#c8d6c8]">
              Press a direction to start
            </Text>
          </View>
        )}

        {isGameOver && (
          <Pressable
            className="absolute inset-0 items-center justify-center bg-black/75 p-4"
            onPress={handleRestart}
          >
            <Text className="mb-2 font-mono text-2xl font-bold text-[#f5f5dc]">
              GAME OVER
            </Text>
            <Text className="text-center font-mono text-base text-[#c8d6c8]">
              Score: {snapshot.score}
            </Text>
            <Text className="mt-3 font-mono text-sm text-[#39ff14]">
              Tap to restart
            </Text>
          </Pressable>
        )}
      </View>

      <DPadControls onDirection={handleDirection} disabled={controlsDisabled} />
    </View>
  );
}
