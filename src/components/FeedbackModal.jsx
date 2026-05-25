import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, Sparkles, XCircle } from 'lucide-react';
import { APP_COPY } from '../data/games';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export default function FeedbackModal({
  open,
  correct,
  message,
  onContinue,
  onTryAgain,
  canTryAgain = true,
  highlightIds,
}) {
  const showTryAgain = !correct && canTryAgain && onTryAgain;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-emerald-950/50 p-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ scale: 0.85, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            className={`w-full max-w-md rounded-3xl border-4 p-8 text-center shadow-2xl ${
              correct
                ? 'border-emerald-300 bg-gradient-to-b from-white to-emerald-50'
                : 'border-amber-300 bg-gradient-to-b from-white to-amber-50'
            }`}
          >
            <motion.div
              animate={correct ? { rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] } : { x: [0, -6, 6, 0] }}
              className={`mx-auto mb-4 flex size-16 items-center justify-center rounded-full ${
                correct ? 'bg-emerald-400 text-white' : 'bg-amber-400 text-amber-950'
              }`}
            >
              {correct ? <Sparkles className="size-9" /> : <XCircle className="size-9" />}
            </motion.div>
            <p
              className={`font-display text-3xl font-extrabold ${
                correct ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {correct ? APP_COPY.correct : APP_COPY.wrong}
            </p>
            <p className="mt-3 text-lg font-bold text-emerald-800">{message}</p>
            {showTryAgain && (
              <p className="mt-2 text-base font-bold text-amber-800/90">{APP_COPY.retryHint}</p>
            )}
            {highlightIds?.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {highlightIds.map((id) => (
                  <Badge key={id} variant="success">
                    SDG {id}
                  </Badge>
                ))}
              </div>
            )}
            {correct || !showTryAgain ? (
              <Button size="lg" className="mt-6 w-full" onClick={onContinue}>
                {APP_COPY.continue}
              </Button>
            ) : (
              <Button size="lg" variant="sun" className="mt-6 w-full gap-2" onClick={onTryAgain}>
                <RotateCcw className="size-5" />
                {APP_COPY.tryAgain}
              </Button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
