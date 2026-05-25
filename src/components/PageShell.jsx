import { motion, AnimatePresence } from 'framer-motion';
import AnimatedBackground from './AnimatedBackground';
import { cn } from '@/lib/utils';

const pageVariants = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -16, scale: 0.98 },
};

export default function PageShell({ children, className, screenKey }) {
  return (
    <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden">
      <AnimatedBackground />
      <AnimatePresence mode="wait">
        <motion.main
          key={screenKey}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className={cn(
            'relative z-10 flex h-full min-h-0 w-full flex-col gap-4 overflow-y-auto px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]',
            className
          )}
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}

export function MotionTap({ children, className, disabled, onClick, ...props }) {
  return (
    <motion.div
      whileTap={disabled ? undefined : { scale: 0.96 }}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      className={className}
      onClick={disabled ? undefined : onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function ShakeWrap({ shake, children, className }) {
  return (
    <motion.div
      animate={shake ? { x: [0, -10, 10, -8, 8, 0] } : { x: 0 }}
      transition={{ duration: 0.45 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function GlowWrap({ glow, children, className }) {
  return (
    <motion.div
      animate={
        glow
          ? { boxShadow: ['0 0 0 0 rgba(34,197,94,0)', '0 0 0 12px rgba(34,197,94,0.35)', '0 0 0 0 rgba(34,197,94,0)'] }
          : {}
      }
      transition={{ duration: 0.6 }}
      className={cn('rounded-3xl', className)}
    >
      {children}
    </motion.div>
  );
}
