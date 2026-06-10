'use client';

import { motion } from 'framer-motion';
import { Award, Lock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export type Badge = {
  id: string;
  name: string;
  description: string;
  iconPath: string;
  category: 'backend' | 'frontend' | 'devops' | 'community';
  isUnlocked: boolean;
  progress: number;
  target: number;
};

interface AchievementsPreviewProps {
  unlockedBadges?: Array<{
    id: string;
    name: string;
    description: string;
    icon_path: string;
  }>;
  projects?: Array<{
    title: string;
    description?: string | null;
  }>;
  skills?: Array<{
    name: string;
  }>;
  githubUrl?: string | null;
  className?: string;
}

export function AchievementsPreview({
  unlockedBadges = [],
  projects = [],
  skills = [],
  githubUrl = null,
  className,
}: AchievementsPreviewProps) {
  // Mapeia linguagens e frameworks dos projetos e skills do usuário para calcular o progresso local das conquistas
  const hasSkill = (name: string) => skills.some(s => s.name.toLowerCase().includes(name.toLowerCase()));
  const projectsWithTech = (tech: string) =>
    projects.filter(p => p.title.toLowerCase().includes(tech.toLowerCase()) || p.description?.toLowerCase().includes(tech.toLowerCase())).length;

  const laravelProjects = projectsWithTech('laravel') + (hasSkill('laravel') ? 1 : 0);
  const reactProjects = projectsWithTech('react') + projectsWithTech('next.js') + (hasSkill('react') || hasSkill('next.js') ? 1 : 0);
  const dockerProjects = projectsWithTech('docker') + (hasSkill('docker') ? 1 : 0);

  // Lista estática de Conquistas do DevFolio com cálculo de progresso dinâmico
  const allBadges: Badge[] = [
    {
      id: 'laravel_master',
      name: 'Laravel Master',
      description: 'Crie 5 projetos usando o ecossistema Laravel.',
      iconPath: 'star',
      category: 'backend',
      isUnlocked: laravelProjects >= 5 || unlockedBadges.some(b => b.name === 'Laravel Master'),
      progress: Math.min(5, laravelProjects),
      target: 5,
    },
    {
      id: 'react_specialist',
      name: 'React Specialist',
      description: 'Construa 5 interfaces modernas com React/Next.js.',
      iconPath: 'star',
      category: 'frontend',
      isUnlocked: reactProjects >= 5 || unlockedBadges.some(b => b.name === 'React Specialist'),
      progress: Math.min(5, reactProjects),
      target: 5,
    },
    {
      id: 'docker_commander',
      name: 'Docker Commander',
      description: 'Configure infraestrutura com Docker em 3 projetos.',
      iconPath: 'projects',
      category: 'devops',
      isUnlocked: dockerProjects >= 3 || unlockedBadges.some(b => b.name === 'Docker Commander'),
      progress: Math.min(3, dockerProjects),
      target: 3,
    },
    {
      id: 'open_source_hero',
      name: 'Open Source Hero',
      description: 'Conecte sua conta e realize contribuições públicas no GitHub.',
      iconPath: 'github',
      category: 'community',
      isUnlocked: !!githubUrl || unlockedBadges.some(b => b.name === 'Open Source Hero'),
      progress: githubUrl ? 1 : 0,
      target: 1,
    },
  ];

  // Filtra conquistas em progresso (bloqueadas)
  const lockedBadges = allBadges.filter(b => !b.isUnlocked);
  // Filtra conquistas desbloqueadas
  const unlocked = allBadges.filter(b => b.isUnlocked);

  return (
    <div className={`p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 shadow-sm ${className}`}>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="font-extrabold text-neutral-850 dark:text-neutral-200 text-base flex items-center gap-1.5">
            <Award className="w-5 h-5 text-violet-500" />
            Conquistas e Badges
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-450 mt-0.5">
            Desbloqueie títulos especiais adicionando novos eixos técnicos.
          </p>
        </div>

        {/* Link para o álbum completo */}
        <Link
          href="/dashboard/achievements"
          className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-500 flex items-center gap-0.5 select-none transition-colors"
        >
          Ver Álbum
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-5">
        {/* Conquistas Desbloqueadas (Badges Ativos) */}
        <div>
          <span className="text-[10px] font-bold font-mono text-neutral-450 dark:text-neutral-450 uppercase tracking-widest block mb-3">
            Desbloqueados ({unlocked.length})
          </span>
          <div className="flex flex-wrap gap-3">
            {unlocked.map((badge) => (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.05 }}
                className="relative group cursor-help bg-gradient-to-br from-violet-500/10 to-indigo-500/10 dark:from-violet-500/15 dark:to-indigo-500/15 border border-violet-500/20 dark:border-violet-500/30 rounded-xl p-3 flex items-center gap-2.5 max-w-[180px] w-full"
                title={`${badge.name}: ${badge.description}`}
              >
                <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white shadow-md">
                  <Award className="w-4 h-4 text-amber-300" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-neutral-800 dark:text-neutral-100 truncate">{badge.name}</p>
                  <p className="text-[9px] font-medium text-violet-600 dark:text-violet-400 uppercase tracking-wider">Desbloqueado</p>
                </div>
              </motion.div>
            ))}
            {unlocked.length === 0 && (
              <p className="text-xs text-neutral-500 dark:text-neutral-500 italic">Nenhum badge desbloqueado ainda. Complete quests para conquistar!</p>
            )}
          </div>
        </div>

        {/* Conquistas em Progresso */}
        {lockedBadges.length > 0 && (
          <div>
            <span className="text-[10px] font-bold font-mono text-neutral-450 dark:text-neutral-450 uppercase tracking-widest block mb-3">
              Quase Lá ({lockedBadges.length})
            </span>
            <div className="space-y-3">
              {lockedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-3 bg-neutral-50/50 dark:bg-neutral-950/20 border border-neutral-200 dark:border-neutral-850/60 rounded-xl flex items-center gap-3"
                >
                  {/* Locked Badge Icon */}
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 flex-shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>

                  {/* Info & Progress */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate">
                        {badge.name}
                      </h4>
                      <span className="text-[10px] font-bold font-mono text-neutral-500">
                        {badge.progress} / {badge.target}
                      </span>
                    </div>
                    {/* Linear Progress Bar */}
                    <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-500 rounded-full transition-all duration-500"
                        style={{ width: `${(badge.progress / badge.target) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
