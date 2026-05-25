import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/50 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-b from-emerald-400 to-emerald-600 text-white shadow-[0_6px_0_#15803d] hover:brightness-105 active:shadow-[0_2px_0_#15803d] active:translate-y-1',
        secondary:
          'bg-white text-sky-700 border-4 border-sky-200 shadow-lg hover:bg-sky-50',
        sky: 'bg-gradient-to-b from-sky-400 to-sky-600 text-white shadow-[0_6px_0_#0369a1] active:shadow-[0_2px_0_#0369a1] active:translate-y-1',
        sun: 'bg-gradient-to-b from-amber-300 to-amber-500 text-amber-950 shadow-[0_6px_0_#ca8a04] active:shadow-[0_2px_0_#ca8a04] active:translate-y-1',
        good: 'bg-gradient-to-b from-emerald-400 to-green-500 text-white shadow-[0_5px_0_#15803d] active:translate-y-1',
        bad: 'bg-gradient-to-b from-rose-400 to-red-500 text-white shadow-[0_5px_0_#be123c] active:translate-y-1',
        ghost: 'bg-white/70 text-emerald-800 shadow-md hover:bg-white',
        icon: 'bg-white/90 text-emerald-700 shadow-lg rounded-full size-12 p-0 hover:bg-white',
      },
      size: {
        default: 'h-14 px-8 text-lg rounded-3xl',
        sm: 'h-11 px-5 text-base rounded-2xl',
        lg: 'h-16 px-10 text-xl rounded-3xl',
        xl: 'h-[4.25rem] w-full max-w-md text-2xl rounded-3xl',
        icon: 'size-12 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  );
});
Button.displayName = 'Button';

export { Button, buttonVariants };
