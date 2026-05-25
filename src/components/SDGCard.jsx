import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { getSdg } from '../data/sdgs';
import SdgIcon from '../assets/sdgs/SdgIcon';
import { cn } from '@/lib/utils';

export default function SDGCard({
  sdgId,
  selected = false,
  onClick,
  readonly = false,
  status = null,
  refCallback,
  compact = false,
  showLabel = true,
  className,
}) {
  const sdg = getSdg(sdgId);
  if (!sdg) return null;

  const Comp = readonly ? motion.div : motion.button;

  return (
    <Comp
      ref={refCallback}
      type={readonly ? undefined : 'button'}
      onClick={readonly ? undefined : onClick}
      disabled={status != null && !readonly}
      whileTap={readonly || status ? undefined : { scale: 0.95 }}
      whileHover={readonly || status ? undefined : { scale: 1.03, y: -2 }}
      animate={
        status === 'wrong'
          ? { x: [0, -8, 8, -6, 6, 0] }
          : status === 'correct'
            ? { scale: [1, 1.04, 1] }
            : {}
      }
      className={cn(
        'relative flex w-full flex-col items-center rounded-2xl border-4 text-center shadow-lg transition-colors',
        compact ? 'min-h-[100px] gap-1 p-1.5' : 'gap-2 p-2',
        selected && 'ring-4 ring-sky-300 ring-offset-2',
        status === 'correct' && 'border-emerald-400 bg-emerald-50 shadow-emerald-200',
        status === 'wrong' && 'border-rose-400 bg-rose-50',
        !status && 'border-white bg-white/95',
        readonly && 'pointer-events-none',
        className
      )}
    >
      <div
        className={cn(
          'aspect-square w-full overflow-hidden rounded-xl',
          compact ? 'max-w-none' : 'max-w-[88px]'
        )}
      >
        <SdgIcon sdgId={sdgId} alt={sdg.title} />
      </div>
      {showLabel && (
        <span
          className={cn(
            'font-bold leading-tight text-emerald-900 line-clamp-2',
            compact ? 'text-[9px] md:text-[10px]' : 'text-[10px]'
          )}
        >
          {sdg.title}
        </span>
      )}
      {selected && !readonly && (
        <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-sky-500 text-white shadow-md">
          <Check className="size-3.5" strokeWidth={3} />
        </span>
      )}
    </Comp>
  );
}
