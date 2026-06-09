'use client';

import { toast } from 'sonner';
import { Sparkles, Trophy } from 'lucide-react';

/**
 * Dispara um Toast Gamificado com animação néon e exibição de progresso líquido de XP.
 * 
 * @param actionLabel Descrição da missão concluída (ex: "Biografia Adicionada")
 * @param xpEarned XP ganho (ex: 150)
 * @param currentXpInLevel XP atual no nível do usuário
 * @param xpForNext XP total necessário para passar de nível
 */
export function showXpToast(
  actionLabel: string,
  xpEarned: number,
  currentXpInLevel: number,
  xpForNext: number
) {
  const percentage = Math.min(100, Math.max(0, (currentXpInLevel / xpForNext) * 100));

  toast.custom((t) => (
    <div
      onClick={() => toast.dismiss(t)}
      className="w-full max-w-sm bg-neutral-950/90 dark:bg-neutral-950/95 backdrop-blur-md border border-violet-500/35 rounded-2xl p-4 shadow-[0_0_20px_rgba(139,92,246,0.25)] text-white cursor-pointer select-none flex flex-col gap-3 transition-all duration-300 hover:border-violet-400"
    >
      {/* Cabeçalho do Toast */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 animate-pulse">
          <Sparkles className="w-5 h-5 text-violet-400" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline gap-1.5">
            <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-violet-400">
              Quest Concluída!
            </span>
            <span className="text-xs font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
              +{xpEarned} XP
            </span>
          </div>
          <h4 className="text-xs font-extrabold text-white truncate mt-0.5">
            {actionLabel}
          </h4>
        </div>
      </div>

      {/* Mini Barra de Progresso XP no Toast */}
      <div className="space-y-1.5 pt-1 border-t border-neutral-900">
        <div className="flex justify-between text-[9px] font-bold text-neutral-500 uppercase tracking-wider">
          <span>Progresso do Nível</span>
          <span>{currentXpInLevel} / {xpForNext} XP</span>
        </div>
        <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-850">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  ));
}
