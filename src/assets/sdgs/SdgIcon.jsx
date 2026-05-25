import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { getSdgIconUrl, preloadSdgIcon } from './sdgAssets';

export default function SdgIcon({ sdgId, className, alt }) {
  const [src, setSrc] = useState(() => getSdgIconUrl(sdgId));

  useEffect(() => {
    let cancelled = false;
    const cached = getSdgIconUrl(sdgId);
    if (cached) {
      setSrc(cached);
      return undefined;
    }
    preloadSdgIcon(sdgId).then((url) => {
      if (!cancelled) setSrc(url);
    });
    return () => {
      cancelled = true;
    };
  }, [sdgId]);

  if (!src) {
    return (
      <div
        className={cn(
          'h-full w-full animate-pulse rounded-lg bg-emerald-100/70',
          className
        )}
        aria-hidden
      />
    );
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
