'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

export interface ProfileCompletionCardProps {
  completeness?: number;
  profile?: {
    bio?: string | null;
    avatar_url?: string | null;
    github_url?: string | null;
    skills?: Array<unknown>;
  } | null;
  projectsCount?: number;
  experiencesCount?: number;
  educationsCount?: number;
  hasPdfResume?: boolean;
  className?: string;
}

export function ProfileCompletionCard({
  completeness = 0,
  profile,
  projectsCount = 0,
  experiencesCount = 0,
  educationsCount = 0,
  hasPdfResume = false,
  className,
}: ProfileCompletionCardProps) {
  // Lista de itens auditados para completude
  const checklist = [
    { label: 'Foto de Perfil carregada', isDone: !!profile?.avatar_url, value: 15 },
    { label: 'Biografia profissional preenchida', isDone: !!profile?.bio, value: 15 },
    { label: 'Ao menos 1 projeto cadastrado', isDone: projectsCount > 0, value: 15 },
    { label: 'Ao menos 1 experiência profissional', isDone: experiencesCount > 0, value: 15 },
    { label: 'Ao menos 1 formação acadêmica', isDone: educationsCount > 0, value: 15 },
    { label: 'No mínimo 3 habilidades cadastradas', isDone: (profile?.skills?.length ?? 0) >= 3, value: 10 },
    { label: 'Conta do GitHub conectada', isDone: !!profile?.github_url, value: 10 },
    { label: 'Currículo em PDF gerado', isDone: hasPdfResume, value: 10 },
  ];

  // Determina o título do nível de perfil baseado no progresso
  const getCompletenessLevelName = (pct: number) => {
    if (pct >= 100) return { name: 'Lendário', color: 'text-amber-500' };
    if (pct >= 80) return { name: 'Diamante', color: 'text-cyan-400' };
    if (pct >= 60) return { name: 'Ouro', color: 'text-yellow-500' };
    if (pct >= 35) return { name: 'Prata', color: 'text-slate-350' };
    return { name: 'Bronze', color: 'text-amber-700' };
  };

  const levelInfo = getCompletenessLevelName(completeness);

  return (
    <div className={`p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 shadow-sm ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-extrabold text-neutral-850 dark:text-neutral-200 text-base flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-violet-500" />
            Completude de Perfil
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-450 mt-0.5">
            Fortaleça seu cartão alcançando 100% de completude.
          </p>
        </div>

        {/* Nível do Perfil */}
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-neutral-450 tracking-wider">Força</span>
          <p className={`text-sm font-extrabold ${levelInfo.color} leading-none mt-0.5`}>
            {levelInfo.name}
          </p>
        </div>
      </div>

      {/* Barra de Progresso com Número Grande */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl font-black text-neutral-950 dark:text-neutral-50 tracking-tighter w-16 select-none">
          {completeness}%
        </span>
        <div className="flex-1 h-3.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden border border-neutral-200/20 dark:border-neutral-800/40 relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completeness}%` }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-500 dark:to-indigo-500 rounded-full"
          />
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-850">
        {checklist.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div className="flex-shrink-0">
              {item.isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <HelpCircle className="w-4 h-4 text-neutral-300 dark:text-neutral-750" />
              )}
            </div>
            <span className={`truncate ${item.isDone ? 'text-neutral-500 dark:text-neutral-500 font-medium' : 'text-neutral-700 dark:text-neutral-400 font-light'}`}>
              {item.label}
            </span>
            <span className="text-[9px] font-mono font-bold text-neutral-450 dark:text-neutral-600 ml-auto flex-shrink-0">
              +{item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
