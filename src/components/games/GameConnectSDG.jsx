import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link2 } from 'lucide-react';
import { APP_COPY, CONNECT_GAME, scoreForGame } from '../../data/games';
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
import { cn } from '@/lib/utils';

const PAIRS = CONNECT_GAME.pairs;
const TOTAL = PAIRS.length;

export default function GameConnectSDG({ onComplete, onHome }) {
  const [selectedSdg, setSelectedSdg] = useState(null);
  const [connections, setConnections] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [lineStatuses, setLineStatuses] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [canRetry, setCanRetry] = useState(true);

  const containerRef = useRef(null);
  const sdgRefs = useRef({});
  const actionRefs = useRef({});

  const { endCurrentGame, gameEnded } = useGameExit((result) => onComplete(result));

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

  useEffect(() => {
    const id = requestAnimationFrame(remeasure);
    return () => cancelAnimationFrame(id);
  }, [connections, remeasure, shuffleKey]);

  const connectedCount = connections.length;
  const disabled = submitted || gameEnded || showResult;

  const setSdgRef = (id) => (el) => {
    if (el) sdgRefs.current[id] = el;
  };
  const setActionRef = (id) => (el) => {
    if (el) actionRefs.current[id] = el;
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
  };

  const handleCheck = () => {
    if (disabled || connections.length < TOTAL) return;
    setSubmitted(true);

    const statuses = {};
    let correct = 0;
    PAIRS.forEach((pair) => {
      const conn = connections.find((c) => c.sdgId === pair.sdgId);
      const ok = conn?.actionId === pair.actionId;
      if (ok) correct += 1;
      if (conn) statuses[`${conn.sdgId}-${conn.actionId}`] = ok ? 'correct' : 'wrong';
    });
    setLineStatuses(statuses);

    const gameScore = scoreForGame(correct, TOTAL);
    const pct = Math.round((correct / TOTAL) * 100);

    setFeedback({
      correct: correct === TOTAL,
      message:
        correct === TOTAL
          ? 'Τέλεια! Όλες οι συνδέσεις είναι σωστές!'
          : `Σωστές συνδέσεις: ${correct} από ${TOTAL}. Δες τις πράσινες γραμμές!`,
    });
    setResultData({ correct, total: TOTAL, gameScore, pct });
  };

  const finishAfterFeedback = () => {
    setFeedback(null);
    setShowResult(true);
    setCanRetry(true);
  };

  const handleTryAgain = () => {
    setCanRetry(false);
    setFeedback(null);
    setSubmitted(false);
    setLineStatuses({});
  };

  const handleResultDone = useCallback(() => {
    endCurrentGame(resultData);
  }, [endCurrentGame, resultData]);

  const handleReplay = () => {
    setSelectedSdg(null);
    setConnections([]);
    setSubmitted(false);
    setLineStatuses({});
    setFeedback(null);
    setShowResult(false);
    setResultData(null);
    setShuffleKey((k) => k + 1);
    setCanRetry(true);
  };

  const actionCards = useMemo(() => {
    const shuffled = [...PAIRS];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [shuffleKey]);

  if (showResult && resultData) {
    return (
      <ResultScreen
        title="Τέλος παιχνιδιού!"
        subtitle={`${resultData.correct} από ${resultData.total} σωστές συνδέσεις`}
        percent={resultData.pct}
        onDone={handleResultDone}
      />
    );
  }

  return (
    <PageShell screenKey="connect" className="gap-3 overflow-hidden">
      <GameHeader title="Σύνδεσε τον SDG με τη δράση" onHome={onHome} onReplay={handleReplay} />
      <ProgressBar current={connectedCount} total={TOTAL} />

      <motion.p
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="shrink-0 text-center text-sm font-extrabold text-emerald-800 md:text-base"
      >
        {selectedSdg
          ? 'Τώρα πάτα τη σωστή δράση κάτω ↓'
          : 'Πάτα έναν SDG πάνω ↑, μετά τη δράση κάτω ↓'}
      </motion.p>

      <div
        ref={containerRef}
        className="relative flex min-h-0 flex-1 flex-col justify-between gap-6 overflow-visible py-1"
      >
        <ConnectionOverlay lines={lines} width={size.width} height={size.height} />

        <div className="z-10 grid grid-cols-3 gap-3">
          {PAIRS.map((pair) => {
            const conn = connections.find((c) => c.sdgId === pair.sdgId);
            const status = submitted
              ? conn?.actionId === pair.actionId
                ? 'correct'
                : 'wrong'
              : null;
            return (
              <SDGCard
                key={pair.sdgId}
                sdgId={pair.sdgId}
                selected={selectedSdg === pair.sdgId}
                onClick={() => handleSdgTap(pair.sdgId)}
                refCallback={setSdgRef(pair.sdgId)}
                status={status}
                compact
              />
            );
          })}
        </div>

        <div className="z-10 grid grid-cols-3 gap-3">
          {actionCards.map((pair) => {
            const conn = connections.find((c) => c.actionId === pair.actionId);
            const status = conn
              ? lineStatuses[`${conn.sdgId}-${conn.actionId}`] || null
              : null;
            return (
              <motion.button
                key={pair.actionId}
                ref={setActionRef(pair.actionId)}
                type="button"
                whileTap={{ scale: 0.96 }}
                whileHover={disabled ? undefined : { scale: 1.03 }}
                onClick={() => handleActionTap(pair.actionId)}
                disabled={disabled}
                className={cn(
                  'flex h-full min-h-[120px] flex-col overflow-hidden rounded-2xl border-4 bg-white p-2 text-center shadow-xl transition-colors',
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
            );
          })}
        </div>
      </div>

      <Button
        size="lg"
        className="w-full gap-2"
        onClick={handleCheck}
        disabled={disabled || connectedCount < TOTAL}
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
