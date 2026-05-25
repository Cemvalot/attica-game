import { cn } from '@/lib/utils';
import { getSdgIconUrl } from './sdgAssets';

export default function SdgIcon({ sdgId, className, alt }) {
  const src = getSdgIconUrl(sdgId);

  if (!src) {
    if (import.meta.env.DEV) {
      console.warn(`[SdgIcon] Missing SDG asset: ${sdgId}`);
    }
    return null;
  }

  return (
    <img
      src={src}
      alt={alt ?? `SDG ${sdgId}`}
      className={cn('h-full w-full object-contain object-center', className)}
      loading="lazy"
      decoding="async"
    />
  );
}
