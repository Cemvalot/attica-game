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
  mini = false,
  fillCell = false,
  showLabel = true,
  className,
}) {
  const sdg = getSdg(sdgId);
  if (!sdg) return null;

  const Comp = readonly ? motion.div : motion.button;

  return (
    <div ref={refCallback} className="h-full w-full">
    <Comp
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
        'relative flex h-full w-full flex-col items-center rounded-2xl border-4 text-center shadow-lg transition-colors',
        fillCell
          ? 'flex h-full min-h-0 flex-col items-center gap-0 border-[3px] p-1.5'
          : mini
            ? 'min-h-0 gap-0 border-2 p-1 rounded-xl'
            : compact
              ? 'min-h-[100px] gap-1 p-1.5'
              : 'gap-2 p-2',
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
          'overflow-hidden rounded-xl',
          fillCell
            ? 'flex min-h-0 w-full flex-1 items-center justify-center'
            : 'aspect-square w-full',
          mini ? 'max-w-none rounded-lg' : compact ? 'max-w-none' : 'max-w-[88px]'
        )}
      >
        <SdgIcon sdgId={sdgId} alt={sdg.title} className={fillCell ? 'max-h-full max-w-full' : undefined} />
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
        <span
          className={cn(
            'absolute flex items-center justify-center rounded-full bg-sky-500 text-white shadow-md',
            mini ? '-right-0.5 -top-0.5 size-4' : '-right-1 -top-1 size-6'
          )}
        >
          <Check className={cn(mini ? 'size-2.5' : 'size-3.5')} strokeWidth={3} />
        </span>
      )}
    </Comp>
    </div>
  );
}
