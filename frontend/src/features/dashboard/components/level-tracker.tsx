'use client';

import { motion } from 'framer-motion';
import { Sparkles, Trophy } from 'lucide-react';
import { calculateLevelProgress } from '@/features/gamification/lib/calculate-level';

interface LevelTrackerProps {
  level?: number;
  xp?: number;
  className?: string;
}

export function LevelTracker({ level = 1, xp = 0, className }: LevelTrackerProps) {
  const progress = calculateLevelProgress(level, xp);

  return (
    <div className={`p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 shadow-sm relative overflow-hidden ${className}`}>
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center gap-4 relative z-10">
        {/* Emblem Badge (FUT/Game inspired) */}
        <div className="relative flex-shrink-0">
          <motion.div
            initial={{ scale: 0.9, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-14 h-16 bg-gradient-to-br from-violet-600 to-indigo-600 dark:from-violet-500 dark:to-indigo-500 flex items-center justify-center shadow-lg relative"
            style={{
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            }}
          >
            <div className="flex flex-col items-center justify-center text-white text-center">
              <span className="text-[9px] font-bold uppercase tracking-wider opacity-80 leading-none">LVL</span>
              <span className="text-xl font-extrabold leading-none">{progress.currentLevel}</span>
            </div>
          </motion.div>
          {/* Subtle crown or star icon */}
          <div className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white rounded-full p-0.5 border border-white dark:border-neutral-900 shadow-md">
            <Trophy className="w-3 h-3" />
          </div>
        </div>

        {/* Level & XP Stats */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline mb-2">
            <h3 className="font-extrabold text-neutral-850 dark:text-neutral-200 text-lg flex items-center gap-1.5">
              Nível {progress.currentLevel}
              <span className="text-xs font-semibold text-neutral-450 dark:text-neutral-450">
                ({progress.totalXp} XP Total)
              </span>
            </h3>
            <span className="text-xs font-bold font-mono text-violet-600 dark:text-violet-400">
              {progress.xpInCurrentLevel} / {progress.xpForNext} XP
            </span>
          </div>

          {/* Animated Liquid Progress Bar */}
          <div className="relative w-full h-3 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden border border-neutral-200/20 dark:border-neutral-800/40">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress.percentage}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 rounded-full relative"
            >
              {/* Shimmer light effect overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)] bg-[size:200px_100%] animate-shimmer" 
                   style={{
                     animation: 'shimmer 2.5s infinite linear',
                     backgroundImage: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25) 50%, transparent 100%)',
                     backgroundSize: '200% 100%'
                   }}
              />
            </motion.div>
          </div>

          {/* Helper details */}
          <div className="flex justify-between items-center mt-2.5 text-[10px] sm:text-xs text-neutral-450 font-semibold tracking-wide uppercase">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              Faltam {progress.xpForNext - progress.xpInCurrentLevel} XP para evoluir
            </span>
            <span>Próximo: Nível {progress.nextLevel}</span>
          </div>
        </div>
      </div>

      {/* Global CSS for shimmer keyframes */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
