import { motion } from 'framer-motion';
import { CheckCircle2, Home, Sparkles } from 'lucide-react';
import { APP_COPY, GAME_WEIGHT, MENU_GAMES } from '../data/games';
import Illustration from '../assets/illustrations/Illustration';
import PageShell from './PageShell';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Card, CardContent } from './ui/card';
import { cn } from '@/lib/utils';

const cardVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 22, delay: i * 0.06 },
  }),
};

export default function GameMenu({ onSelectGame, onHome, completedGames, gameScores, totalRounded }) {
  const doneCount = completedGames.length;
  const totalGames = MENU_GAMES.length;
  const progressPct = (doneCount / totalGames) * 100;

  return (
    <PageShell screenKey="menu" className="gap-3 overflow-hidden">
      <header className="flex shrink-0 items-center gap-3">
        <Button variant="icon" size="icon" onClick={onHome} aria-label="Αρχική">
          <Home className="size-6" />
        </Button>
        <div className="flex-1 text-center">
          <h2 className="font-display text-2xl font-extrabold text-emerald-900">
            {APP_COPY.menuTitle}
          </h2>
          {totalRounded > 0 && (
            <Badge variant="success" className="mt-1">
              Σκορ: {totalRounded}%
            </Badge>
          )}
        </div>
        <div className="size-12" />
      </header>

      <div className="shrink-0 space-y-1.5">
        <div className="flex justify-between text-sm font-bold text-emerald-800">
          <span>Πρόοδος</span>
          <span>
            {doneCount}/{totalGames}
          </span>
        </div>
        <Progress value={progressPct} />
      </div>

      <div
        className="grid min-h-0 flex-1 grid-cols-1 gap-3"
        style={{ gridTemplateRows: 'repeat(3, minmax(0, 1fr))' }}
      >
        {MENU_GAMES.map((game, i) => {
          const done = completedGames.includes(game.id);
          const pct = gameScores[game.id]
            ? Math.round((gameScores[game.id] / GAME_WEIGHT) * 100)
            : 0;

          return (
            <motion.button
              key={game.id}
              type="button"
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="show"
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => onSelectGame(game.id)}
              className="flex h-full min-h-0 w-full text-left"
            >
              <Card
                className={cn(
                  'flex h-full w-full flex-col overflow-hidden border-4 transition-shadow',
                  done
                    ? 'border-emerald-300 bg-gradient-to-br from-white to-emerald-50 shadow-emerald-200/50'
                    : 'border-white bg-gradient-to-br from-white to-sky-50 shadow-xl hover:shadow-2xl'
                )}
                style={{ boxShadow: `0 8px 0 ${done ? '#86efac' : '#7dd3fc'}40` }}
              >
                <CardContent className="flex h-full min-h-0 flex-col gap-2 p-3">
                  <div className="flex min-h-0 flex-1 items-center justify-center">
                    <div className="aspect-square h-full max-h-full w-full max-w-full overflow-hidden rounded-2xl border-2 border-white shadow-md">
                      <Illustration
                        name={game.illustration}
                        animate={false}
                        className="!aspect-square h-full w-full"
                      />
                    </div>
                  </div>
                  <div className="shrink-0 text-center">
                    <h3 className="font-display text-lg font-extrabold leading-tight text-emerald-900 md:text-xl">
                      {game.title}
                    </h3>
                    <p className="mt-0.5 line-clamp-2 text-xs font-bold text-emerald-700/80 md:text-sm">
                      {game.subtitle}
                    </p>
                    {done && (
                      <span className="mt-1 inline-flex items-center gap-1 text-xs font-extrabold text-emerald-600 md:text-sm">
                        <CheckCircle2 className="size-4 shrink-0" />
                        Ολοκληρώθηκε · {pct}%
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.button>
          );
        })}
      </div>

      <p className="shrink-0 flex items-center justify-center gap-2 py-1 text-center text-xs font-bold text-emerald-800/80 md:text-sm">
        <Sparkles className="size-4 text-amber-500" />
        {doneCount < totalGames
          ? `Απομένουν ${totalGames - doneCount} παιχνίδια για το μεγάλο βραβείο!`
          : 'Όλα έτοιμα — δες το τελικό αποτέλεσμα!'}
      </p>
    </PageShell>
  );
}
