'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowRight, Calendar, Sparkles, Flame } from 'lucide-react';
import Link from 'next/link';
import { XP_REWARDS } from '@/features/gamification/constants/rewards';

export interface QuestLogProps {
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
  streakDays?: number;
  className?: string;
}

export function QuestLog({
  profile,
  projectsCount = 0,
  experiencesCount = 0,
  educationsCount = 0,
  hasPdfResume = false,
  streakDays = 0,
  className,
}: QuestLogProps) {
  // Lista de Quests da Jornada Principal (Milestones)
  const journeyQuests = [
    {
      id: 'bio',
      title: 'Completar Biografia',
      description: 'Escreva sobre suas principais experiências e objetivos.',
      reward: XP_REWARDS.ADD_BIO,
      isCompleted: !!profile?.bio,
      progress: profile?.bio ? 1 : 0,
      target: 1,
      href: '/dashboard/profile',
      actionLabel: 'Editar Bio',
    },
    {
      id: 'github',
      title: 'Conectar seu GitHub',
      description: 'Vincule seu perfil do GitHub para mostrar sua atividade real.',
      reward: XP_REWARDS.CONNECT_GITHUB,
      isCompleted: !!profile?.github_url,
      progress: profile?.github_url ? 1 : 0,
      target: 1,
      href: '/dashboard/profile',
      actionLabel: 'Vincular',
    },
    {
      id: 'skills',
      title: 'Dominar Habilidades',
      description: 'Cadastre no mínimo 3 habilidades técnicas ao seu perfil.',
      reward: XP_REWARDS.ADD_SKILLS,
      isCompleted: (profile?.skills?.length ?? 0) >= 3,
      progress: Math.min(3, profile?.skills?.length ?? 0),
      target: 3,
      href: '/dashboard/profile',
      actionLabel: 'Adicionar Skills',
    },
    {
      id: 'projects',
      title: 'Cadastrar Projetos',
      description: 'Adicione pelo menos 3 projetos de destaque ao seu portfólio.',
      reward: XP_REWARDS.ADD_PROJECT,
      isCompleted: projectsCount >= 3,
      progress: Math.min(3, projectsCount),
      target: 3,
      href: '/dashboard/projects',
      actionLabel: 'Adicionar Projetos',
    },
    {
      id: 'experiences',
      title: 'Registrar Histórico de Trabalho',
      description: 'Cadastre pelo menos 1 experiência profissional relevante.',
      reward: XP_REWARDS.ADD_EXPERIENCE,
      isCompleted: experiencesCount >= 1,
      progress: Math.min(1, experiencesCount),
      target: 1,
      href: '/dashboard/experiences',
      actionLabel: 'Adicionar Experiência',
    },
    {
      id: 'pdf_resume',
      title: 'Gerar Currículo PDF',
      description: 'Gere um PDF do seu portfólio otimizado para o mercado.',
      reward: XP_REWARDS.GENERATE_PDF,
      isCompleted: hasPdfResume,
      progress: hasPdfResume ? 1 : 0,
      target: 1,
      href: '/dashboard',
      actionLabel: 'Gerar PDF',
    },
  ];

  // Lista de Missões Diárias (Simuladas)
  const dailyQuests = [
    {
      id: 'daily_sync',
      title: 'Sincronizar commits diários',
      description: 'Resgate o bônus diário de XP ao atualizar seus dados do GitHub.',
      reward: XP_REWARDS.DAILY_SYNC,
      isCompleted: streakDays > 0, // Se houver streak ativa, considera sincronizado
      href: '/dashboard/projects',
      actionLabel: 'Sincronizar',
    },
    {
      id: 'share_card',
      title: 'Promover seu card profissional',
      description: 'Compartilhe seu link exclusivo do Developer Card com o mercado.',
      reward: XP_REWARDS.SHARE_CARD,
      isCompleted: false, // Simulado diariamente
      href: `/dashboard`,
      actionLabel: 'Compartilhar',
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Cabeçalho do Log de Missões */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-55 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-500" />
            Jornada do Desenvolvedor
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-450 mt-0.5">
            Complete missões técnicas para subir de nível e evoluir seu OVR.
          </p>
        </div>

        {/* Streak Counter widget */}
        {streakDays > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 font-extrabold text-xs">
            <Flame className="w-4 h-4 animate-bounce" />
            <span>🔥 {streakDays} dias de ofensiva</span>
          </div>
        )}
      </div>

      {/* Grid de Missões */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Missões Diárias */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold font-mono text-neutral-450 dark:text-neutral-450 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-neutral-200 dark:border-neutral-850">
            <Calendar className="w-4 h-4 text-violet-500" />
            Missões Diárias
          </h3>
          <div className="space-y-3">
            {dailyQuests.map((quest) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex gap-3.5 p-4 rounded-xl border transition-all ${
                  quest.isCompleted
                    ? 'bg-neutral-50/50 dark:bg-neutral-950/20 border-neutral-200 dark:border-neutral-900 opacity-60'
                    : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-850 hover:border-violet-500/20'
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {quest.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-neutral-300 dark:text-neutral-750" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className={`text-sm font-bold truncate ${quest.isCompleted ? 'text-neutral-500 line-through' : 'text-neutral-850 dark:text-neutral-200'}`}>
                      {quest.title}
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/10 flex-shrink-0">
                      +{quest.reward} XP
                    </span>
                  </div>
                  <p className="text-xs text-neutral-550 dark:text-neutral-450 mt-1 font-light leading-relaxed">
                    {quest.description}
                  </p>
                  
                  {!quest.isCompleted && (
                    <Link
                      href={quest.href}
                      className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-500 hover:underline transition-all"
                    >
                      {quest.actionLabel}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Jornada Principal (Milestones) */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold font-mono text-neutral-450 dark:text-neutral-450 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-neutral-200 dark:border-neutral-850">
            <TrophyIcon className="w-4 h-4 text-violet-500" />
            Jornada Principal
          </h3>
          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {journeyQuests.map((quest) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex gap-3.5 p-4 rounded-xl border transition-all ${
                  quest.isCompleted
                    ? 'bg-neutral-50/50 dark:bg-neutral-950/20 border-neutral-200 dark:border-neutral-900 opacity-60'
                    : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-850 hover:border-violet-500/20'
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {quest.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-neutral-300 dark:text-neutral-750" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className={`text-sm font-bold truncate ${quest.isCompleted ? 'text-neutral-500 line-through' : 'text-neutral-850 dark:text-neutral-200'}`}>
                      {quest.title}
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/10 flex-shrink-0">
                      +{quest.reward} XP
                    </span>
                  </div>
                  <p className="text-xs text-neutral-550 dark:text-neutral-450 mt-1 font-light leading-relaxed">
                    {quest.description}
                  </p>

                  {/* Barra de Progresso Interno (se aplicável, e.g. 1/3 projetos) */}
                  {quest.target > 1 && !quest.isCompleted && (
                    <div className="mt-3.5 space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-bold text-neutral-500 dark:text-neutral-450 uppercase">
                        <span>Progresso</span>
                        <span>{quest.progress} / {quest.target}</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-500 rounded-full transition-all duration-500"
                          style={{ width: `${(quest.progress / quest.target) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {!quest.isCompleted && (
                    <Link
                      href={quest.href}
                      className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-500 hover:underline transition-all"
                    >
                      {quest.actionLabel}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// Icon helper components
function TrophyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
      <path d="M12 2a6 6 0 0 1 6 6v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z" />
    </svg>
  );
}
