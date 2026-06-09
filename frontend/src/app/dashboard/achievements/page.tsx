'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { useProjects } from '@/features/projects/hooks/use-projects';
import { useExperiences } from '@/features/experiences/hooks/use-experiences';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Lock, 
  ArrowLeft, 
  Sparkles, 
  Trophy, 
  Flame, 
  Terminal, 
  Code2, 
  Server, 
  Globe, 
  CheckCircle2,
  LockKeyhole
} from 'lucide-react';
import Link from 'next/link';

type AchievementCategory = 'all' | 'backend' | 'frontend' | 'devops' | 'profile';

interface Badge {
  id: string;
  name: string;
  description: string;
  iconType: 'star' | 'github' | 'pdf' | 'projects' | 'experiences' | 'skills' | 'laravel' | 'react' | 'docker' | 'elite';
  category: AchievementCategory;
  isUnlocked: boolean;
  progress: number;
  target: number;
  xpReward: number;
}

export default function AchievementsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { projects = [], isLoading: projectsLoading } = useProjects();
  const { experiences = [], isLoading: experiencesLoading } = useExperiences();
  
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory>('all');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const profile = user?.profile;
  const loading = authLoading || projectsLoading || experiencesLoading;

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 text-neutral-500">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold tracking-wider uppercase text-neutral-450">Abrindo a Galeria de Troféus...</span>
      </div>
    );
  }

  const skills = profile?.skills || [];
  const unlockedBadges = profile?.badges || [];
  const ovr = profile?.ovr || 0;
  const completeness = profile?.profile_completeness || 0;

  // Helpers para cálculo do progresso local das badges
  const hasSkill = (name: string) => skills.some(s => s.name.toLowerCase().includes(name.toLowerCase()));
  const projectsWithTech = (tech: string) =>
    projects.filter(p => p.title.toLowerCase().includes(tech.toLowerCase()) || (p.description && p.description.toLowerCase().includes(tech.toLowerCase()))).length;

  const laravelProjects = projectsWithTech('laravel') + (hasSkill('laravel') ? 1 : 0);
  const reactProjects = projectsWithTech('react') + projectsWithTech('next.js') + (hasSkill('react') || hasSkill('next.js') ? 1 : 0);
  const dockerProjects = projectsWithTech('docker') + (hasSkill('docker') ? 1 : 0);

  // Lista oficial de conquistas combinada (Seeded no Banco + Custom Frontend)
  const badgesList: Badge[] = [
    {
      id: 'perfil_estrela',
      name: 'Perfil Estrela',
      description: 'Atingiu 100% de completude do perfil profissional.',
      iconType: 'star',
      category: 'profile',
      isUnlocked: completeness >= 100 || unlockedBadges.some(b => b.name === 'Perfil Estrela'),
      progress: completeness,
      target: 100,
      xpReward: 1000
    },
    {
      id: 'octocat_connect',
      name: 'Octocat Connect',
      description: 'Conectou com sucesso a conta do GitHub ao portfólio.',
      iconType: 'github',
      category: 'profile',
      isUnlocked: !!profile?.github_url || unlockedBadges.some(b => b.name === 'Octocat Connect'),
      progress: profile?.github_url ? 1 : 0,
      target: 1,
      xpReward: 500
    },
    {
      id: 'curriculo_exportado',
      name: 'Currículo Exportado',
      description: 'Gerou o primeiro currículo em PDF otimizado para ATS.',
      iconType: 'pdf',
      category: 'profile',
      isUnlocked: unlockedBadges.some(b => b.name === 'Currículo Exportado'),
      progress: unlockedBadges.some(b => b.name === 'Currículo Exportado') ? 1 : 0,
      target: 1,
      xpReward: 300
    },
    {
      id: 'portfolio_ativo',
      name: 'Portfólio Ativo',
      description: 'Cadastrou pelo menos 3 projetos no portfólio.',
      iconType: 'projects',
      category: 'profile',
      isUnlocked: projects.length >= 3 || unlockedBadges.some(b => b.name === 'Portfólio Ativo'),
      progress: Math.min(3, projects.length),
      target: 3,
      xpReward: 300
    },
    {
      id: 'carreira_foco',
      name: 'Carreira em Foco',
      description: 'Adicionou pelo menos 2 experiências profissionais.',
      iconType: 'experiences',
      category: 'profile',
      isUnlocked: experiences.length >= 2 || unlockedBadges.some(b => b.name === 'Carreira em Foco'),
      progress: Math.min(2, experiences.length),
      target: 2,
      xpReward: 300
    },
    {
      id: 'especialista',
      name: 'Especialista',
      description: 'Adicionou pelo menos 5 habilidades ao seu perfil.',
      iconType: 'skills',
      category: 'profile',
      isUnlocked: skills.length >= 5 || unlockedBadges.some(b => b.name === 'Especialista'),
      progress: Math.min(5, skills.length),
      target: 5,
      xpReward: 300
    },
    {
      id: 'laravel_master',
      name: 'Laravel Master',
      description: 'Crie 5 projetos ou habilidades usando o ecossistema Laravel.',
      iconType: 'laravel',
      category: 'backend',
      isUnlocked: laravelProjects >= 5 || unlockedBadges.some(b => b.name === 'Laravel Master'),
      progress: Math.min(5, laravelProjects),
      target: 5,
      xpReward: 300
    },
    {
      id: 'react_specialist',
      name: 'React Specialist',
      description: 'Construa 5 interfaces modernas ou habilidades com React/Next.js.',
      iconType: 'react',
      category: 'frontend',
      isUnlocked: reactProjects >= 5 || unlockedBadges.some(b => b.name === 'React Specialist'),
      progress: Math.min(5, reactProjects),
      target: 5,
      xpReward: 300
    },
    {
      id: 'docker_commander',
      name: 'Docker Commander',
      description: 'Configure infraestrutura com Docker em 3 projetos ou habilidades.',
      iconType: 'docker',
      category: 'devops',
      isUnlocked: dockerProjects >= 3 || unlockedBadges.some(b => b.name === 'Docker Commander'),
      progress: Math.min(3, dockerProjects),
      target: 3,
      xpReward: 300
    },
    {
      id: 'elite_developer',
      name: 'Desenvolvedor Elite',
      description: 'Atingiu a pontuação OVR Geral de 85 ou superior no Developer Card.',
      iconType: 'elite',
      category: 'profile',
      isUnlocked: ovr >= 85 || unlockedBadges.some(b => b.name === 'Desenvolvedor Elite'),
      progress: Math.min(85, ovr),
      target: 85,
      xpReward: 500
    }
  ];

  const filteredBadges = selectedCategory === 'all' 
    ? badgesList 
    : badgesList.filter(b => b.category === selectedCategory);

  const unlockedCount = badgesList.filter(b => b.isUnlocked).length;
  const totalXpAwarded = badgesList
    .filter(b => b.isUnlocked)
    .reduce((acc, curr) => acc + curr.xpReward, 0);

  // Renderizador de ícones baseado em tipo
  const renderBadgeIcon = (type: string, isUnlocked: boolean) => {
    const colorClass = isUnlocked ? "text-amber-300 animate-pulse" : "text-neutral-400";
    switch (type) {
      case 'star':
        return <Trophy className={`w-8 h-8 ${colorClass}`} />;
      case 'github':
        return <Code2 className={`w-8 h-8 ${colorClass}`} />;
      case 'pdf':
        return <Globe className={`w-8 h-8 ${colorClass}`} />;
      case 'projects':
        return <Flame className={`w-8 h-8 ${colorClass}`} />;
      case 'experiences':
        return <Terminal className={`w-8 h-8 ${colorClass}`} />;
      case 'skills':
        return <Server className={`w-8 h-8 ${colorClass}`} />;
      case 'laravel':
        return <Server className={`w-8 h-8 ${colorClass}`} />;
      case 'react':
        return <Code2 className={`w-8 h-8 ${colorClass}`} />;
      case 'docker':
        return <Terminal className={`w-8 h-8 ${colorClass}`} />;
      case 'elite':
        return <Sparkles className={`w-8 h-8 ${colorClass}`} />;
      default:
        return <Award className={`w-8 h-8 ${colorClass}`} />;
    }
  };

  const getCategoryLabel = (cat: AchievementCategory) => {
    switch (cat) {
      case 'backend': return 'Backend';
      case 'frontend': return 'Frontend';
      case 'devops': return 'DevOps / Infra';
      case 'profile': return 'Jornada';
      default: return 'Todos';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 font-sans pb-16">
      
      {/* Cabeçalho de Navegação */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-1 text-xs font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors uppercase tracking-wider mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar ao Painel
          </Link>
          <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
            <Trophy className="w-8 h-8 text-amber-500" />
            Álbum de Conquistas
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            Exiba com orgulho suas conquistas de RPG de carreira e títulos de especialidade técnica.
          </p>
        </div>
      </div>

      {/* Painel de Estatísticas da Galeria */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Conquistas Desbloqueadas</p>
            <p className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-0.5">
              {unlockedCount} <span className="text-sm font-medium text-neutral-450">/ {badgesList.length}</span>
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Total de XP Ganho</p>
            <p className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-0.5">
              +{totalXpAwarded} <span className="text-sm font-medium text-neutral-450">XP</span>
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Taxa de Conclusão</p>
            <p className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-0.5">
              {Math.round((unlockedCount / badgesList.length) * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* Filtros e Categorias */}
      <div className="flex flex-wrap gap-2.5 border-b border-neutral-200 dark:border-neutral-850 pb-4">
        {(['all', 'profile', 'frontend', 'backend', 'devops'] as AchievementCategory[]).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`py-2 px-4 rounded-xl text-xs font-extrabold tracking-wide cursor-pointer transition-all ${
              selectedCategory === category 
                ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/20' 
                : 'bg-white hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-850 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-850'
            }`}
          >
            {getCategoryLabel(category)}
          </button>
        ))}
      </div>

      {/* Grid de Cards (Álbum) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredBadges.map((badge) => (
          <motion.div
            key={badge.id}
            whileHover={{ y: -4 }}
            onClick={() => setSelectedBadge(badge)}
            className={`relative p-5 rounded-2xl cursor-pointer transition-all border ${
              badge.isUnlocked
                ? 'bg-gradient-to-br from-white via-white to-violet-500/5 dark:from-neutral-900 dark:via-neutral-900 dark:to-violet-500/5 border-violet-500/20 dark:border-violet-500/35 hover:shadow-[0_8px_30px_rgba(99,102,241,0.12)]'
                : 'bg-neutral-50/70 dark:bg-neutral-900/30 border-neutral-200 dark:border-neutral-850/60 opacity-80 hover:opacity-100'
            }`}
          >
            {/* Rótulo de Recompensa */}
            <span className="absolute top-4 right-4 text-[9px] font-extrabold font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-850 text-neutral-500 dark:text-neutral-400">
              +{badge.xpReward} XP
            </span>

            {/* Ícone de Estado */}
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                badge.isUnlocked
                  ? 'bg-gradient-to-tr from-violet-500 to-indigo-600 text-white shadow-md'
                  : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-450 dark:text-neutral-500'
              }`}>
                {badge.isUnlocked ? renderBadgeIcon(badge.iconType, true) : <LockKeyhole className="w-6 h-6" />}
              </div>

              <div className="min-w-0 pr-12">
                <h3 className="text-base font-extrabold text-neutral-850 dark:text-white truncate">
                  {badge.name}
                </h3>
                <span className={`text-[9px] font-extrabold uppercase tracking-widest mt-1 block ${
                  badge.isUnlocked ? 'text-violet-600 dark:text-violet-400' : 'text-neutral-450'
                }`}>
                  {badge.isUnlocked ? 'Desbloqueada' : 'Bloqueada'}
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed min-h-[40px] mb-4">
              {badge.description}
            </p>

            {/* Progresso de Desbloqueio */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-neutral-400">Progresso</span>
                <span className="text-neutral-500 font-mono">{badge.progress} / {badge.target}</span>
              </div>
              <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-850 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    badge.isUnlocked ? 'bg-gradient-to-r from-violet-500 to-indigo-500' : 'bg-neutral-400 dark:bg-neutral-600'
                  }`}
                  style={{ width: `${Math.min(100, (badge.progress / badge.target) * 100)}%` }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Interativo de Ficha de Troféu */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-sm w-full p-8 rounded-3xl bg-neutral-900 border border-neutral-800 text-white text-center shadow-[0_0_50px_rgba(99,102,241,0.25)] flex flex-col items-center gap-6"
            >
              {/* Moldura Holográfica */}
              <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg relative ${
                selectedBadge.isUnlocked
                  ? 'bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 shadow-violet-500/30'
                  : 'bg-neutral-800 border border-neutral-700 text-neutral-500'
              }`}>
                {selectedBadge.isUnlocked ? renderBadgeIcon(selectedBadge.iconType, true) : <LockKeyhole className="w-10 h-10" />}
                
                {selectedBadge.isUnlocked && (
                  <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-emerald-500 border-2 border-neutral-900 flex items-center justify-center text-white">
                    <CheckCircle2 className="w-4.5 h-4.5" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-violet-400 uppercase tracking-widest block">// {selectedBadge.category.toUpperCase()}_LOG</span>
                <h2 className="text-2xl font-black tracking-tight">{selectedBadge.name}</h2>
                <p className="text-xs text-neutral-400 leading-relaxed max-w-xs px-2">
                  {selectedBadge.description}
                </p>
              </div>

              {/* Box de Progresso Detalhado */}
              <div className="w-full bg-neutral-950/50 border border-neutral-850 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-neutral-500">Métrica</span>
                  <span className="text-neutral-200 font-mono">{selectedBadge.progress} / {selectedBadge.target}</span>
                </div>
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedBadge.isUnlocked ? 'bg-gradient-to-r from-violet-500 to-cyan-400' : 'bg-neutral-600'
                    }`}
                    style={{ width: `${Math.min(100, (selectedBadge.progress / selectedBadge.target) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs pt-1 border-t border-neutral-800">
                  <span className="text-neutral-500">Recompensa</span>
                  <span className="text-amber-400 font-bold">+{selectedBadge.xpReward} XP de Carreira</span>
                </div>
              </div>

              <div className="w-full flex gap-3">
                {selectedBadge.isUnlocked ? (
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`Conquistei a medalha "${selectedBadge.name}" no DevFolio! 🏆`);
                      alert('Copiado para a área de transferência! Compartilhe nas suas redes sociais.');
                    }}
                    className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-violet-500/10 hover:shadow-violet-500/20"
                  >
                    Compartilhar Medalha
                  </button>
                ) : (
                  <Link
                    href={selectedBadge.category === 'frontend' || selectedBadge.category === 'backend' ? '/dashboard/projects' : '/dashboard/profile'}
                    onClick={() => setSelectedBadge(null)}
                    className="flex-1 py-3 rounded-xl bg-neutral-850 hover:bg-neutral-800 text-white text-xs font-bold transition-all text-center flex items-center justify-center"
                  >
                    Trabalhar na Quest
                  </Link>
                )}

                <button 
                  onClick={() => setSelectedBadge(null)}
                  className="py-3 px-5 rounded-xl bg-neutral-850 hover:bg-neutral-800 text-neutral-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
