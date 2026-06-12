'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Briefcase, 
  FolderKanban, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  RotateCcw, 
  X, 
  TrendingUp,
  Sparkles,
  HelpCircle
} from 'lucide-react';

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface OvrBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  breakdownData: {
    ovr: number;
    weights: {
      experience: number;
      projects: number;
      skills_badges: number;
      github: number;
      education: number;
      completeness: number;
    };
    axes: {
      [key: string]: {
        name: string;
        score: number;
        weight: number;
        contribution: string;
        tip: string;
      };
    };
  };
}

export function OvrBreakdownModal({ isOpen, onClose, breakdownData }: OvrBreakdownModalProps) {
  const defaultWeights = {
    experience: 30,
    projects: 25,
    skills_badges: 15,
    github: 15,
    education: 10,
    completeness: 5,
  };

  const [localWeights, setLocalWeights] = useState(defaultWeights);

  useEffect(() => {
    if (breakdownData?.weights) {
      setLocalWeights({
        experience: breakdownData.weights.experience ?? defaultWeights.experience,
        projects: breakdownData.weights.projects ?? defaultWeights.projects,
        skills_badges: breakdownData.weights.skills_badges ?? defaultWeights.skills_badges,
        github: breakdownData.weights.github ?? defaultWeights.github,
        education: breakdownData.weights.education ?? defaultWeights.education,
        completeness: breakdownData.weights.completeness ?? defaultWeights.completeness,
      });
    }
  }, [breakdownData]);

  if (!isOpen || !breakdownData) return null;

  // Calculadora local do OVR
  const calculateOvr = (weights: typeof defaultWeights) => {
    const axes = breakdownData.axes;
    if (!axes) return 1;

    const expScore = axes.experience?.score ?? 0;
    const projScore = axes.projects?.score ?? 0;
    const skillScore = axes.skills_badges?.score ?? 0;
    const githubScore = axes.github?.score ?? 0;
    const eduScore = axes.education?.score ?? 0;
    const compScore = axes.completeness?.score ?? 0;

    const weightedSum = 
      (expScore * weights.experience) +
      (projScore * weights.projects) +
      (skillScore * weights.skills_badges) +
      (githubScore * weights.github) +
      (eduScore * weights.education) +
      (compScore * weights.completeness);

    const totalWeight = 
      weights.experience +
      weights.projects +
      weights.skills_badges +
      weights.github +
      weights.education +
      weights.completeness;

    if (totalWeight === 0) return 0;
    const ovr = Math.round(weightedSum / totalWeight);
    return Math.max(1, Math.min(99, ovr));
  };

  const currentOvr = breakdownData.ovr;
  const simulatedOvr = calculateOvr(localWeights);
  const ovrDiff = simulatedOvr - currentOvr;

  const handleWeightChange = (key: keyof typeof defaultWeights, value: number) => {
    setLocalWeights(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleResetWeights = () => {
    if (breakdownData?.weights) {
      setLocalWeights({
        experience: breakdownData.weights.experience ?? defaultWeights.experience,
        projects: breakdownData.weights.projects ?? defaultWeights.projects,
        skills_badges: breakdownData.weights.skills_badges ?? defaultWeights.skills_badges,
        github: breakdownData.weights.github ?? defaultWeights.github,
        education: breakdownData.weights.education ?? defaultWeights.education,
        completeness: breakdownData.weights.completeness ?? defaultWeights.completeness,
      });
    } else {
      setLocalWeights(defaultWeights);
    }
  };

  const getAxisIcon = (key: string) => {
    switch (key) {
      case 'experience': return <Briefcase className="w-5 h-5 text-indigo-400" />;
      case 'projects': return <FolderKanban className="w-5 h-5 text-emerald-400" />;
      case 'skills_badges': return <Award className="w-5 h-5 text-yellow-400" />;
      case 'github': return <Github className="w-5 h-5 text-sky-400" />;
      case 'education': return <BookOpen className="w-5 h-5 text-pink-400" />;
      case 'completeness': return <CheckCircle2 className="w-5 h-5 text-teal-400" />;
      default: return <Trophy className="w-5 h-5 text-violet-400" />;
    }
  };

  // Determinar cores do Tier baseadas no OVR simulado
  const getOvrTierColorClass = (ovr: number) => {
    if (ovr >= 85) return 'text-sky-400 drop-shadow-[0_0_12px_rgba(14,165,233,0.5)]';
    if (ovr >= 75) return 'text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]';
    if (ovr >= 65) return 'text-slate-300 drop-shadow-[0_0_10px_rgba(203,213,225,0.4)]';
    return 'text-amber-700';
  };

  const getOvrTierName = (ovr: number) => {
    if (ovr >= 95) return 'Lendário';
    if (ovr >= 85) return 'Diamante';
    if (ovr >= 75) return 'Ouro';
    if (ovr >= 65) return 'Prata';
    return 'Bronze';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative max-w-2xl w-full p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 text-white shadow-[0_0_60px_rgba(99,102,241,0.2)] flex flex-col gap-6 my-8"
      >
        {/* Botão de Fechar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-850 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            Detalhamento do Score Geral (OVR)
          </h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Seu Overall Rating (OVR) representa seu nível consolidado na plataforma. O cálculo é 100% transparente: a média ponderada de 6 pilares do seu portfólio.
          </p>
        </div>

        {/* Seção OVR atual vs Simulado */}
        <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-850 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">OVR Atual</p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className={`text-3xl font-black ${getOvrTierColorClass(currentOvr)}`}>{currentOvr}</span>
                <span className="text-xs font-semibold text-neutral-500">({getOvrTierName(currentOvr)})</span>
              </div>
            </div>
          </div>

          <div className="h-[1px] sm:h-12 w-full sm:w-[1px] bg-neutral-800" />

          {/* Simulador */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
            <div className="text-center sm:text-right">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">OVR Simulado (Pré-visualização)</p>
              <div className="flex items-center justify-center sm:justify-end gap-2 mt-0.5">
                <span className={`text-3xl font-black ${getOvrTierColorClass(simulatedOvr)}`}>{simulatedOvr}</span>
                <span className="text-xs font-semibold text-neutral-500">({getOvrTierName(simulatedOvr)})</span>
                
                {ovrDiff !== 0 && (
                  <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                    ovrDiff > 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                  }`}>
                    {ovrDiff > 0 ? `+${ovrDiff}` : ovrDiff}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Eixos de Cálculo (Sliders & Descritivo) */}
        <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
          {Object.entries(breakdownData.axes || {}).map(([key, axis]) => {
            const currentWeight = localWeights[key as keyof typeof defaultWeights] ?? axis.weight;
            
            return (
              <div key={key} className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3 hover:border-neutral-750 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {getAxisIcon(key)}
                    <span className="font-extrabold text-sm text-neutral-100">{axis.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-neutral-400 mr-2">Score: {axis.score}/100</span>
                    <span className="text-xs font-mono font-bold text-violet-400">Peso: {currentWeight}%</span>
                  </div>
                </div>

                {/* Descritivo de Contribuições */}
                <p className="text-[11px] text-neutral-300 leading-normal pl-7">
                  <span className="font-mono text-neutral-500 mr-1.5">★</span> {axis.contribution}
                </p>

                {/* Slider de Peso */}
                <div className="flex items-center gap-4 pl-7">
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={currentWeight}
                    onChange={(e) => handleWeightChange(key as keyof typeof defaultWeights, parseInt(e.target.value))}
                    className="w-full h-1 bg-neutral-850 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none"
                  />
                </div>

                {/* Dica de Crescimento */}
                <div className="flex items-start gap-1.5 pl-7 text-[10px] text-neutral-500 leading-normal bg-neutral-950/20 p-2 rounded-lg">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>{axis.tip}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">
          <button
            onClick={handleResetWeights}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-neutral-850 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Restaurar Pesos Padrão
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-violet-650 hover:bg-violet-600 text-white text-xs font-extrabold transition-all cursor-pointer shadow-md shadow-violet-500/10"
          >
            Fechar Detalhamento
          </button>
        </div>
      </motion.div>
    </div>
  );
}
