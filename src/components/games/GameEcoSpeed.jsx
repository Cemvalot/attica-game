import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Timer, ThumbsDown, ThumbsUp, Zap } from 'lucide-react';
import { APP_COPY, ECO_SPEED_GAME, scoreForEcoSpeed } from '../../data/games';
import { useGameExit } from '../../hooks/useGameExit';
import Illustration from '../../assets/illustrations/Illustration';
import GameHeader from '../GameHeader';
import ProgressBar from '../ProgressBar';
import ResultScreen from '../ResultScreen';
import PageShell from '../PageShell';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

const ITEMS = ECO_SPEED_GAME.items;
const TOTAL = ITEMS.length;
const DURATION = ECO_SPEED_GAME.durationSeconds;
const FLASH_MS = 450;
const LOW_TIME_SECONDS = 20;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function GameEcoSpeed({ onComplete, onHome }) {
  const [phase, setPhase] = useState('intro');
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [flash, setFlash] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState(null);

  const endedRef = useRef(false);
  const correctRef = useRef(0);
  const flashTimerRef = useRef(null);
  const timerRef = useRef(null);

  const { endCurrentGame, gameEnded } = useGameExit((result) => onComplete(result));

  const finishGame = useCallback(() => {
    if (endedRef.current) return;
    endedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);

    setPhase('ended');
    const finalCorrect = correctRef.current;
    const gameScore = scoreForEcoSpeed(finalCorrect, TOTAL);
    const pct = Math.round((finalCorrect / TOTAL) * 100);
    setResultData({ correct: finalCorrect, total: TOTAL, gameScore, pct });
    setShowResult(true);
  }, []);

  const startGame = () => {
    endedRef.current = false;
    setQueue(shuffle(ITEMS));
    setIndex(0);
    setTimeLeft(DURATION);
    setCorrect(0);
    correctRef.current = 0;
    setAnswered(0);
    setFlash(null);
    setShowResult(false);
    setResultData(null);
    setPhase('playing');
  };

  useEffect(() => {
    if (phase !== 'playing' || endedRef.current) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          finishGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, finishGame]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    };
  }, []);

  const handleAnswer = (pickedGood) => {
    if (phase !== 'playing' || endedRef.current || gameEnded) return;
    if (flash) return;

    const item = queue[index];
    if (!item) return;

    const isCorrect = pickedGood === item.isGood;

    if (!isCorrect) {
      const nextAnswered = answered + 1;
      setAnswered(nextAnswered);
      setFlash('wrong');

      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      flashTimerRef.current = setTimeout(() => {
        setFlash(null);
        if (endedRef.current) return;
        if (nextAnswered >= TOTAL) {
          finishGame();
        } else {
          setIndex((i) => i + 1);
        }
      }, FLASH_MS);
      return;
    }

    const nextCorrect = correctRef.current + 1;
    correctRef.current = nextCorrect;
    const nextAnswered = answered + 1;

    setAnswered(nextAnswered);
    setCorrect(nextCorrect);
    setFlash('correct');

    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    flashTimerRef.current = setTimeout(() => {
      setFlash(null);
      if (endedRef.current) return;
      if (nextAnswered >= TOTAL) {
        finishGame();
      } else {
        setIndex((i) => i + 1);
      }
    }, FLASH_MS);
  };

  const handleResultDone = useCallback(() => {
    endCurrentGame(resultData);
  }, [endCurrentGame, resultData]);

  const handleReplay = () => {
    endedRef.current = false;
    correctRef.current = 0;
    if (timerRef.current) clearInterval(timerRef.current);
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    setPhase('intro');
    setShowResult(false);
  };

  const item = queue[index];
  const disabled = phase !== 'playing' || !!flash || endedRef.current || gameEnded;

  if (showResult && resultData) {
    return (
      <ResultScreen
        title="Eco Speed — Τέλος!"
        subtitle={`${resultData.correct} σωστές από ${resultData.total}`}
        percent={resultData.pct}
        onDone={handleResultDone}
      />
    );
  }

  if (phase === 'intro') {
    return (
      <PageShell screenKey="eco-intro">
        <GameHeader title="Eco Speed Challenge" onHome={onHome} />
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-32"
          >
            <Illustration name="speed" />
          </motion.div>
          <h3 className="font-display text-3xl font-extrabold text-sky-700">2 λεπτά!</h3>
          <p className="max-w-sm text-lg font-bold text-emerald-800">
            Απόφασε γρήγορα: καλό ή όχι για τον πλανήτη;
          </p>
          <Button size="xl" variant="sky" onClick={startGame} className="gap-2">
            <Zap className="size-7" />
            Ξεκίνα!
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell screenKey={`eco-${index}`} className="relative gap-2 overflow-hidden">
      <GameHeader
        title="Eco Speed Challenge"
        onHome={onHome}
        onReplay={handleReplay}
        right={
          <Badge
            variant="default"
            className={cn(
              'gap-1 px-3 py-1.5 text-base tabular-nums',
              timeLeft <= LOW_TIME_SECONDS &&
                'animate-pulse border-rose-300 bg-rose-200 text-rose-800'
            )}
          >
            <Timer className="size-4" />
            {formatTime(timeLeft)}
          </Badge>
        }
      />
      <ProgressBar current={answered} total={TOTAL} label="Απαντήσεις" />

      <div className="relative flex min-h-0 flex-1 flex-col gap-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={item?.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border-4 border-white bg-white/95 shadow-2xl"
          >
            <div className="flex min-h-0 flex-1 flex-col p-3">
              <div
                className={cn(
                  'relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-gradient-to-b from-sky-50 to-emerald-50 transition-shadow',
                  flash === 'correct' && 'ring-4 ring-emerald-400',
                  flash === 'wrong' && 'ring-4 ring-rose-400'
                )}
              >
                {item && (
                  <Illustration
                    name={item.illustration}
                    animate={false}
                    className="!aspect-auto h-full min-h-[160px] w-full"
                  />
                )}
              </div>
              {item && (
                <p className="mt-2 shrink-0 px-1 text-center font-display text-xl font-extrabold leading-tight text-emerald-900 md:text-2xl">
                  {item.label}
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {flash === 'correct' && (
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-x-0 top-1/3 z-20 flex -translate-y-1/2 justify-center px-4"
              aria-live="polite"
            >
              <p className="rounded-2xl border-4 border-white bg-white px-6 py-3 text-center font-display text-4xl font-extrabold text-emerald-600 shadow-xl">
                {APP_COPY.correct}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-3 pb-1">
        <Button
          variant="good"
          size="lg"
          className="eco-answer-btn h-auto min-h-[7.5rem] flex-col gap-2 rounded-3xl py-4 text-lg"
          onClick={() => handleAnswer(true)}
          disabled={disabled}
        >
          <ThumbsUp className="size-11" />
          <span className="text-center leading-tight">{APP_COPY.good}</span>
        </Button>
        <Button
          variant="bad"
          size="lg"
          className="eco-answer-btn h-auto min-h-[7.5rem] flex-col gap-2 rounded-3xl py-4 text-lg"
          onClick={() => handleAnswer(false)}
          disabled={disabled}
        >
          <ThumbsDown className="size-11" />
          <span className="text-center leading-tight">{APP_COPY.bad}</span>
        </Button>
      </div>
    </PageShell>
  );
}
