import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ILLUSTRATION_MAP } from './illustrationMap';

const illustrationModules = import.meta.glob(
  ['./*.svg', './*.png'],
  { query: '?url', import: 'default', eager: true }
);

const URL_BY_FILE = Object.fromEntries(
  Object.entries(illustrationModules).map(([path, url]) => {
    const file = path.replace('./', '');
    return [file, url];
  })
);

export function getIllustrationUrl(name) {
  const file = ILLUSTRATION_MAP[name];
  if (!file) return null;
  return URL_BY_FILE[file] ?? null;
}

export default function Illustration({ name, className, animate = true }) {
  const src = getIllustrationUrl(name);

  if (!src) {
    if (import.meta.env.DEV) {
      console.warn(`[Illustration] Missing asset: ${name}`);
    }
    return (
      <div
        className={cn(
          'flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-emerald-100/50 text-sm font-bold text-emerald-700',
          className
        )}
      >
        —
      </div>
    );
  }

  const frameClass = cn('illustration-frame aspect-[4/3] w-full overflow-hidden', className);

  if (!animate) {
    return (
      <div className={frameClass}>
        <img
          src={src}
          alt=""
          role="presentation"
          className="h-full w-full object-contain object-center"
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div className={frameClass}>
      <motion.img
        src={src}
        alt=""
        role="presentation"
        className="h-full w-full object-contain object-center"
        loading="lazy"
        decoding="async"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      />
    </div>
  );
}
