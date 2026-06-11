import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { DPadControls } from '../components/DPadControls';
import { GameBoard } from '../components/GameBoard';
import { GameOverlay } from '../components/GameOverlay';
import { getDifficultyLabel, ScoreBar } from '../components/ScoreBar';
import { DIFFICULTY_TICK_MS, Difficulty } from '../game/constants';
import { Direction } from '../game/Direction';
import { GameEngine } from '../game/GameEngine';
import { GameSnapshot } from '../game/types';
import {
  loadGameStats,
  recordGameResult,
} from '../storage/GameStatsStore';

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: Direction.Up,
  ArrowDown: Direction.Down,
  ArrowLeft: Direction.Left,
  ArrowRight: Direction.Right,
};

const PAUSE_KEYS = new Set([' ', 'p', 'P', 'Escape']);

export function GameScreen() {
  const [difficulty, setDifficulty] = useState(Difficulty.Normal);
  const [highScore, setHighScore] = useState(0);
  const [statsLoaded, setStatsLoaded] = useState(false);

  const engineRef = useRef(new GameEngine(Difficulty.Normal));
  const previousSnapshotRef = useRef<GameSnapshot | null>(null);
  const gameOverRecordedRef = useRef(false);

  const [snapshot, setSnapshot] = useState(() => engineRef.current.getSnapshot());

  const syncSnapshot = useCallback(() => {
    setSnapshot(engineRef.current.getSnapshot());
  }, []);

  useEffect(() => {
    void loadGameStats().then((stats) => {
      setHighScore(stats.highScore);
      setDifficulty(stats.lastDifficulty);
      engineRef.current.setDifficulty(stats.lastDifficulty);
      syncSnapshot();
      setStatsLoaded(true);
    });
  }, [syncSnapshot]);

  useEffect(() => {
    if (!statsLoaded) {
      return;
    }

    engineRef.current.setDifficulty(difficulty);
    syncSnapshot();
  }, [difficulty, statsLoaded, syncSnapshot]);

  useEffect(() => {
    const tickMs = DIFFICULTY_TICK_MS[snapshot.difficulty];
    const intervalId = setInterval(() => {
      engineRef.current.tick();
      syncSnapshot();
    }, tickMs);

    return () => clearInterval(intervalId);
  }, [snapshot.difficulty, syncSnapshot]);

  useEffect(() => {
    const previous = previousSnapshotRef.current;
    const current = snapshot;

    if (
      previous &&
      current.status === 'gameOver' &&
      previous.status !== 'gameOver' &&
      !gameOverRecordedRef.current
    ) {
      gameOverRecordedRef.current = true;
      void recordGameResult(
        current.score,
        current.snakeBody.length,
        current.difficulty,
      ).then((stats) => {
        setHighScore(stats.highScore);
      });
    }

    if (current.status !== 'gameOver') {
      gameOverRecordedRef.current = false;
    }

    previousSnapshotRef.current = current;
  }, [snapshot]);

  const handleDirection = useCallback(
    (direction: Direction) => {
      engineRef.current.setDirection(direction);
      syncSnapshot();
    },
    [syncSnapshot],
  );

  const handlePauseToggle = useCallback(() => {
    engineRef.current.togglePause();
    syncSnapshot();
  }, [syncSnapshot]);

  const handleResume = useCallback(() => {
    engineRef.current.resume();
    syncSnapshot();
  }, [syncSnapshot]);

  const handleRestart = useCallback(() => {
    engineRef.current.reset();
    gameOverRecordedRef.current = false;
    syncSnapshot();
  }, [syncSnapshot]);

  const handleDifficultyChange = useCallback(
    (nextDifficulty: Difficulty) => {
      setDifficulty(nextDifficulty);
      engineRef.current.setDifficulty(nextDifficulty);
      syncSnapshot();
    },
    [syncSnapshot],
  );

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (PAUSE_KEYS.has(event.key)) {
        event.preventDefault();
        handlePauseToggle();
        return;
      }

      const direction = KEY_TO_DIRECTION[event.key];
      if (direction) {
        event.preventDefault();
        handleDirection(direction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDirection, handlePauseToggle]);

  const dpadDisabled =
    snapshot.status === 'gameOver' || snapshot.status === 'paused';

  return (
    <View className="flex-1 items-center justify-center bg-[#1a1a2e] p-4">
      <Text className="mb-2 font-mono text-[28px] font-bold tracking-[6px] text-[#39ff14]">
        SNAKE
      </Text>

      <ScoreBar
        score={snapshot.score}
        highScore={highScore}
        status={snapshot.status}
        difficultyLabel={getDifficultyLabel(snapshot.difficulty)}
        onPauseToggle={handlePauseToggle}
      />

      <View className="relative">
        <GameBoard snapshot={snapshot} />
        <GameOverlay
          status={snapshot.status}
          score={snapshot.score}
          highScore={highScore}
          difficulty={difficulty}
          onDifficultyChange={handleDifficultyChange}
          onRestart={handleRestart}
          onResume={handleResume}
        />
      </View>

      <DPadControls onDirection={handleDirection} disabled={dpadDisabled} />
    </View>
  );
}
