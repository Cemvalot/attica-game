import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link2 } from 'lucide-react';
import {
  APP_COPY,
  CONNECT_GAME,
  scoreForConnectLevel,
} from '../../data/games';
import { useGameExit } from '../../hooks/useGameExit';
import { useConnectionLines } from '../../hooks/useConnectionLines';
import Illustration from '../../assets/illustrations/Illustration';
import SDGCard from '../SDGCard';
import GameHeader from '../GameHeader';
import ProgressBar from '../ProgressBar';
import FeedbackModal from '../FeedbackModal';
import ResultScreen from '../ResultScreen';
import PageShell from '../PageShell';
import { ConnectionOverlay } from '../ConnectionLine';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

const LEVELS = CONNECT_GAME.levels;
const PAIRS_PER_LEVEL = CONNECT_GAME.pairsPerLevel;
const LEVEL_COUNT = LEVELS.length;

export default function GameConnectSDG({ onComplete, onHome }) {
  const [levelIndex, setLevelIndex] = useState(0);
  const [levelScores, setLevelScores] = useState([]);
  const [levelCorrectCounts, setLevelCorrectCounts] = useState([]);
  const [selectedSdg, setSelectedSdg] = useState(null);
  const [connections, setConnections] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [lineStatuses, setLineStatuses] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [pendingLevel, setPendingLevel] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [canRetry, setCanRetry] = useState(true);

  const containerRef = useRef(null);
  const sdgRefs = useRef({});
  const actionRefs = useRef({});

  const { endCurrentGame, gameEnded } = useGameExit((result) => onComplete(result));

  const level = LEVELS[levelIndex];
  const pairs = level.pairs;
  const totalPairs = pairs.length;

  const connectionsWithStatus = useMemo(
    () =>
      connections.map((c) => ({
        ...c,
        status: lineStatuses[`${c.sdgId}-${c.actionId}`] || 'idle',
      })),
    [connections, lineStatuses]
  );

  const { lines, size, remeasure } = useConnectionLines(
    containerRef,
    connectionsWithStatus,
    sdgRefs,
    actionRefs
  );

  const scheduleMeasure = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(remeasure);
    });
  }, [remeasure]);

  useEffect(() => {
    sdgRefs.current = {};
    actionRefs.current = {};
  }, [levelIndex, shuffleKey]);

  useEffect(() => {
    scheduleMeasure();
  }, [connections, lineStatuses, levelIndex, shuffleKey, scheduleMeasure]);

  const connectedCount = connections.length;
  const disabled = submitted || gameEnded || showResult;

  const setSdgRef = (id) => (el) => {
    if (el) sdgRefs.current[id] = el;
    else delete sdgRefs.current[id];
    scheduleMeasure();
  };
  const setActionRef = (id) => (el) => {
    if (el) actionRefs.current[id] = el;
    else delete actionRefs.current[id];
    scheduleMeasure();
  };

  const handleSdgTap = (sdgId) => {
    if (disabled) return;
    setSelectedSdg(sdgId);
  };

  const handleActionTap = (actionId) => {
    if (disabled || selectedSdg == null) return;
    setConnections((prev) => {
      const filtered = prev.filter((c) => c.sdgId !== selectedSdg && c.actionId !== actionId);
      return [...filtered, { sdgId: selectedSdg, actionId }];
    });
    setSelectedSdg(null);
    scheduleMeasure();
  };

  const handleCheck = () => {
    if (disabled || connections.length < totalPairs) return;
    setSubmitted(true);

    const statuses = {};
    let correct = 0;
    pairs.forEach((pair) => {
      const conn = connections.find((c) => c.sdgId === pair.sdgId);
      const ok = conn?.actionId === pair.actionId;
      if (ok) correct += 1;
      if (conn) statuses[`${conn.sdgId}-${conn.actionId}`] = ok ? 'correct' : 'wrong';
    });
    setLineStatuses(statuses);

    const levelScore = scoreForConnectLevel(correct, totalPairs);
    const levelPerfect = correct === totalPairs;

    setPendingLevel({ correct, levelScore, levelPerfect });
    setFeedback({
      correct: levelPerfect,
      message: levelPerfect
        ? `${level.title}: Τέλεια! +${Math.round(levelScore)}% στο σκορ σου.`
        : `${level.title}: ${correct} από ${totalPairs} σωστές. +${Math.round(levelScore)}%`,
    });
  };

  const advanceAfterLevel = useCallback(() => {
    if (!pendingLevel) return;

    const nextLevelScores = [...levelScores, pendingLevel.levelScore];
    const nextCorrectCounts = [...levelCorrectCounts, pendingLevel.correct];
    setLevelScores(nextLevelScores);
    setLevelCorrectCounts(nextCorrectCounts);
    setPendingLevel(null);
    setFeedback(null);
    setCanRetry(true);

    if (levelIndex < LEVEL_COUNT - 1) {
      setLevelIndex((i) => i + 1);
      setSelectedSdg(null);
      setConnections([]);
      setSubmitted(false);
      setLineStatuses({});
      setShuffleKey((k) => k + 1);
      return;
    }

    const totalCorrect = nextCorrectCounts.reduce((sum, n) => sum + n, 0);
    const totalQuestions = LEVEL_COUNT * PAIRS_PER_LEVEL;
    const gameScore = nextLevelScores.reduce((sum, n) => sum + n, 0);
    const pct = Math.round((totalCorrect / totalQuestions) * 100);

    setResultData({
      correct: totalCorrect,
      total: totalQuestions,
      gameScore,
      pct,
      levelsCompleted: LEVEL_COUNT,
    });
    setShowResult(true);
  }, [pendingLevel, levelScores, levelCorrectCounts, levelIndex, level.title]);

  const finishAfterFeedback = () => {
    advanceAfterLevel();
  };

  const handleTryAgain = () => {
    setCanRetry(false);
    setFeedback(null);
    setSubmitted(false);
    setLineStatuses({});
    setPendingLevel(null);
  };

  const handleResultDone = useCallback(() => {
    endCurrentGame(resultData);
  }, [endCurrentGame, resultData]);

  const actionCards = useMemo(() => {
    const shuffled = [...pairs];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [shuffleKey, pairs]);

  if (showResult && resultData) {
    return (
      <ResultScreen
        title="Τέλος παιχνιδιού!"
        subtitle={`${resultData.correct}/${resultData.total} συνδέσεις · ${resultData.levelsCompleted} επίπεδα`}
        percent={Math.round(resultData.gameScore)}
        onDone={handleResultDone}
      />
    );
  }

  return (
    <PageShell screenKey={`connect-l${levelIndex}`} className="gap-3 overflow-hidden">
      <GameHeader
        title="Σύνδεσε τον SDG με τη δράση"
        onHome={onHome}
        right={
          <Badge variant="sky" className="tabular-nums">
            {level.title}
          </Badge>
        }
      />

      <div className="flex shrink-0 items-center justify-between gap-2">
        <p className="text-sm font-extrabold text-emerald-800 md:text-base">{level.subtitle}</p>
        <span className="text-xs font-bold text-emerald-700/80">
          Επίπεδο {levelIndex + 1}/{LEVEL_COUNT}
        </span>
      </div>

      <ProgressBar current={connectedCount} total={totalPairs} label="Συνδέσεις" />

      <div
        ref={containerRef}
        className="relative flex min-h-0 flex-1 flex-col justify-between gap-4 overflow-visible py-1 sm:gap-6"
      >
        <div className="relative z-10 grid grid-cols-3 gap-3">
          {pairs.map((pair) => {
            const conn = connections.find((c) => c.sdgId === pair.sdgId);
            const status = submitted
              ? conn?.actionId === pair.actionId
                ? 'correct'
                : 'wrong'
              : null;
            return (
              <SDGCard
                key={`${level.id}-${pair.sdgId}`}
                sdgId={pair.sdgId}
                selected={selectedSdg === pair.sdgId}
                onClick={() => handleSdgTap(pair.sdgId)}
                refCallback={setSdgRef(pair.sdgId)}
                status={status}
                compact
                showLabel={false}
              />
            );
          })}
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-3">
          {actionCards.map((pair) => {
            const conn = connections.find((c) => c.actionId === pair.actionId);
            const status = conn
              ? lineStatuses[`${conn.sdgId}-${conn.actionId}`] || null
              : null;
            return (
              <div
                key={`${level.id}-${pair.actionId}`}
                ref={setActionRef(pair.actionId)}
                className="h-full w-full"
              >
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  whileHover={disabled ? undefined : { scale: 1.03 }}
                  onClick={() => handleActionTap(pair.actionId)}
                  disabled={disabled}
                  className={cn(
                    'flex h-full min-h-[120px] w-full flex-col overflow-hidden rounded-2xl border-4 bg-white p-2 text-center shadow-xl transition-colors',
                    conn && 'border-sky-400 ring-2 ring-sky-200',
                    status === 'correct' && 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-300',
                    status === 'wrong' && 'border-rose-500 bg-rose-50 ring-4 ring-rose-200',
                    selectedSdg && !disabled && !conn && 'border-amber-400 ring-4 ring-amber-200'
                  )}
                >
                  <div className="min-h-0 flex-1 overflow-hidden rounded-xl">
                    <Illustration
                      name={pair.illustration}
                      animate={false}
                      className="!aspect-square h-full w-full"
                    />
                  </div>
                  <span className="mt-1.5 line-clamp-3 text-xs font-extrabold leading-snug text-emerald-900">
                    {pair.actionText}
                  </span>
                </motion.button>
              </div>
            );
          })}
        </div>

        <ConnectionOverlay lines={lines} width={size.width} height={size.height} />
      </div>

      <Button
        size="lg"
        className="w-full gap-2"
        onClick={handleCheck}
        disabled={disabled || connectedCount < totalPairs}
      >
        <Link2 className="size-5" />
        {APP_COPY.check}
      </Button>

      <FeedbackModal
        open={!!feedback}
        correct={feedback?.correct}
        message={feedback?.message}
        onContinue={finishAfterFeedback}
        onTryAgain={handleTryAgain}
        canTryAgain={canRetry}
      />
    </PageShell>
  );
}
