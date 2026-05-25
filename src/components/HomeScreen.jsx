import { motion } from 'framer-motion';
import { BookOpen, Play } from 'lucide-react';
import { APP_COPY, BRAND_NAME } from '../data/games';
import landImg from '../assets/land-img.png';
import PageShell from './PageShell';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export default function HomeScreen({ onStart, onInstructions }) {
  return (
    <PageShell screenKey="home" className="justify-between">
      <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
        <Badge variant="sky" className="text-base px-4 py-1.5">
          {BRAND_NAME}
        </Badge>

        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="flex w-full max-w-lg flex-col items-center gap-3"
        >
          <img
            src={landImg}
            alt=""
            className="h-auto w-full max-h-[200px] object-contain drop-shadow-xl md:max-h-[240px]"
          />
          <h1 className="font-display text-4xl font-extrabold leading-tight text-emerald-800 text-shadow-game md:text-5xl">
            {APP_COPY.welcomeTitle}
          </h1>
        </motion.div>

        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-md text-lg font-bold text-emerald-700/90"
        >
          {APP_COPY.welcomeSubtitle}
        </motion.p>
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex w-full max-w-md flex-col gap-3 self-center"
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
