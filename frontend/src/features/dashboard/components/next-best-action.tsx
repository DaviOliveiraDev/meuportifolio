'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Award } from 'lucide-react';
import Link from 'next/link';
import { XP_REWARDS } from '@/features/gamification/constants/rewards';

export interface NextBestActionProps {
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

export function NextBestAction({
  profile,
  projectsCount = 0,
  experiencesCount = 0,
  educationsCount = 0,
  hasPdfResume = false,
  className,
}: NextBestActionProps) {
  // Define todas as ações possíveis de completude
  const actions = [
    {
      key: 'bio',
      label: 'Adicionar Bio',
      description: 'Escreva uma biografia profissional curta para resumir seus objetivos.',
      xp: XP_REWARDS.ADD_BIO,
      isCompleted: !!profile?.bio,
      href: '/dashboard/profile',
    },
    {
      key: 'avatar',
      label: 'Carregar Foto',
      description: 'Adicione uma foto profissional para personalizar seu Developer Card.',
      xp: XP_REWARDS.ADD_AVATAR,
      isCompleted: !!profile?.avatar_url,
      href: '/dashboard/profile',
    },
    {
      key: 'github',
      label: 'Conectar GitHub',
      description: 'Conecte seu GitHub para sincronizar seus commits e repositórios.',
      xp: XP_REWARDS.CONNECT_GITHUB,
      isCompleted: !!profile?.github_url,
      href: '/dashboard/profile',
    },
    {
      key: 'skills',
      label: 'Adicionar Habilidades',
      description: 'Adicione pelo menos 3 skills (ex: React, Node, SQL) ao seu perfil.',
      xp: XP_REWARDS.ADD_SKILLS,
      isCompleted: (profile?.skills?.length ?? 0) >= 3,
      href: '/dashboard/profile', // ou rota específica de skills se houver
    },
    {
      key: 'education',
      label: 'Adicionar Formação',
      description: 'Cadastre sua formação acadêmica ou cursos técnicos realizados.',
      xp: XP_REWARDS.ADD_EDUCATION,
      isCompleted: educationsCount > 0,
      href: '/dashboard/educations',
    },
    {
      key: 'experience',
      label: 'Adicionar Experiência',
      description: 'Cadastre suas experiências profissionais anteriores.',
      xp: XP_REWARDS.ADD_EXPERIENCE,
      isCompleted: experiencesCount > 0,
      href: '/dashboard/experiences',
    },
    {
      key: 'project',
      label: 'Adicionar Projeto',
      description: 'Cadastre seu primeiro projeto ou sincronize-o do GitHub.',
      xp: XP_REWARDS.ADD_PROJECT,
      isCompleted: projectsCount > 0,
      href: '/dashboard/projects',
    },
    {
      key: 'pdf',
      label: 'Gerar Currículo PDF',
      description: 'Gere um PDF otimizado do seu currículo em apenas um clique.',
      xp: XP_REWARDS.GENERATE_PDF,
      isCompleted: hasPdfResume,
      href: '/dashboard', // Normalmente fica na home ou aba de PDF do dashboard
    },
  ];

  // Encontra a primeira ação pendente na ordem de prioridade definida acima
  const nextAction = actions.find(action => !action.isCompleted);

  // Se todas as ações estiverem concluídas, não há "Next Best Action" a sugerir
  if (!nextAction) {
    return (
      <div className={`p-6 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/10 border border-emerald-500/20 rounded-2xl p-6 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-neutral-850 dark:text-neutral-200 text-sm">Perfil 100% Completo!</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-450 mt-0.5">
              Parabéns! Sua reputação profissional está totalmente configurada e ativa.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`p-6 rounded-2xl bg-gradient-to-br from-violet-50/80 to-white dark:from-violet-950/10 dark:to-neutral-900 border border-violet-100 dark:border-neutral-850 relative overflow-hidden shadow-sm ${className}`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-500" />
            Próximo passo sugerido
          </span>
          <h3 className="text-base font-extrabold text-neutral-850 dark:text-neutral-200">
            {nextAction.label}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-450 max-w-md font-medium leading-relaxed">
            {nextAction.description}
          </p>
        </div>

        <div className="flex items-center gap-3.5 sm:self-center">
          {/* XP Reward Badge */}
          <div className="px-3 py-1.5 rounded-lg bg-violet-600/10 dark:bg-violet-500/15 border border-violet-500/20 text-violet-600 dark:text-violet-400 font-extrabold text-xs flex items-center gap-1 select-none">
            <span>+{nextAction.xp}</span>
            <span className="text-[10px] opacity-85">XP</span>
          </div>

          {/* Action Button */}
          <Link
            href={nextAction.href}
            className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-sm hover:translate-x-0.5 transition-all cursor-pointer"
          >
            Começar
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
