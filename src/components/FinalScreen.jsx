import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';
import { Award, RotateCcw, Trophy } from 'lucide-react';
import { APP_COPY } from '../data/games';
import { KIOSK_HEIGHT, KIOSK_WIDTH } from '../constants/kiosk';
import PageShell from './PageShell';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const badgeMeta = {
  explorer: { icon: Award, color: 'from-emerald-400 to-green-500', label: 'Eco Explorer' },
  protector: { icon: Trophy, color: 'from-sky-400 to-blue-500', label: 'Planet Protector' },
  hero: { icon: Trophy, color: 'from-amber-300 to-orange-400', label: 'Eco Hero' },
};

export default function FinalScreen({ roundedScore, badge, onPlayAgain }) {
  const [displayScore, setDisplayScore] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 1000);
      setDisplayScore(Math.round(roundedScore * t));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [roundedScore]);

  const meta = badgeMeta[badge?.id] ?? badgeMeta.protector;
  const Icon = meta.icon;

  return (
    <PageShell screenKey="final" className="justify-center">
      <Confetti
        width={KIOSK_WIDTH}
        height={KIOSK_HEIGHT}
        recycle={false}
        numberOfPieces={280}
        colors={['#22c55e', '#0ea5e9', '#facc15', '#4ade80', '#38bdf8']}
      />

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center gap-6 text-center"
      >
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 3, -3, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        >
          <Trophy className="size-24 text-amber-400 drop-shadow-lg" />
        </motion.div>

        <h1 className="font-display text-5xl font-extrabold text-emerald-800 text-shadow-game">
          {APP_COPY.finalTitle}
        </h1>
        <p className="max-w-sm text-xl font-bold text-emerald-700">{APP_COPY.finalSubtitle}</p>

        <motion.div
          className="relative flex size-36 items-center justify-center rounded-full border-4 border-white bg-white shadow-2xl"
          animate={{ boxShadow: ['0 0 0 0 rgba(34,197,94,0.4)', '0 0 0 20px rgba(34,197,94,0)', '0 0 0 0 rgba(34,197,94,0)'] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        >
          <span className="font-display text-5xl font-extrabold text-emerald-600">
            {displayScore}%
          </span>
        </motion.div>

        <Badge variant="hero" className="flex items-center gap-2 px-6 py-3 text-lg">
          <Icon className="size-6" />
          {badge?.label ?? meta.label}
        </Badge>

        <Button size="xl" variant="sun" onClick={onPlayAgain} className="gap-2">
          <RotateCcw className="size-6" />
          {APP_COPY.playAgain}
        </Button>
      </motion.div>
    </PageShell>
  );
}
