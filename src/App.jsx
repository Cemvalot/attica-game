import { lazy, Suspense, useState, useCallback, useMemo, startTransition } from 'react';
import { Loader2 } from 'lucide-react';
import {
  GAME_IDS,
  roundTotalScore,
  sumGameScores,
  getBadge,
} from './data/games';
import HomeScreen from './components/HomeScreen';
import InstructionsModal from './components/InstructionsModal';
import GameMenu from './components/GameMenu';
import FinalScreen from './components/FinalScreen';
import KioskViewport from './components/KioskViewport';
import { preloadMenuImages } from './utils/preloadGameAssets';

const GameConnectSDG = lazy(() => import('./components/games/GameConnectSDG'));
const GameMatchSDG = lazy(() => import('./components/games/GameMatchSDG'));
const GameEcoSpeed = lazy(() => import('./components/games/GameEcoSpeed'));

function GameLoading() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-emerald-800">
      <Loader2 className="size-14 animate-spin text-emerald-500" />
      <p className="font-display text-2xl font-bold">Φόρτωση…</p>
    </div>
  );
}

const SCREENS = {
  home: 'home',
  menu: 'menu',
  connectSDG: 'connectSDG',
  matchSDG: 'matchSDG',
  ecoSpeed: 'ecoSpeed',
  final: 'final',
};

const INITIAL_SCORES = { connectSDG: null, matchSDG: null, ecoSpeed: null };

export default function App() {
  const [screen, setScreen] = useState(SCREENS.home);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [completedGames, setCompletedGames] = useState([]);
  const [gameScores, setGameScores] = useState(INITIAL_SCORES);

  const rawTotal = useMemo(() => sumGameScores(gameScores), [gameScores]);
  const totalRounded = useMemo(() => roundTotalScore(rawTotal), [rawTotal]);
  const finalBadge = useMemo(() => getBadge(totalRounded), [totalRounded]);

  const resetAll = useCallback(() => {
    startTransition(() => {
      setScreen(SCREENS.home);
      setCompletedGames([]);
      setGameScores(INITIAL_SCORES);
      setInstructionsOpen(false);
    });
  }, []);

  const goHome = () => startTransition(() => setScreen(SCREENS.home));
  const goMenu = () => {
    void preloadMenuImages();
    startTransition(() => setScreen(SCREENS.menu));
  };

  const goToGame = useCallback((gameId) => {
    startTransition(() => setScreen(SCREENS[gameId] ?? SCREENS.menu));
  }, []);

  const handleGameComplete = useCallback((gameId, result) => {
    if (!result) {
      startTransition(() => setScreen(SCREENS.menu));
      return;
    }

    setGameScores((prev) => {
      const nextScores = { ...prev, [gameId]: result.gameScore ?? 0 };
      setCompletedGames((prevCompleted) => {
        const updated = prevCompleted.includes(gameId)
          ? prevCompleted
          : [...prevCompleted, gameId];
        const allDone = GAME_IDS.every((id) => updated.includes(id));
        startTransition(() => setScreen(allDone ? SCREENS.final : SCREENS.menu));
        return updated;
      });
      return nextScores;
    });
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case SCREENS.home:
        return (
          <HomeScreen
            onStart={goMenu}
            onInstructions={() => setInstructionsOpen(true)}
          />
        );
      case SCREENS.menu:
        return (
          <GameMenu
            onSelectGame={goToGame}
            onHome={goHome}
            completedGames={completedGames}
            totalRounded={totalRounded}
          />
        );
      case SCREENS.connectSDG:
        return (
          <GameConnectSDG
            onComplete={(r) => handleGameComplete('connectSDG', r)}
            onHome={goMenu}
          />
        );
      case SCREENS.matchSDG:
        return (
          <GameMatchSDG
            onComplete={(r) => handleGameComplete('matchSDG', r)}
            onHome={goMenu}
          />
        );
      case SCREENS.ecoSpeed:
        return (
          <GameEcoSpeed
            onComplete={(r) => handleGameComplete('ecoSpeed', r)}
            onHome={goMenu}
          />
        );
      case SCREENS.final:
        return (
          <FinalScreen
            roundedScore={totalRounded}
            badge={finalBadge}
            onHome={resetAll}
          />
        );
      default:
        return (
          <HomeScreen
            onStart={goMenu}
            onInstructions={() => setInstructionsOpen(true)}
          />
        );
    }
  };

  const isGame =
    screen === SCREENS.connectSDG ||
    screen === SCREENS.matchSDG ||
    screen === SCREENS.ecoSpeed;

  return (
    <KioskViewport>
      <div className="flex h-full min-h-0 w-full flex-col overflow-hidden game-gradient-bg">
        <Suspense fallback={isGame ? <GameLoading /> : null}>
          {renderScreen()}
        </Suspense>
      </div>
      <InstructionsModal open={instructionsOpen} onClose={() => setInstructionsOpen(false)} />
    </KioskViewport>
  );
}
