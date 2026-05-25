import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link2 } from 'lucide-react';
import {
  APP_COPY,
  CONNECT_GAME,
  scoreForConnectLevel,
} from '../../data/games';
import { useGameExit } from '../../hooks/useGameExit';
import { useConnectionLines } from '../../hooks/useConnectionLines';
import GameImage from '../../assets/images/GameImage';
import { sdgImageKey } from '../../assets/images/imageMap';
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

  const boardRef = useRef(null);

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

  const { lines, size, measureNow, scheduleMeasure } = useConnectionLines(
    boardRef,
    connectionsWithStatus
  );

  useLayoutEffect(() => {
    scheduleMeasure();
  }, [levelIndex, shuffleKey, scheduleMeasure]);

  const actionCards = useMemo(() => {
    const shuffled = [...pairs];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [shuffleKey, pairs]);

  useLayoutEffect(() => {
    measureNow();
    scheduleMeasure();
  }, [connections, lineStatuses, measureNow, scheduleMeasure]);

  const connectedCount = connections.length;
  const disabled = submitted || gameEnded || showResult;

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
      message: null,
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

  const handleResultDone = useCallback(() => {
    endCurrentGame(resultData);
  }, [endCurrentGame, resultData]);

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
    <PageShell screenKey="connectSDG" className="gap-3 overflow-hidden">
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
        ref={boardRef}
        className="relative flex min-h-0 flex-1 flex-col gap-3 overflow-visible py-1 sm:gap-4"
      >
        <div className="relative z-10 shrink-0 grid grid-cols-3 gap-3">
          {pairs.map((pair) => {
            const conn = connections.find((c) => c.sdgId === pair.sdgId);
            const status = submitted
              ? conn?.actionId === pair.actionId
                ? 'correct'
                : 'wrong'
              : null;
            return (
              <div
                key={`${level.id}-${pair.sdgId}`}
                data-connect-top={pair.sdgId}
                className="h-full w-full"
              >
                <SDGCard
                  sdgId={pair.sdgId}
                  selected={selectedSdg === pair.sdgId}
                  onClick={() => handleSdgTap(pair.sdgId)}
                  status={status}
                  compact
                  showLabel={false}
                />
              </div>
            );
          })}
        </div>

        <div
          className="pointer-events-none min-h-10 shrink-0 flex-1 sm:min-h-14"
          aria-hidden="true"
        />

        <div className="relative z-10 shrink-0 grid grid-cols-3 gap-3">
          {actionCards.map((pair) => {
            const conn = connections.find((c) => c.actionId === pair.actionId);
            const status = conn
              ? lineStatuses[`${conn.sdgId}-${conn.actionId}`] || null
              : null;
            return (
              <div
                key={`${level.id}-${pair.actionId}`}
                data-connect-bottom={pair.actionId}
                className="h-full w-full"
              >
                <button
                  type="button"
                  onClick={() => handleActionTap(pair.actionId)}
                  disabled={disabled}
                  className={cn(
                    'flex h-full min-h-[120px] w-full flex-col overflow-hidden rounded-2xl border-4 bg-white p-2 text-center shadow-xl transition-transform duration-150 active:scale-[0.97]',
                    !disabled && 'hover:scale-[1.02]',
                    conn && 'border-sky-400 ring-2 ring-sky-200',
                    status === 'correct' && 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-300',
                    status === 'wrong' && 'border-rose-500 bg-rose-50 ring-4 ring-rose-200',
                    selectedSdg && !disabled && !conn && 'border-amber-400 ring-4 ring-amber-200'
                  )}
                >
                  <div
                    className={cn(
                      'flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl',
                      pair.imageFit === 'contain' && 'bg-gradient-to-b from-sky-50 to-emerald-50'
                    )}
                  >
                    <GameImage
                      name={pair.image ?? sdgImageKey(pair.sdgId)}
                      alt={pair.actionText}
                      fit={pair.imageFit ?? 'cover'}
                      className={cn(
                        'h-full w-full',
                        (pair.imageFit ?? 'cover') === 'cover' && 'aspect-square'
                      )}
                      onLoad={scheduleMeasure}
                    />
                  </div>
                  <div className="mt-1.5 shrink-0 space-y-0.5 text-center">
                    <span
                      className={cn(
                        'block text-xs font-extrabold leading-snug text-emerald-900',
                        pair.actionDetail ? 'line-clamp-2' : 'line-clamp-4'
                      )}
                    >
                      {pair.actionText}
                    </span>
                    {pair.actionDetail && (
                      <span className="block line-clamp-2 text-[10px] font-bold leading-snug text-emerald-700/85">
                        {pair.actionDetail}
                      </span>
                    )}
                  </div>
                </button>
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
      />
    </PageShell>
  );
}
