import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import {
  APP_COPY,
  MATCH_GAME,
  matchSelectionIsCorrect,
  scoreForMatchLevel,
} from '../../data/games';
import { useGameExit } from '../../hooks/useGameExit';
import GameImage from '../../assets/images/GameImage';
import { sdgImageKey } from '../../assets/images/imageMap';
import SDGCard from '../SDGCard';
import GameHeader from '../GameHeader';
import ProgressBar from '../ProgressBar';
import FeedbackModal from '../FeedbackModal';
import ResultScreen from '../ResultScreen';
import PageShell from '../PageShell';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

const LEVELS = MATCH_GAME.levels;
const LEVEL_COUNT = LEVELS.length;
const REQUIRED_SELECTIONS = 3;

export default function GameMatchSDG({ onComplete, onHome }) {
  const [levelIndex, setLevelIndex] = useState(0);
  const [levelScores, setLevelScores] = useState([]);
  const [levelCorrectCounts, setLevelCorrectCounts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [pendingLevel, setPendingLevel] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState(null);

  const { endCurrentGame, gameEnded } = useGameExit((result) => onComplete(result));

  const level = LEVELS[levelIndex];
  const scene = level.scene;
  const disabled = submitted || gameEnded || showResult;
  const selectionFull = selected.length >= REQUIRED_SELECTIONS;

  const toggleSdg = (id) => {
    if (disabled) return;
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= REQUIRED_SELECTIONS) return prev;
      return [...prev, id];
    });
  };

  const handleCheck = () => {
    if (disabled || selected.length !== REQUIRED_SELECTIONS) return;
    setSubmitted(true);

    const ok = matchSelectionIsCorrect(selected, scene.correctSdgIds);

    if (ok) {
      const levelScore = scoreForMatchLevel(1, LEVEL_COUNT);
      setPendingLevel({ correct: 1, levelScore, levelPerfect: true });
      setFeedback({
        correct: true,
        message: null,
      });
      return;
    }

    const levelScore = scoreForMatchLevel(0, LEVEL_COUNT);
    setPendingLevel({ correct: 0, levelScore, levelPerfect: false });
    setFeedback({
      correct: false,
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
    setSubmitted(false);
    setSelected([]);

    if (levelIndex < LEVEL_COUNT - 1) {
      setLevelIndex((i) => i + 1);
      return;
    }

    const totalCorrect = nextCorrectCounts.reduce((sum, n) => sum + n, 0);
    const gameScore = nextLevelScores.reduce((sum, n) => sum + n, 0);
    const pct = Math.round((totalCorrect / LEVEL_COUNT) * 100);

    setResultData({
      correct: totalCorrect,
      total: LEVEL_COUNT,
      gameScore,
      pct,
      levelsCompleted: LEVEL_COUNT,
    });
    setShowResult(true);
  }, [pendingLevel, levelScores, levelCorrectCounts, levelIndex]);

  const handleFeedbackContinue = () => {
    if (pendingLevel) {
      advanceAfterLevel();
    }
  };

  const handleResultDone = useCallback(() => {
    endCurrentGame(resultData);
  }, [endCurrentGame, resultData]);

  if (showResult && resultData) {
    return (
      <ResultScreen
        title="Τέλος παιχνιδιού!"
        subtitle={`${resultData.correct}/${resultData.total} σκηνές · ${resultData.levelsCompleted} επίπεδα`}
        percent={Math.round(resultData.gameScore)}
        onDone={handleResultDone}
      />
    );
  }

  return (
    <PageShell screenKey={`match-l${levelIndex}`} className="gap-2 overflow-hidden">
      <GameHeader
        title="Ποιος SDG ταιριάζει;"
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

      <ProgressBar current={levelIndex + 1} total={LEVEL_COUNT} label="Επίπεδα" />

      <div className="flex shrink-0 items-center justify-between gap-2">
        <p className="text-sm font-extrabold text-emerald-800 md:text-base">
          Διάλεξε ακριβώς {REQUIRED_SELECTIONS} SDG
        </p>
        <Badge
          variant="sky"
          className={cn(
            'shrink-0 tabular-nums',
            selectionFull && !submitted && 'ring-2 ring-sky-500'
          )}
        >
          {selected.length}/{REQUIRED_SELECTIONS}
        </Badge>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <motion.div
          key={level.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          className="flex min-h-0 flex-1 basis-0 flex-col overflow-hidden rounded-3xl border-4 border-white bg-white/95 shadow-2xl"
        >
          <div className="flex min-h-0 flex-1 flex-col p-2.5">
            <p className="mb-1 shrink-0 text-center font-display text-base font-extrabold leading-tight text-emerald-900 md:text-lg">
              {scene.label}
            </p>
            {scene.sceneHint && (
              <p className="mb-1.5 line-clamp-2 shrink-0 text-center text-xs font-bold leading-snug text-emerald-700/85">
                {scene.sceneHint}
              </p>
            )}
            <div
              className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-gradient-to-b from-sky-50 to-emerald-50"
            >
              <GameImage
                name={sdgImageKey(scene.imageSdgId, 2)}
                alt={scene.label}
                fit="cover"
                className="h-full w-full"
              />
            </div>
          </div>
        </motion.div>

        <div className="grid min-h-0 flex-1 basis-0 grid-cols-3 grid-rows-2 gap-2">
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
                fillCell
                showLabel={false}
                className={cn(
                  isSelected && !submitted && 'ring-4 ring-sky-400 ring-offset-1',
                  selectionFull && !isSelected && !submitted && 'opacity-45 saturate-75'
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
        disabled={disabled || selected.length !== REQUIRED_SELECTIONS}
      >
        <Search className="size-5" />
        {APP_COPY.check}
      </Button>

      <FeedbackModal
        open={!!feedback}
        correct={feedback?.correct}
        message={feedback?.message}
        onContinue={handleFeedbackContinue}
      />
    </PageShell>
  );
}
