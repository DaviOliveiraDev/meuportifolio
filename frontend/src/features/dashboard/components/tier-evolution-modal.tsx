'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, CheckCircle2, Zap, ArrowRight, Sparkles, Award } from 'lucide-react';
import DeveloperCard from '@/components/developer-card';
import { getRarityTier } from '@/features/gamification/lib/calculate-tier';

interface TierEvolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentOvr: number;
  profile: any;
  projects?: any[];
  experiences?: any[];
  educations?: any[];
}

const TIERS_DATA = [
  {
    key: 'bronze',
    name: 'Bronze',
    ovrRange: '1 - 64',
    minOvr: 1,
    maxOvr: 64,
    previewOvr: 55,
    bgGradient: 'from-amber-800 via-orange-900 to-amber-950',
    borderGradient: 'from-amber-700 via-orange-850 to-amber-900',
    accentColor: 'text-orange-400',
    accentBg: 'bg-orange-950/40 border-orange-800/30',
    description: 'O início da sua jornada. O card possui uma textura rústica de cobre escuro, sem emissões de luz ou efeitos reflexivos.',
    perks: [
      'Visual de cobre rústico escovado',
      'Layout clássico com escudo do desenvolvedor',
      'Sem efeitos de iluminação externa'
    ],
  },
  {
    key: 'silver',
    name: 'Silver',
    ovrRange: '65 - 74',
    minOvr: 65,
    maxOvr: 74,
    previewOvr: 70,
    bgGradient: 'from-slate-700 via-zinc-800 to-slate-900',
    borderGradient: 'from-slate-300 via-zinc-400 to-slate-500',
    accentColor: 'text-slate-300',
    accentBg: 'bg-slate-950/40 border-slate-700/30',
    description: 'Lapidação técnica. O card ganha acabamento em aço cromado com um reflexo metálico vertical (shimmer) sutil ao passar o cursor.',
    perks: [
      'Visual de metal cromado e prata polida',
      'Efeito Shimmer metálico sutil (brilho vertical reativo)',
      'Moldura levemente iluminada'
    ],
  },
  {
    key: 'gold',
    name: 'Gold',
    ovrRange: '75 - 84',
    minOvr: 75,
    maxOvr: 84,
    previewOvr: 80,
    bgGradient: 'from-amber-900 via-yellow-950 to-amber-950',
    borderGradient: 'from-amber-400 via-yellow-500 to-amber-600',
    accentColor: 'text-amber-400',
    accentBg: 'bg-amber-950/40 border-amber-800/30',
    description: 'Prestígio profissional. O card é revestido em ouro polido e emite um brilho (glow) externo constante em tons de âmbar.',
    perks: [
      'Visual de ouro de alto prestígio',
      'Emissão de luz (glow externo constante) em tons âmbar',
      'Detalhes do escudo realçados com luz de fundo'
    ],
  },
  {
    key: 'diamond',
    name: 'Diamond',
    ovrRange: '85 - 94',
    minOvr: 85,
    maxOvr: 94,
    previewOvr: 90,
    bgGradient: 'from-cyan-950 via-indigo-950 to-purple-950',
    borderGradient: 'from-cyan-400 via-indigo-500 to-purple-600',
    accentColor: 'text-cyan-300',
    accentBg: 'bg-cyan-950/40 border-cyan-800/30',
    description: 'A elite técnica. Design de cristal prismático com refração holográfica (Rainbow Foil overlay) que segue dinamicamente a posição do cursor.',
    perks: [
      'Visual de cristal glacial translúcido',
      'Refração de luz holográfica (Rainbow Foil overlay)',
      'Glow externo expandido ciano/índigo néon'
    ],
  },
  {
    key: 'legendary',
    name: 'Legendary',
    ovrRange: '95 - 99',
    minOvr: 95,
    maxOvr: 99,
    previewOvr: 98,
    bgGradient: 'from-purple-950 via-pink-950 to-neutral-950',
    borderGradient: 'from-purple-600 via-pink-600 to-amber-500',
    accentColor: 'text-rose-400',
    accentBg: 'bg-rose-950/40 border-rose-800/30',
    description: 'A singularidade absoluta. O topo máximo do DevFolio. Moldura animada com rotação cromática (hue-rotate) de 360° em loop e aura pulsante de energia.',
    perks: [
      'Aura viva com rotação cromática infinita',
      'Efeito de pulsação suave da luz externa a cada 3s',
      'Destaques cósmicos e prestígio máximo'
    ],
  }
];

