'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  progress: number;
  isLoaded: boolean;
}

export default function Preloader({ progress, isLoaded }: PreloaderProps) {
  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center"
        >
          {/* Animated W lettermark */}
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="font-[var(--font-cinzel-decorative)] text-white text-7xl font-bold tracking-[0.3em]"
            style={{ fontFamily: 'var(--font-cinzel-decorative)' }}
          >
            W
          </motion.div>

          {/* Loading text */}
          <p
            className="mt-6 text-white/50 text-[13px] tracking-[0.4em] uppercase"
            style={{ fontFamily: 'var(--font-cinzel)' }}
          >
            Loading the story...
          </p>

          {/* Progress bar */}
          <div className="mt-8 w-48 h-[1px] bg-white/10 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-white"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>

          {/* Progress percentage */}
          <p
            className="mt-3 text-white/30 text-[11px] tracking-[0.3em]"
            style={{ fontFamily: 'var(--font-cinzel)' }}
          >
            {progress}%
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
