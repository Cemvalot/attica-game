import { motion } from 'framer-motion';
import { Hourglass } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HourglassIntro({ className }) {
  return (
    <motion.div
      className={cn('relative flex size-36 items-center justify-center', className)}
      animate={{ x: [-12, 12, -12] }}
      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
    >
      <motion.span
        className="pointer-events-none absolute inset-0 -m-6 rounded-full bg-gradient-to-b from-amber-200/70 to-sky-300/70 blur-2xl"
        animate={{
          opacity: [0.4, 1, 0.4],
          scale: [0.85, 1.2, 0.85],
        }}
        transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        aria-hidden
      />
      <motion.span
        className="pointer-events-none absolute inset-2 rounded-full bg-amber-100/50 blur-md"
        animate={{ opacity: [0.25, 0.75, 0.25] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut', delay: 0.2 }}
        aria-hidden
      />
      <Hourglass
        className="relative size-28 text-amber-600 drop-shadow-[0_0_12px_rgba(251,191,36,0.65)]"
        strokeWidth={2.25}
        aria-hidden
      />
    </motion.div>
  );
}
