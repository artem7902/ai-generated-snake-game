import { useCallback, useEffect, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  Platform,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { computeCellSize, GameBoard } from '../components/GameBoard';
import { DPadControls } from '../components/DPadControls';
import { GameOverlay } from '../components/GameOverlay';
import { getDifficultyLabel, ScoreBar } from '../components/ScoreBar';
import { SwipeControls } from '../components/SwipeControls';
import { DIFFICULTY_TICK_MS, Difficulty } from '../game/constants';
import { Direction } from '../game/Direction';
import { GameEngine } from '../game/GameEngine';
import { GameSnapshot } from '../game/types';
import {
  loadGameStats,
  recordGameResult,
} from '../storage/GameStatsStore';
import {
  hapticDirection,
  hapticFoodEaten,
  hapticGameOver,
  hapticPause,
} from '../utils/haptics';

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: Direction.Up,
  ArrowDown: Direction.Down,
  ArrowLeft: Direction.Left,
  ArrowRight: Direction.Right,
  w: Direction.Up,
  W: Direction.Up,
  s: Direction.Down,
  S: Direction.Down,
  a: Direction.Left,
  A: Direction.Left,
  d: Direction.Right,
  D: Direction.Right,
};

const PAUSE_KEYS = new Set([' ', 'p', 'P', 'Escape']);

export function GameScreen() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [difficulty, setDifficulty] = useState(Difficulty.Normal);
  const [highScore, setHighScore] = useState(0);
  const [boardAreaSize, setBoardAreaSize] = useState({ width: 0, height: 0 });
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

    if (previous) {
      if (current.score > previous.score) {
        hapticFoodEaten();
      }

      if (
        current.status === 'gameOver' &&
        previous.status !== 'gameOver' &&
        !gameOverRecordedRef.current
      ) {
        gameOverRecordedRef.current = true;
        hapticGameOver();
        void recordGameResult(
          current.score,
          current.snakeBody.length,
          current.difficulty,
        ).then((stats) => {
          setHighScore(stats.highScore);
        });
      }
    }

    if (current.status !== 'gameOver') {
      gameOverRecordedRef.current = false;
    }

    previousSnapshotRef.current = current;
  }, [snapshot]);

  const handleDirection = useCallback(
    (direction: Direction) => {
      engineRef.current.setDirection(direction);
      hapticDirection();
      syncSnapshot();
    },
    [syncSnapshot],
  );

  const handlePauseToggle = useCallback(() => {
    engineRef.current.togglePause();
    hapticPause();
    syncSnapshot();
  }, [syncSnapshot]);

  const handleResume = useCallback(() => {
    engineRef.current.resume();
    hapticPause();
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

  const handleBoardAreaLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setBoardAreaSize({ width, height });
  }, []);

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

  const directionInputDisabled =
    snapshot.status === 'gameOver' || snapshot.status === 'paused';

  const cellSize =
    boardAreaSize.width > 0
      ? computeCellSize(
          boardAreaSize.width,
          boardAreaSize.height || windowHeight * 0.45,
          snapshot.gridWidth,
          snapshot.gridHeight,
        )
      : computeCellSize(
          windowWidth - 32,
          windowHeight * 0.45,
          snapshot.gridWidth,
          snapshot.gridHeight,
        );

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

      <View
        className="w-full max-w-md flex-1 items-center justify-center"
        onLayout={handleBoardAreaLayout}
      >
        <SwipeControls
          onDirection={handleDirection}
          disabled={directionInputDisabled}
        >
          <GameBoard snapshot={snapshot} cellSize={cellSize} />
          <GameOverlay
            status={snapshot.status}
            score={snapshot.score}
            highScore={highScore}
            gameOverReason={snapshot.gameOverReason}
            difficulty={difficulty}
            onDifficultyChange={handleDifficultyChange}
            onRestart={handleRestart}
            onResume={handleResume}
          />
        </SwipeControls>
      </View>

      <DPadControls
        onDirection={handleDirection}
        disabled={directionInputDisabled}
      />

      <Text className="mt-3 text-center font-mono text-[10px] text-[#8a9a8a]">
        {Platform.OS === 'web'
          ? 'Arrows / WASD to move · Space or P to pause'
          : 'Swipe on board or use D-pad · Pause button to pause'}
      </Text>
    </View>
  );
}
