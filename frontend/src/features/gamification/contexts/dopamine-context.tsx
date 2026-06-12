'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy } from 'lucide-react';
import { calculateLevelProgress } from '@/features/gamification/lib/calculate-level';
import { emitGamificationEvent } from '../events';

interface DopamineContextType {
  isDimmed: boolean;
  isAnimating: boolean;
  animatingXp: number;
  animatingLevel: number;
  triggerDopamineLoop: (
    xpEarned: number,
    actionLabel: string,
    oldXp: number,
    oldLevel: number,
    newXp: number,
    newLevel: number
  ) => Promise<void>;
}

const DopamineContext = createContext<DopamineContextType | undefined>(undefined);

export function useDopamineLoop() {
  const context = useContext(DopamineContext);
  if (!context) {
    throw new Error('useDopamineLoop must be used within a DopamineProvider');
  }
  return context;
}

export function DopamineProvider({ children }: { children: React.ReactNode }) {
  const [isDimmed, setIsDimmed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatingXp, setAnimatingXp] = useState(0);
  const [animatingLevel, setAnimatingLevel] = useState(1);
  const [activeToast, setActiveToast] = useState<{ label: string; xp: number } | null>(null);
  
  const animationFrameRef = useRef<number | null>(null);

  const triggerDopamineLoop = useCallback(async (
    xpEarned: number,
    actionLabel: string,
    oldXp: number,
    oldLevel: number,
    newXp: number,
    newLevel: number
  ) => {
    // Cancela qualquer animação em andamento
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setIsDimmed(true);
    setIsAnimating(true);
    setAnimatingXp(oldXp);
    setAnimatingLevel(oldLevel);
    setActiveToast({ label: actionLabel, xp: xpEarned });

    // Tenta tocar som de recompensa
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      // Ignora erro de AudioContext bloqueado
    }

    // Tempo de espera para o toast aparecer (300ms)
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Anima o XP de forma fluida
    const startTime = performance.now();
    const duration = 1500; // 1.5 segundos

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);
      
      // Efeito de easing Out Quad
      const easeProgress = progressRatio * (2 - progressRatio);
      const currentXpVal = Math.round(oldXp + (newXp - oldXp) * easeProgress);

      setAnimatingXp(currentXpVal);

      // Calcula o nível corrente durante a animação
      const currentProgress = calculateLevelProgress(oldLevel, currentXpVal);
      if (currentProgress.currentLevel !== animatingLevel) {
        setAnimatingLevel(currentProgress.currentLevel);
      }

      if (progressRatio < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setAnimatingXp(newXp);
        setAnimatingLevel(newLevel);
        setIsAnimating(false);
        
        // Se subiu de nível, dispara o Level Up modal com confetti
        if (newLevel > oldLevel) {
          emitGamificationEvent('level_up', {
            newLevel,
            oldLevel,
            profileName: ''
          });
        }

        // Esconde o toast e remove o escurecimento após 2 segundos
        setTimeout(() => {
          setActiveToast(null);
          setIsDimmed(false);
        }, 2000);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [animatingLevel]);

  return (
    <DopamineContext.Provider
      value={{
        isDimmed,
        isAnimating,
        animatingXp,
        animatingLevel,
        triggerDopamineLoop,
      }}
    >
      <div className="relative min-h-screen">
        {/* Backdrop escurecedor (Dopamine Focus) */}
        <AnimatePresence>
          {isDimmed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-45 pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Toast customizado do Dopamine Loop */}
        <AnimatePresence>
          {activeToast && (
            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center gap-2 w-full max-w-sm px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="bg-neutral-900/90 dark:bg-neutral-950/95 border border-violet-500/30 rounded-2xl p-5 shadow-[0_0_35px_rgba(139,92,246,0.35)] text-center backdrop-blur-md relative overflow-hidden flex flex-col items-center gap-1.5"
              >
                {/* Glowing Aura */}
                <div className="absolute -inset-10 bg-violet-600/15 rounded-full blur-2xl animate-pulse pointer-events-none" />

                {/* Sparkling Icons */}
                <div className="relative mb-1">
                  <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center border border-violet-500/20 text-violet-400">
                    <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
                  </div>
                  <Sparkles className="w-4 h-4 text-cyan-400 absolute -top-1 -right-1 animate-pulse" />
                </div>

                <h4 className="font-black text-white text-base tracking-tight drop-shadow-md">
                  {activeToast.label}
                </h4>
                
                <span className="text-sm font-mono font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 drop-shadow-md animate-pulse">
                  +{activeToast.xp} XP OBTIDOS!
                </span>

                {/* Flying Sparks (Visual Juice Particles) */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                      animate={{ 
                        opacity: 0, 
                        scale: [0, 1, 0.5], 
                        x: (i % 2 === 0 ? 1 : -1) * (15 + Math.random() * 40), 
                        y: -30 - Math.random() * 45 
                      }}
                      transition={{ duration: 1.2, ease: 'easeOut', repeat: Infinity, repeatDelay: 0.3 }}
                      className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full bg-amber-400"
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {children}
      </div>
    </DopamineContext.Provider>
  );
}
