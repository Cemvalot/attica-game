import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { IMAGE_MAP } from './imageMap';

const imageLoaders = import.meta.glob(
  ['./*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}'],
  { query: '?url', import: 'default' }
);

const urlCache = new Map();

async function resolveImageUrl(file) {
  if (urlCache.has(file)) return urlCache.get(file);
  const loader = imageLoaders[`./${file}`];
  if (!loader) return null;
  const url = await loader();
  urlCache.set(file, url);
  return url;
}

export function getGameImageUrl(name) {
  const file = IMAGE_MAP[name];
  if (!file) return null;
  return urlCache.get(file) ?? null;
}

export function preloadGameImage(name) {
  const file = IMAGE_MAP[name];
  if (!file || urlCache.has(file)) return Promise.resolve(getGameImageUrl(name));
  return resolveImageUrl(file);
}

export default function GameImage({
  name,
  alt = '',
  className,
  animate = false,
  fit = 'cover',
  onLoad,
}) {
  const [src, setSrc] = useState(() => getGameImageUrl(name));

  useEffect(() => {
    let cancelled = false;
    const file = IMAGE_MAP[name];
    if (!file) {
      setSrc(null);
      return undefined;
    }
    if (urlCache.has(file)) {
      setSrc(urlCache.get(file));
      return undefined;
    }
    resolveImageUrl(file).then((url) => {
      if (!cancelled) setSrc(url);
    });
    return () => {
      cancelled = true;
    };
  }, [name]);

  const frameClass = cn('game-image-frame relative w-full overflow-hidden', className);
  const imgClass = cn(
    'h-full w-full',
    fit === 'contain' ? 'object-contain object-center' : 'object-cover object-center'
  );

  if (!src) {
    return (
      <div
        className={cn(
          frameClass,
          'flex min-h-[120px] animate-pulse items-center justify-center bg-emerald-100/60 p-3 text-center'
        )}
      >
        <span className="text-xs font-bold text-emerald-800/50">
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
          onLoad={onLoad}
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