export function TierEvolutionModal({
  isOpen,
  onClose,
  currentOvr,
  profile,
  projects = [],
  experiences = [],
  educations = []
}: TierEvolutionModalProps) {
  // Identifica o Elo atual com base no OVR
  const currentTierIndex = TIERS_DATA.findIndex(
    (t) => currentOvr >= t.minOvr && currentOvr <= t.maxOvr
  );
  const activeTierIndex = currentTierIndex === -1 ? 0 : currentTierIndex;
  
  // Estado para controlar qual Elo está selecionado para visualização detalhada
  const [selectedTierIndex, setSelectedTierIndex] = useState<number>(activeTierIndex);
  
  const currentTier = TIERS_DATA[activeTierIndex];
  const selectedTier = TIERS_DATA[selectedTierIndex];
  const nextTier = activeTierIndex < TIERS_DATA.length - 1 ? TIERS_DATA[activeTierIndex + 1] : null;

  // Cálculos do Progresso de Elo (Estilo Valorant Rank Rating / RR)
  const getRankProgress = () => {
    if (!nextTier) return { percentage: 100, pointsNeeded: 0 };
    const tierRange = nextTier.minOvr - currentTier.minOvr;
    const currentProgress = currentOvr - currentTier.minOvr;
    const percentage = Math.max(0, Math.min(100, (currentProgress / tierRange) * 100));
    const pointsNeeded = nextTier.minOvr - currentOvr;
    return { percentage, pointsNeeded };
  };

  const { percentage: rankProgressPercent, pointsNeeded } = getRankProgress();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
        
        {/* Backdrop escuro com desfoque */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/85 backdrop-blur-md"
        />

        {/* Modal Principal estilo Valorant */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-white flex flex-col my-8"
        >
          {/* Luzes néon decorativas de fundo */}
          <div className={`absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br ${selectedTier.bgGradient} blur-[120px] opacity-20 pointer-events-none transition-all duration-700`} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-indigo-950 blur-[100px] opacity-15 pointer-events-none" />

          {/* Cabeçalho */}
          <div className="px-6 py-5 md:px-8 md:py-6 border-b border-neutral-800 flex justify-between items-center relative z-10 bg-neutral-900/40 backdrop-blur-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                <Award className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
                  EVOLUÇÃO DO ELO DO CARD
                </h2>
                <p className="text-xs text-neutral-400 font-medium">
                  Entenda os limiares de OVR, visualize os elos e desbloqueie efeitos cósmicos.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-750 border border-neutral-700/50 hover:border-neutral-600 transition-all text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Painel do Progresso Atual (Estilo Valorant RR) */}
          <div className="bg-neutral-950/70 border-b border-neutral-850 px-6 py-4 md:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Elo e OVR atual */}
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 rounded-2xl bg-gradient-to-br ${currentTier.bgGradient} border border-neutral-700/20 shadow-inner flex flex-col items-center justify-center`}>
                  <span className={`text-xs font-black uppercase tracking-widest leading-none ${currentTier.accentColor}`}>
                    {currentTier.name}
                  </span>
                  <span className="text-lg font-black text-white font-mono mt-0.5">{currentOvr} OVR</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Status do Jogador</span>
                  <p className="text-sm font-extrabold text-neutral-250">
                    Você está no elo <span className={`font-black ${currentTier.accentColor}`}>{currentTier.name}</span>
                  </p>
                  <p className="text-xs text-neutral-400 font-medium mt-0.5">
                    {nextTier ? (
                      <>Faltam <span className="font-extrabold text-white">{pointsNeeded} pontos</span> de OVR para alcançar o elo <span className={`font-bold ${nextTier.accentColor}`}>{nextTier.name}</span>.</>
                    ) : (
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 animate-spin" /> Você atingiu o Elo Máximo Lendário!
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Barra de Progresso do Elo */}
              {nextTier && (
                <div className="flex-1 max-w-md space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-neutral-400">
                    <span>Progresso do Elo</span>
                    <span className="font-mono text-white">{currentOvr} / {nextTier.minOvr} OVR</span>
                  </div>
                  <div className="h-2.5 w-full bg-neutral-900 border border-neutral-800 rounded-full overflow-hidden p-[2px]">
                    <div
                      className={`h-full bg-gradient-to-r ${currentTier.borderGradient} rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(99,102,241,0.2)]`}
                      style={{ width: `${rankProgressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Conteúdo Principal: Esquerda (Escada de Elo) | Direita (Visualizador e Perks) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 relative z-10 flex-1 min-h-0">
            
            {/* LADO ESQUERDO: Escada de Evolução (5 colunas) */}
            <div className="lg:col-span-5 p-6 md:p-8 border-r border-neutral-800/80 flex flex-col justify-center gap-4">
              <span className="text-[10px] font-black tracking-widest text-neutral-500 uppercase block mb-2">
                Escada de Evolução de Tiers
              </span>
              
              <div className="relative flex flex-col gap-4">
                {/* Linha vertical conectora */}
                <div className="absolute left-[23px] top-6 bottom-6 w-[3px] bg-neutral-800" />
                
                {TIERS_DATA.map((tier, idx) => {
                  const isActive = idx === activeTierIndex;
                  const isSelected = idx === selectedTierIndex;
                  const isUnlocked = idx <= activeTierIndex;
                  
                  return (
                    <button
                      key={tier.key}
                      onClick={() => setSelectedTierIndex(idx)}
                      className={`w-full flex items-center gap-4 p-3 rounded-2xl border transition-all text-left relative group cursor-pointer ${
                        isSelected
                          ? `bg-neutral-850/80 border-neutral-700 shadow-md ${tier.accentBg}`
                          : 'bg-neutral-950/20 hover:bg-neutral-850/30 border-transparent hover:border-neutral-800'
                      }`}
                    >
                      {/* Círculo indicador com ícone ou cadeado */}
                      <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center relative z-10 transition-all ${
                        isActive
                          ? `bg-neutral-900 border-2 shadow-[0_0_15px_rgba(99,102,241,0.3)] animate-pulse`
                          : isUnlocked
                            ? 'bg-neutral-900 border-neutral-700'
                            : 'bg-neutral-950 border-neutral-850 text-neutral-600'
                      }`}
                      style={{
                        borderColor: isSelected || isUnlocked ? TIERS_DATA[idx].borderGradient.split(' ')[1] : undefined
                      }}
                      >
                        {isUnlocked ? (
                          <CheckCircle2 className={`w-5 h-5 ${tier.accentColor}`} />
                        ) : (
                          <Lock className="w-4 h-4 text-neutral-600 group-hover:text-neutral-450 transition-colors" />
                        )}
                        
                        {isActive && (
                          <span className="absolute -top-1.5 -right-1 bg-violet-600 text-[8px] font-black text-white px-1 py-0.5 rounded-md uppercase tracking-wider scale-90 border border-violet-500/20">
                            ATUAL
                          </span>
                        )}
                      </div>

                      {/* Info do Elo */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className={`text-sm font-black transition-all ${
                            isSelected ? 'text-white scale-102 font-extrabold' : 'text-neutral-300'
                          }`}>
                            {tier.name}
                          </h4>
                          <span className="text-[10px] font-mono font-bold text-neutral-450">
                            OVR {tier.ovrRange}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-400 font-medium truncate mt-0.5">
                          {tier.perks[0]}
                        </p>
                      </div>

                      {/* Seta indicativa no hover/seleção */}
                      {isSelected && (
                        <motion.div
                          layoutId="activeIndicator"
                          className={`w-1.5 h-6 rounded-full bg-gradient-to-b ${tier.borderGradient} absolute right-3`}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* LADO DIREITO: Visualizador Interativo e Perks (7 colunas) */}
            <div className="lg:col-span-7 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 bg-neutral-950/20">
              
              {/* Preview da Carta (Esquerda) */}
              <div className="w-full max-w-[240px] flex-shrink-0 flex justify-center">
                <div className="scale-75 md:scale-80 origin-center filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
                  <DeveloperCard
                    profile={{
                      ...profile,
                      custom_styles: {
                        ...profile.custom_styles,
                        // Força borda original do OVR correspondente para demonstrar o visual puro do Elo
                        border_theme: 'default'
                      }
                    }}
                    projects={projects}
                    experiences={experiences}
                    educations={educations}
                    ovrOverride={selectedTier.previewOvr}
                  />
                </div>
              </div>

              {/* Informações detalhadas e perks (Direita) */}
              <div className="flex-1 space-y-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black font-mono px-2.5 py-0.5 rounded bg-neutral-800 border border-neutral-700/40 uppercase tracking-widest ${selectedTier.accentColor}`}>
                      ELO {selectedTier.name}
                    </span>
                    {selectedTierIndex <= activeTierIndex ? (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3" /> DESBLOQUEADO
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold text-neutral-450 bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded-md">
                        <Lock className="w-3 h-3" /> BLOQUEADO
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-white mt-1.5">
                    {selectedTier.name} Tier
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-medium">
                    {selectedTier.description}
                  </p>
                </div>

                {/* Lista de Vantagens Cosméticas */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-black tracking-widest text-neutral-500 uppercase block">
                    Vantagens Visuais
                  </span>
                  
                  <div className="space-y-2">
                    {selectedTier.perks.map((perk, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className={`w-5 h-5 rounded-md bg-neutral-900 border border-neutral-800 flex items-center justify-center mt-0.5 flex-shrink-0`}>
                          <Zap className={`w-3 h-3 ${selectedTier.accentColor}`} />
                        </div>
                        <span className="text-xs text-neutral-300 font-medium">
                          {perk}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Caixa informativa de upgrade */}
                {selectedTierIndex > activeTierIndex && (
                  <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-850 flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black uppercase text-neutral-450 tracking-wider">Como Desbloquear</span>
                      <p className="text-xs text-neutral-300 font-semibold">
                        Alcance <span className={`font-bold ${selectedTier.accentColor}`}>{selectedTier.minOvr} OVR</span> no seu perfil.
                      </p>
                      <p className="text-[10px] text-neutral-400 font-medium">
                        Complete missões, adicione projetos e atualize suas experiências para ganhar OVR.
                      </p>
                    </div>
                  </div>
                )}

                {selectedTierIndex === activeTierIndex && (
                  <div className="p-3.5 rounded-2xl bg-violet-950/20 border border-violet-900/30 flex items-start gap-3 shadow-sm shadow-violet-950/15">
                    <div className="p-1.5 rounded-lg bg-violet-900/10 border border-violet-500/20 text-violet-400 animate-pulse">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black uppercase text-violet-400 tracking-wider">Elo Equipado</span>
                      <p className="text-xs text-neutral-150 font-bold">
                        Este é o design ativo do seu card atualmente!
                      </p>
                      <p className="text-[10px] text-neutral-450 font-medium">
                        Ele é exibido publicamente para os visitantes do seu portfólio.
                      </p>
                    </div>
                  </div>
                )}

                {selectedTierIndex < activeTierIndex && (
                  <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-900/30 flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-emerald-900/10 border border-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider">Elo Superado</span>
                      <p className="text-xs text-neutral-200 font-semibold">
                        Você já passou por este elo!
                      </p>
                      <p className="text-[10px] text-neutral-450 font-medium">
                        Seu card atual possui um tier de raridade superior ({currentTier.name}).
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
