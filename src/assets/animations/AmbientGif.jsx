import { cn } from '@/lib/utils';
import { AMBIENT_ANIMATIONS } from './animationMap';

const gifModules = import.meta.glob('./*.gif', {
  query: '?url',
  import: 'default',
  eager: true,
});

const URL_BY_FILE = Object.fromEntries(
  Object.entries(gifModules).map(([path, url]) => [path.replace('./', ''), url])
);

export function getAnimationUrl(name) {
  const file = AMBIENT_ANIMATIONS[name];
  if (!file) return null;
  return URL_BY_FILE[file] ?? null;
}

export default function AmbientGif({ name, className, style }) {
  const src = getAnimationUrl(name);
  if (!src) return null;

  return (
    <img
      src={src}
      alt=""
      role="presentation"
      aria-hidden="true"
      className={cn('pointer-events-none object-contain object-center', className)}
      style={style}
      loading="lazy"
      decoding="async"
    />
  );
}
