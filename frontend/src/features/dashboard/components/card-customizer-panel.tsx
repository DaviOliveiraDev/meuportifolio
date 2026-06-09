'use client';

import { useProfile } from '@/features/profile/hooks/use-profile';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lock, Palette, CheckCircle2, Pin } from 'lucide-react';
import { toast } from 'sonner';

interface CardCustomizerPanelProps {
  profile?: any;
  className?: string;
}

export function CardCustomizerPanel({ profile, className }: CardCustomizerPanelProps) {
  const { updateProfile, isUpdating } = useProfile();
  
  const level = profile?.level || 1;
  const badges = profile?.badges || [];
  
  // Custom styles default state
  const [borderTheme, setBorderTheme] = useState<'default' | 'neon' | 'holographic' | 'cosmic'>('default');
  const [foilEffect, setFoilEffect] = useState<'none' | 'chrome' | 'gold' | 'diamond'>('none');
  const [pinnedBadges, setPinnedBadges] = useState<string[]>([]);

  useEffect(() => {
    if (profile?.custom_styles) {
      const styles = profile.custom_styles;
      if (styles.border_theme) setBorderTheme(styles.border_theme);
      if (styles.foil_effect) setFoilEffect(styles.foil_effect);
      if (styles.pinned_badges) setPinnedBadges(styles.pinned_badges);
    }
  }, [profile]);

  const handleUpdateStyle = async (newStyles: any) => {
    try {
      const updatedStyles = {
        border_theme: borderTheme,
        foil_effect: foilEffect,
        pinned_badges: pinnedBadges,
        ...newStyles
      };
      
      await updateProfile({
        name: profile?.name,
        username: profile?.username,
        theme_name: profile?.theme_name || 'minimalist',
        custom_styles: updatedStyles
      });
      toast.success('Estilo do card atualizado!');
    } catch (err) {
      toast.error('Erro ao salvar customização do card.');
    }
  };

  const handleToggleBadgePin = (badgeId: string) => {
    let newPinned = [...pinnedBadges];
    if (newPinned.includes(badgeId)) {
      newPinned = newPinned.filter(id => id !== badgeId);
    } else {
      if (newPinned.length >= 3) {
        toast.warning('Você pode fixar no máximo 3 medalhas no card.');
        return;
      }
      newPinned.push(badgeId);
    }
    setPinnedBadges(newPinned);
    handleUpdateStyle({ pinned_badges: newPinned });
  };

  // Temas de borda e seus requisitos de nível
  const borderThemes = [
    { id: 'default', name: 'Original', desc: 'Cor do OVR Tier', minLevel: 1, colors: 'from-neutral-700 to-neutral-500' },
    { id: 'neon', name: 'Néon Vibrante', desc: 'Ciano e Magenta Néon', minLevel: 3, colors: 'from-cyan-400 via-pink-500 to-violet-600' },
    { id: 'holographic', name: 'Holo Prism', desc: 'Arco-íris Reflexivo', minLevel: 7, colors: 'from-[#cbd5e1] via-[#f472b6] via-[#38bdf8] via-[#fbbf24] to-[#cbd5e1]' },
    { id: 'cosmic', name: 'Lendário Cósmico', desc: 'Aura Roxa Cósmica', minLevel: 12, colors: 'from-purple-600 via-pink-600 to-rose-500' },
  ] as const;

  // Efeitos metalizados
  const foilEffects = [
    { id: 'none', name: 'Nenhum', desc: 'Sem cobertura metálica', minLevel: 1, style: 'bg-neutral-800' },
    { id: 'chrome', name: 'Prata Cromada', desc: 'Efeito metal escovado', minLevel: 5, style: 'bg-gradient-to-r from-slate-200 to-slate-400 text-slate-900' },
    { id: 'gold', name: 'Ouro Âmbar', desc: 'Brilho luxuoso em ouro', minLevel: 10, style: 'bg-gradient-to-r from-amber-300 to-amber-500 text-amber-950' },
    { id: 'diamond', name: 'Diamante Glacial', desc: 'Prisma ciano cristalino', minLevel: 15, style: 'bg-gradient-to-r from-cyan-200 to-indigo-400 text-cyan-950' },
  ] as const;

  return (
    <div className={`p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 shadow-sm ${className}`}>
      <h3 className="font-extrabold text-neutral-850 dark:text-neutral-200 text-xs flex items-center gap-1.5 mb-4 uppercase tracking-wider">
        <Palette className="w-4.5 h-4.5 text-violet-500" />
        Estilo & Prestígio do Card
      </h3>

      <div className="space-y-4">
        {/* Temas da Borda */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold font-mono text-neutral-450 uppercase tracking-wider block">Tema da Borda</span>
          <div className="grid grid-cols-2 gap-2">
            {borderThemes.map((t) => {
              const isLocked = level < t.minLevel;
              const isSelected = borderTheme === t.id;
              
              return (
                <button
                  key={t.id}
                  disabled={isLocked && borderTheme !== t.id}
                  onClick={() => {
                    setBorderTheme(t.id);
                    handleUpdateStyle({ border_theme: t.id });
                  }}
                  className={`p-2.5 rounded-xl border text-left flex flex-col justify-between h-20 transition-all relative ${
                    isLocked 
                      ? 'bg-neutral-50 dark:bg-neutral-950/20 border-neutral-200 dark:border-neutral-850/40 opacity-40 cursor-not-allowed'
                      : isSelected
                        ? 'bg-violet-500/5 dark:bg-violet-500/10 border-violet-500 text-neutral-900 dark:text-white cursor-pointer shadow-[0_0_12px_rgba(99,102,241,0.1)]'
                        : 'bg-neutral-50/50 hover:bg-neutral-50 dark:bg-neutral-950/20 dark:hover:bg-neutral-950/40 border-neutral-200 dark:border-neutral-850 cursor-pointer text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    {/* Visual dot representation of the gradient */}
                    <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${t.colors} border border-white/10`} />
                    {isLocked ? (
                      <Lock className="w-3 h-3 text-neutral-400" />
                    ) : (
                      isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-violet-500" />
                    )}
                  </div>
                  <div className="mt-1">
                    <p className="text-[11px] font-extrabold truncate leading-tight">{t.name}</p>
                    <p className="text-[9px] text-neutral-450 leading-none mt-0.5">
                      {isLocked ? `Lvl ${t.minLevel}` : t.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Efeitos Metalizados */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold font-mono text-neutral-450 uppercase tracking-wider block">Efeito Metalizado (Foil)</span>
          <div className="grid grid-cols-2 gap-2">
            {foilEffects.map((f) => {
              const isLocked = level < f.minLevel;
              const isSelected = foilEffect === f.id;
              
              return (
                <button
                  key={f.id}
                  disabled={isLocked && foilEffect !== f.id}
                  onClick={() => {
                    setFoilEffect(f.id);
                    handleUpdateStyle({ foil_effect: f.id });
                  }}
                  className={`p-2.5 rounded-xl border text-left flex flex-col justify-between h-20 transition-all relative ${
                    isLocked 
                      ? 'bg-neutral-50 dark:bg-neutral-950/20 border-neutral-200 dark:border-neutral-850/40 opacity-40 cursor-not-allowed'
                      : isSelected
                        ? 'bg-violet-500/5 dark:bg-violet-500/10 border-violet-500 text-neutral-900 dark:text-white cursor-pointer shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                        : 'bg-neutral-50/50 hover:bg-neutral-50 dark:bg-neutral-950/20 dark:hover:bg-neutral-950/40 border-neutral-200 dark:border-neutral-850 cursor-pointer text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    {/* Visual represent */}
                    <div className={`w-6 h-3.5 rounded border border-white/5 ${f.style}`} />
                    {isLocked ? (
                      <Lock className="w-3 h-3 text-neutral-400" />
                    ) : (
                      isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-violet-500" />
                    )}
                  </div>
                  <div className="mt-1">
                    <p className="text-[11px] font-extrabold truncate leading-tight">{f.name}</p>
                    <p className="text-[9px] text-neutral-450 leading-none mt-0.5">
                      {isLocked ? `Lvl ${f.minLevel}` : f.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Fixar Medalhas na Frente */}
        <div className="space-y-2 border-t border-neutral-100 dark:border-neutral-850 pt-3">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] font-bold font-mono text-neutral-450 uppercase tracking-wider flex items-center gap-1">
              <Pin className="w-3 h-3 text-violet-400" /> Fixar na Frente ({pinnedBadges.length}/3)
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {badges.map((badge: any) => {
              const isPinned = pinnedBadges.includes(badge.id);
              return (
                <button
                  key={badge.id}
                  onClick={() => handleToggleBadgePin(badge.id)}
                  className={`py-1.5 px-3 rounded-full text-xs font-semibold cursor-pointer border transition-all flex items-center gap-1.5 ${
                    isPinned
                      ? 'bg-violet-600 border-violet-500 text-white shadow-sm shadow-violet-500/15'
                      : 'bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-950/20 dark:hover:bg-neutral-950/40 border-neutral-200 dark:border-neutral-850 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <span className="text-[10px]">🏆</span>
                  {badge.name}
                </button>
              );
            })}
            
            {badges.length === 0 && (
              <p className="text-[11px] text-neutral-500 italic mt-0.5 leading-tight">
                Desbloqueie conquistas para fixá-las no seu Developer Card!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
