import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { IMAGE_MAP } from './imageMap';

const imageModules = import.meta.glob(
  ['./*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}'],
  { query: '?url', import: 'default', eager: true }
);

const URL_BY_FILE = Object.fromEntries(
  Object.entries(imageModules).map(([path, url]) => {
    const file = path.replace('./', '');
    return [file, url];
  })
);

export function getGameImageUrl(name) {
  const file = IMAGE_MAP[name];
  if (!file) return null;
  return URL_BY_FILE[file] ?? null;
}

export default function GameImage({
  name,
  alt = '',
  className,
  animate = false,
  fit = 'cover',
}) {
  const src = getGameImageUrl(name);
  const frameClass = cn('game-image-frame relative w-full overflow-hidden', className);
  const imgClass = cn(
    'h-full w-full',
    fit === 'contain' ? 'object-contain object-center' : 'object-cover object-center'
  );

  if (!src) {
    if (import.meta.env.DEV) {
      console.warn(`[GameImage] Missing: ${name} → ${IMAGE_MAP[name] ?? 'unknown key'}`);
    }
    return (
      <div
        className={cn(
          frameClass,
          'flex min-h-[120px] items-center justify-center bg-emerald-100/60 p-3 text-center'
        )}
      >
        <span className="text-xs font-bold text-emerald-800/70">
          {IMAGE_MAP[name] ?? name}
        </span>
      </div>
    );
  }

  if (!animate) {
    return (
      <div className={frameClass}>
        <img
          src={src}
          alt={alt}
          className={imgClass}
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
        alt={alt}
        className={imgClass}
        loading="lazy"
        decoding="async"
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      />
    </div>
  );
}
