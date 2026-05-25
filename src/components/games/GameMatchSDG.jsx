import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import {
  APP_COPY,
  MATCH_GAME,
  matchSelectionIsCorrect,
  scoreForGame,
} from '../../data/games';
import { useGameExit } from '../../hooks/useGameExit';
import Illustration from '../../assets/illustrations/Illustration';
import SDGCard from '../SDGCard';
import GameHeader from '../GameHeader';
import ProgressBar from '../ProgressBar';
import FeedbackModal from '../FeedbackModal';
import ResultScreen from '../ResultScreen';
import PageShell from '../PageShell';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

const SCENES = MATCH_GAME.scenes;
const TOTAL = SCENES.length;

export default function GameMatchSDG({ onComplete, onHome }) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [selected, setSelected] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [canRetry, setCanRetry] = useState(true);

  const { endCurrentGame, gameEnded } = useGameExit((result) => onComplete(result));

  const scene = SCENES[sceneIndex];
  const disabled = submitted || gameEnded || showResult;

  const toggleSdg = (id) => {
    if (disabled) return;
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCheck = () => {
    if (disabled || selected.length === 0) return;
    setSubmitted(true);

    const ok = matchSelectionIsCorrect(selected, scene.correctSdgIds);
    if (ok) setCorrectCount((c) => c + 1);

    setFeedback({
      correct: ok,
      message: ok
        ? scene.feedbackCorrect
        : canRetry
          ? APP_COPY.tryAgain
          : APP_COPY.advanceScene,
    });
  };

  const handleFeedbackContinue = () => {
    setFeedback(null);
    setSubmitted(false);
    setSelected([]);

    if (sceneIndex + 1 >= TOTAL) {
      const gameScore = scoreForGame(correctCount, TOTAL);
      const pct = Math.round((correctCount / TOTAL) * 100);
      setResultData({ correct: correctCount, total: TOTAL, gameScore, pct });
      setShowResult(true);
      return;
    }
    setSceneIndex((i) => i + 1);
    setCanRetry(true);
  };

  const handleTryAgain = () => {
    setCanRetry(false);
    setFeedback(null);
    setSubmitted(false);
    setSelected([]);
  };

  const handleResultDone = useCallback(() => {
    endCurrentGame(resultData);
  }, [endCurrentGame, resultData]);

  const handleReplay = () => {
    setSceneIndex(0);
    setSelected([]);
    setCorrectCount(0);
    setFeedback(null);
    setSubmitted(false);
    setShowResult(false);
    setResultData(null);
    setCanRetry(true);
  };

  if (showResult && resultData) {
    return (
      <ResultScreen
        title="Τέλος παιχνιδιού!"
        subtitle={`${resultData.correct}/${resultData.total} Σωστές Απαντήσεις`}
        percent={resultData.pct}
        onDone={handleResultDone}
      />
    );
  }

  return (
    <PageShell screenKey={`match-${sceneIndex}`} className="gap-2 overflow-hidden">
      <GameHeader title="Ποιος SDG ταιριάζει;" onHome={onHome} onReplay={handleReplay} />
      <ProgressBar current={sceneIndex + 1} total={TOTAL} />

      <div className="flex shrink-0 items-center justify-between gap-2">
        <p className="text-sm font-extrabold text-emerald-800 md:text-base">
          Διάλεξε όλους τους σωστούς SDG
        </p>
        <Badge variant="sky" className="shrink-0 tabular-nums">
          {selected.length} επιλογές
        </Badge>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <motion.div
          key={scene.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border-4 border-white bg-white/95 shadow-2xl"
        >
          <div className="flex min-h-0 flex-1 flex-col p-3">
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-gradient-to-b from-sky-50 to-emerald-50">
              <Illustration
                name={scene.illustration}
                animate={false}
                className="!aspect-auto h-full min-h-[180px] w-full"
              />
            </div>
            <p className="mt-2 shrink-0 text-center font-display text-lg font-extrabold leading-tight text-emerald-900 md:text-xl">
              {scene.label}
            </p>
          </div>
        </motion.div>

        <div
          className="grid shrink-0 grid-cols-3 gap-2"
          style={{ gridTemplateRows: 'repeat(2, minmax(0, 1fr))' }}
        >
          {scene.optionSdgIds.map((id) => {
            const isSelected = selected.includes(id);
            let status = null;
            if (submitted) {
              if (isSelected && scene.correctSdgIds.includes(id)) status = 'correct';
              else if (isSelected && !scene.correctSdgIds.includes(id)) status = 'wrong';
            }
            return (
              <SDGCard
                key={id}
                sdgId={id}
                selected={isSelected}
                onClick={() => toggleSdg(id)}
                status={status}
                compact
                showLabel={false}
                className={cn(
                  isSelected && !submitted && 'ring-4 ring-sky-400 ring-offset-1'
                )}
              />
            );
          })}
        </div>
      </div>

      <Button
        size="lg"
        className="shrink-0 gap-2"
        onClick={handleCheck}
        disabled={disabled || selected.length === 0}
      >
        <Search className="size-5" />
        {APP_COPY.check}
      </Button>

      <FeedbackModal
        open={!!feedback}
        correct={feedback?.correct}
        message={feedback?.message}
        onContinue={handleFeedbackContinue}
        onTryAgain={handleTryAgain}
        canTryAgain={canRetry}
      />
    </PageShell>
  );
}
