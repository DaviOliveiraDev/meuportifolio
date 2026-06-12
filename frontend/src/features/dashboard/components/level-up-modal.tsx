'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, X, ChevronRight } from 'lucide-react';
import { useGamificationListener } from '@/features/gamification/events';
import confetti from 'canvas-confetti';

export function LevelUpModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [levelData, setLevelData] = useState<{ newLevel: number; oldLevel: number; name: string } | null>(null);

  // Escuta globalmente o evento de level_up
  useGamificationListener('level_up', (detail) => {
    setLevelData({
      newLevel: detail.newLevel,
      oldLevel: detail.oldLevel,
      name: detail.profileName,
    });
    setIsOpen(true);
    
    // Tenta reproduzir um efeito sonoro de conquista suave se suportado
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.1, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        osc.start(start);
        osc.stop(start + duration);
      };
      
      const now = audioCtx.currentTime;
      playTone(523.25, now, 0.15); // C5
      playTone(659.25, now + 0.1, 0.15); // E5
      playTone(783.99, now + 0.2, 0.3); // G5
    } catch (e) {
      // Ignora erro se AudioContext for bloqueado pelo navegador
    }
  });

  useEffect(() => {
    if (isOpen) {
      const duration = 2.5 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 }
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 }
        });
        confetti({
          particleCount: 3,
          angle: 90,
          spread: 100,
          origin: { x: 0.5, y: 0.8 }
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!levelData) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="w-full max-w-md bg-neutral-900 border border-violet-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(139,92,246,0.3)] text-white text-center relative overflow-hidden z-10"
          >
            {/* Flying CSS particles (Confetti simulation) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(12)].map((_, idx) => {
                const colors = ['bg-violet-500', 'bg-indigo-400', 'bg-cyan-400', 'bg-amber-400', 'bg-rose-500'];
                const randColor = colors[idx % colors.length];
                const delay = (idx * 0.15).toFixed(2);
                const left = (10 + (idx * 8)).toFixed(0);
                return (
                  <div
                    key={idx}
                    className={`absolute w-2.5 h-2.5 rounded-sm rotate-45 opacity-0 ${randColor}`}
                    style={{
                      left: `${left}%`,
                      top: '-10px',
                      animation: `confettiDrop 2.5s infinite linear`,
                      animationDelay: `${delay}s`,
                    }}
                  />
                );
              })}
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-450 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Trophy */}
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="absolute inset-0 bg-violet-600/30 rounded-full blur-2xl animate-pulse" />
              <motion.div
                initial={{ rotate: -15, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center text-white border-2 border-violet-500/20 shadow-lg relative z-10"
              >
                <Trophy className="w-9 h-9 text-amber-300 animate-bounce" style={{ animationDuration: '3s' }} />
              </motion.div>
              <div className="absolute -top-1.5 -right-1.5 bg-amber-500 rounded-full p-1 text-white shadow-md z-20">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <span className="text-xs font-black tracking-widest text-violet-400 uppercase">
                Subida de Nível!
              </span>
              <h2 className="text-3xl font-black bg-gradient-to-b from-white to-neutral-300 bg-clip-text text-transparent tracking-tight">
                LEVEL UP!
              </h2>
              <p className="text-sm text-neutral-400 font-medium max-w-xs mx-auto">
                Parabéns, {levelData.name}! Suas contribuições elevaram o prestígio técnico do seu perfil.
              </p>
            </div>

            {/* Level Comparison Badge */}
            <div className="my-8 flex justify-center items-center gap-6">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Anterior</span>
                <div className="w-14 h-14 rounded-2xl bg-neutral-800 border border-neutral-750 flex items-center justify-center text-lg font-bold text-neutral-400 mt-1.5">
                  Lvl {levelData.oldLevel}
                </div>
              </div>

              <ChevronRight className="w-6 h-6 text-violet-500 mt-5 animate-pulse" />

              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Novo Nível</span>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 border border-violet-500/30 flex items-center justify-center text-2xl font-black text-white mt-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                  Lvl {levelData.newLevel}
                </div>
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={handleClose}
              className="w-full bg-violet-650 hover:bg-violet-600 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md shadow-violet-950/20 hover:scale-[1.02] cursor-pointer"
            >
              Continuar Jogando
            </button>
          </motion.div>
        </div>
      )}

      {/* Confetti Keyframes */}
      <style jsx global>{`
        @keyframes confettiDrop {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateY(450px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </AnimatePresence>
  );
}
