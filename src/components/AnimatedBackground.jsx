import { motion } from 'framer-motion';
import AmbientGif from '../assets/animations/AmbientGif';

/** Smaller GIFs only — keeps ambient motion light on tablet */
const FLOATERS = [
  { name: 'forest', left: '6%', top: '14%', size: 68, delay: 0, duration: 14 },
  { name: 'save-earth', left: '78%', top: '20%', size: 64, delay: 1, duration: 13 },
  { name: 'forest', left: '4%', top: '72%', size: 60, delay: 2, duration: 16 },
];

const particles = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  left: `${8 + i * 9}%`,
  top: `${12 + (i % 4) * 20}%`,
  delay: i * 0.3,
}));

export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 game-gradient-bg" />

      <motion.div
        className="absolute -left-20 top-24 size-64 rounded-full bg-emerald-300/40 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-16 bottom-32 size-72 rounded-full bg-sky-300/45 blur-3xl"
        animate={{ x: [0, -25, 0], y: [0, 15, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-1/3 top-8 size-48 rounded-full bg-amber-200/50 blur-2xl"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute size-2 rounded-full bg-emerald-400/40"
          style={{ left: p.left, top: p.top }}
          animate={{ y: [0, -14, 0], opacity: [0.25, 0.6, 0.25] }}
          transition={{ duration: 4 + (p.id % 3), repeat: Infinity, delay: p.delay }}
        />
      ))}

      {FLOATERS.map((f) => (
        <motion.div
          key={f.name}
          className="absolute opacity-[0.35]"
          style={{ left: f.left, top: f.top, width: f.size, height: f.size }}
          animate={{ y: [0, -10, 0], x: [0, 6, 0] }}
          transition={{
            duration: f.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: f.delay,
          }}
        >
          <AmbientGif name={f.name} className="h-full w-full" />
        </motion.div>
      ))}
    </div>
  );
}
