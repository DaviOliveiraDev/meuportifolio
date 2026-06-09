'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowRight, Sparkles, Share2 } from 'lucide-react';
import Link from 'next/link';
import { XP_REWARDS } from '@/features/gamification/constants/rewards';
import { toast } from 'sonner';

export interface QuestLogProps {
  profile?: {
    username: string;
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

export function QuestLog({
  profile,
  projectsCount = 0,
  experiencesCount = 0,
  educationsCount = 0,
  hasPdfResume = false,
  className,
}: QuestLogProps) {
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsShared(localStorage.getItem('devfolio_quest_share_card_completed') === 'true');
    }
  }, []);

  const handleShare = () => {
    if (typeof window === 'undefined') return;
    const host = `${window.location.protocol}//${window.location.host}`;
    const portfolioUrl = profile?.username ? `${host}/${profile.username}` : host;
    
    navigator.clipboard.writeText(portfolioUrl);
    localStorage.setItem('devfolio_quest_share_card_completed', 'true');
    setIsShared(true);
    toast.success('Link do portfólio copiado! Compartilhe com a sua rede para promover seu card.');
  };

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
    {
      id: 'share_card',
      title: 'Promover seu Card',
      description: 'Copie e compartilhe o link do seu portfólio com recrutadores e redes.',
      reward: XP_REWARDS.SHARE_CARD,
      isCompleted: isShared,
      progress: isShared ? 1 : 0,
      target: 1,
      onClick: handleShare,
      actionLabel: 'Compartilhar',
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Cabeçalho do Log de Missões */}
      <div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-55 tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-500" />
          Jornada do Desenvolvedor
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-450 mt-0.5">
          Complete missões técnicas para subir de nível e evoluir seu OVR.
        </p>
      </div>

      {/* Grid de Missões da Jornada Principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {journeyQuests.map((quest) => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex gap-3.5 p-4 rounded-xl border transition-all ${
              quest.isCompleted
                ? 'bg-neutral-50/50 dark:bg-neutral-950/20 border-neutral-200 dark:border-neutral-900/60 opacity-65'
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
                quest.onClick ? (
                  <button
                    onClick={quest.onClick}
                    className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-500 hover:underline transition-all cursor-pointer bg-transparent border-none p-0"
                  >
                    {quest.actionLabel}
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <Link
                    href={quest.href}
                    className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-500 hover:underline transition-all"
                  >
                    {quest.actionLabel}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
