import { motion } from 'framer-motion';
import { BookOpen, Play } from 'lucide-react';
import { APP_COPY, BRAND_NAME } from '../data/games';
import breakEvenLogo from '../assets/images/break-even-logo.png';
import landImg from '../assets/land-img.png';
import PageShell from './PageShell';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export default function HomeScreen({ onStart, onInstructions }) {
  return (
    <PageShell screenKey="home" className="justify-between">
      <div className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto pt-4">
        <motion.div
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          className="flex w-full shrink-0 justify-center"
        >
          <img
            src={breakEvenLogo}
            alt="Break Even Consulting"
            className="h-auto w-full max-w-[220px] object-contain md:max-w-[240px]"
          />
        </motion.div>

        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.08 }}
          className="mt-16 flex w-full max-w-lg flex-col items-center gap-5 px-2 text-center md:mt-20"
        >
          <Badge variant="sky" className="px-5 py-2 text-base">
            {BRAND_NAME}
          </Badge>
          <img
            src={landImg}
            alt="Στόχοι Βιώσιμης Ανάπτυξης"
            className="h-auto w-full max-h-[140px] object-contain md:max-h-[180px]"
          />
          <div className="flex w-full flex-col items-center">
            <h1 className="w-full font-display text-4xl font-extrabold leading-tight text-emerald-800 text-shadow-game md:text-5xl">
              {APP_COPY.welcomeTitle}
            </h1>
            <p className="mt-6 w-full max-w-md text-base font-bold leading-snug text-emerald-700/90 md:mt-8 md:text-lg">
              {APP_COPY.welcomeSubtitle}
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mt-6 flex w-full max-w-md shrink-0 flex-col gap-3 self-center pb-1"
      >
        <Button size="xl" onClick={onStart} className="gap-3">
          <Play className="size-7 fill-current" />
          {APP_COPY.startButton}
        </Button>
        <Button variant="secondary" size="lg" onClick={onInstructions} className="gap-2">
          <BookOpen className="size-5" />
          {APP_COPY.instructionsButton}
        </Button>
      </motion.div>
    </PageShell>
  );
}
