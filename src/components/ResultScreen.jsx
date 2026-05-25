import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Home, PartyPopper } from 'lucide-react';
import { APP_COPY } from '../data/games';
import PageShell from './PageShell';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

export default function ResultScreen({
  title = 'Μπράβο!',
  subtitle,
  percent,
  onDone,
}) {
  const [displayPct, setDisplayPct] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 800);
      setDisplayPct(Math.round((percent ?? 0) * t));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [percent]);

  return (
    <PageShell screenKey="result" className="justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="w-full"
      >
        <Card className="mx-auto max-w-md border-4 border-amber-200 bg-gradient-to-b from-white via-emerald-50 to-sky-50 shadow-2xl">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <motion.div
              animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <PartyPopper className="size-16 text-amber-500" />
            </motion.div>
            <h2 className="font-display text-3xl font-extrabold text-emerald-800">{title}</h2>
            {subtitle && (
              <p className="text-lg font-bold text-emerald-700">{subtitle}</p>
            )}
            {percent != null && (
              <motion.p
                key={displayPct}
                className="font-display text-5xl font-extrabold text-sky-600"
              >
                {displayPct}%
              </motion.p>
            )}
            <Button size="xl" variant="sky" className="mt-2 w-full gap-2" onClick={onDone}>
              <Home className="size-6" />
              {APP_COPY.home}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </PageShell>
  );
}
