import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border-2 px-3 py-1 text-sm font-extrabold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-amber-200 bg-amber-100 text-amber-900',
        success: 'border-emerald-200 bg-emerald-100 text-emerald-800',
        sky: 'border-sky-200 bg-sky-100 text-sky-800',
        hero: 'border-amber-300 bg-gradient-to-r from-amber-200 to-yellow-200 text-amber-950',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
