import { motion } from 'framer-motion';
import { Progress } from './ui/progress';

export default function ProgressBar({ current, total, label }) {
  const pct = total > 0 ? Math.min(100, (current / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="shrink-0 space-y-1.5"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={label || 'Πρόοδος'}
    >
      <div className="flex justify-between text-sm font-extrabold text-emerald-800">
        <span>{label || 'Πρόοδος'}</span>
        {total > 0 && (
          <span>
            {current}/{total}
          </span>
        )}
      </div>
      <Progress value={pct} />
    </motion.div>
  );
}
