'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
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
  LockKeyhole,
  Bookmark,
  Share2,
  Eye,
  EyeOff,
  Keyboard,
  Coffee,
  BookmarkCheck,
  MousePointerClick,
  Gamepad2,
  HeartHandshake,
  Download,
  BookOpen,
  Mail,
  Network
} from 'lucide-react';
import Link from 'next/link';

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  rarity: 'comum' | 'rara' | 'epica' | 'lendaria' | 'mitica';
  xp_reward: number;
  icon_path: string;
  is_secret: boolean;
  unlocked: boolean;
  current_value: number;
  target_value: number;
}

export default function AchievementsPage() {
  const { user, isLoading: authLoading } = useAuth();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const { data: achievements = [], isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ['profile-achievements'],
    queryFn: async () => {
      const response = await apiClient.get('/profile/achievements');
      return response.data.achievements;
    }
  });

  const loading = authLoading || achievementsLoading;

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 text-neutral-500">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold tracking-wider uppercase text-neutral-450">Abrindo a Galeria de Troféus...</span>
      </div>
    );
  }

  // Filter out locked secrets
  const visibleAchievements = achievements.filter(a => !a.is_secret || a.unlocked);

  const filteredAchievements = selectedCategory === 'all' 
    ? visibleAchievements 
    : visibleAchievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  
  const totalXpAwarded = achievements
    .filter(a => a.unlocked)
    .reduce((acc, curr) => acc + curr.xp_reward, 0);

  // Dynamic Lucide icon rendering based on path
  const renderBadgeIcon = (iconPath: string, isUnlocked: boolean) => {
    const colorClass = isUnlocked ? "text-amber-300 animate-pulse" : "text-neutral-400";
    
    switch (iconPath.toLowerCase()) {
      case 'user-check': return <CheckCircle2 className={`w-8 h-8 ${colorClass}`} />;
      case 'palette': return <Award className={`w-8 h-8 ${colorClass}`} />;
      case 'globe': return <Globe className={`w-8 h-8 ${colorClass}`} />;
      case 'map-pin': return <Award className={`w-8 h-8 ${colorClass}`} />;
      case 'camera': return <Award className={`w-8 h-8 ${colorClass}`} />;
      case 'star': return <Trophy className={`w-8 h-8 ${colorClass}`} />;
      case 'award': return <Award className={`w-8 h-8 ${colorClass}`} />;
      case 'moon': return <Award className={`w-8 h-8 ${colorClass}`} />;
      case 'heading': return <Award className={`w-8 h-8 ${colorClass}`} />;
      case 'briefcase': return <Trophy className={`w-8 h-8 ${colorClass}`} />;
      case 'folder-plus': return <Flame className={`w-8 h-8 ${colorClass}`} />;
      case 'folder-kanban': return <Flame className={`w-8 h-8 ${colorClass}`} />;
      case 'layers': return <Server className={`w-8 h-8 ${colorClass}`} />;
      case 'box': return <Server className={`w-8 h-8 ${colorClass}`} />;
      case 'image': return <Award className={`w-8 h-8 ${colorClass}`} />;
      case 'eye': return <Eye className={`w-8 h-8 ${colorClass}`} />;
      case 'pin': return <Award className={`w-8 h-8 ${colorClass}`} />;
      case 'file-text': return <Award className={`w-8 h-8 ${colorClass}`} />;
      case 'gem': return <Sparkles className={`w-8 h-8 ${colorClass}`} />;
      case 'bug': return <Terminal className={`w-8 h-8 ${colorClass}`} />;
      case 'github': return <Code2 className={`w-8 h-8 ${colorClass}`} />;
      case 'refresh-cw': return <Code2 className={`w-8 h-8 ${colorClass}`} />;
      case 'git-commit': return <Code2 className={`w-8 h-8 ${colorClass}`} />;
      case 'activity': return <Code2 className={`w-8 h-8 ${colorClass}`} />;
      case 'server': return <Server className={`w-8 h-8 ${colorClass}`} />;
      case 'hammer': return <Code2 className={`w-8 h-8 ${colorClass}`} />;
      case 'star-half': return <Trophy className={`w-8 h-8 ${colorClass}`} />;
      case 'flame': return <Flame className={`w-8 h-8 ${colorClass}`} />;
      case 'zap': return <Sparkles className={`w-8 h-8 ${colorClass}`} />;
      case 'git-branch': return <Code2 className={`w-8 h-8 ${colorClass}`} />;
      case 'atom': return <Code2 className={`w-8 h-8 ${colorClass}`} />;
      case 'ship': return <Server className={`w-8 h-8 ${colorClass}`} />;
      case 'git-merge': return <Code2 className={`w-8 h-8 ${colorClass}`} />;
      case 'workflow': return <Terminal className={`w-8 h-8 ${colorClass}`} />;
      case 'cloud': return <Globe className={`w-8 h-8 ${colorClass}`} />;
      case 'binary': return <Terminal className={`w-8 h-8 ${colorClass}`} />;
      case 'building-2': return <Award className={`w-8 h-8 ${colorClass}`} />;
      case 'building': return <Award className={`w-8 h-8 ${colorClass}`} />;
      case 'history': return <Award className={`w-8 h-8 ${colorClass}`} />;
      case 'clock': return <Award className={`w-8 h-8 ${colorClass}`} />;
      case 'shield-alert': return <Trophy className={`w-8 h-8 ${colorClass}`} />;
      case 'globe-2': return <Globe className={`w-8 h-8 ${colorClass}`} />;
      case 'crown': return <Trophy className={`w-8 h-8 ${colorClass}`} />;
      case 'file-down': return <Award className={`w-8 h-8 ${colorClass}`} />;
      case 'check-square': return <CheckCircle2 className={`w-8 h-8 ${colorClass}`} />;
      case 'sparkles': return <Sparkles className={`w-8 h-8 ${colorClass}`} />;
      case 'contact': return <Award className={`w-8 h-8 ${colorClass}`} />;
      case 'trending-up': return <Trophy className={`w-8 h-8 ${colorClass}`} />;
      case 'shield': return <Trophy className={`w-8 h-8 ${colorClass}`} />;
      case 'zap-off': return <Sparkles className={`w-8 h-8 ${colorClass}`} />;
      case 'share-2': return <Share2 className={`w-8 h-8 ${colorClass}`} />;
      case 'users': return <Share2 className={`w-8 h-8 ${colorClass}`} />;
      case 'compass': return <Globe className={`w-8 h-8 ${colorClass}`} />;
      case 'heart': return <Trophy className={`w-8 h-8 ${colorClass}`} />;
      case 'flame-kindling': return <Flame className={`w-8 h-8 ${colorClass}`} />;
      case 'coffee': return <Coffee className={`w-8 h-8 ${colorClass}`} />;
      case 'infinity': return <Code2 className={`w-8 h-8 ${colorClass}`} />;
      case 'mouse-pointer-click': return <MousePointerClick className={`w-8 h-8 ${colorClass}`} />;
      case 'gamepad-2': return <Gamepad2 className={`w-8 h-8 ${colorClass}`} />;
      case 'heart-handshake': return <HeartHandshake className={`w-8 h-8 ${colorClass}`} />;
      case 'alert-triangle': return <Award className={`w-8 h-8 ${colorClass}`} />;
      case 'moon-star': return <Award className={`w-8 h-8 ${colorClass}`} />;
      case 'calendar-days': return <Award className={`w-8 h-8 ${colorClass}`} />;
      case 'network': return <Network className={`w-8 h-8 ${colorClass}`} />;
      case 'languages': return <Globe className={`w-8 h-8 ${colorClass}`} />;
      case 'download': return <Download className={`w-8 h-8 ${colorClass}`} />;
      case 'book-open': return <BookOpen className={`w-8 h-8 ${colorClass}`} />;
      case 'mail': return <Mail className={`w-8 h-8 ${colorClass}`} />;
      case 'eye-off': return <EyeOff className={`w-8 h-8 ${colorClass}`} />;
      case 'keyboard': return <Keyboard className={`w-8 h-8 ${colorClass}`} />;
      default: return <Award className={`w-8 h-8 ${colorClass}`} />;
    }
  };

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'Onboarding', label: 'Jornada' },
    { id: 'Projects', label: 'Projetos' },
    { id: 'GitHub', label: 'GitHub' },
    { id: 'Developer Stack', label: 'Tecnologias' },
    { id: 'Career', label: 'Carreira' },
    { id: 'Resume', label: 'Currículo' },
    { id: 'Streaks', label: 'Consistência' },
    { id: 'Card', label: 'Card & OVR' },
    { id: 'Community', label: 'Comunidade' },
    { id: 'Secrets', label: 'Segredos' },
  ];

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
              {unlockedCount} <span className="text-sm font-medium text-neutral-450">/ {achievements.length}</span>
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
              {achievements.length > 0 ? Math.round((unlockedCount / achievements.length) * 100) : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Filtros e Categorias */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-neutral-200 dark:border-neutral-850">
        {categories.map((cat) => {
          // Hide Secrets category button if they have 0 unlocked secrets
          if (cat.id === 'Secrets' && achievements.filter(a => a.category === 'Secrets' && a.unlocked).length === 0) {
            return null;
          }

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`py-2 px-3.5 rounded-xl text-[11px] font-extrabold tracking-wide cursor-pointer transition-all ${
                selectedCategory === cat.id 
                  ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/20' 
                  : 'bg-white hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-850 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-850'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Grid de Cards (Álbum) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredAchievements.map((badge) => (
          <motion.div
            key={badge.id}
            whileHover={{ y: -4 }}
            onClick={() => setSelectedAchievement(badge)}
            className={`relative p-5 rounded-2xl cursor-pointer transition-all border ${
              badge.unlocked
                ? 'bg-gradient-to-br from-white via-white to-violet-500/5 dark:from-neutral-900 dark:via-neutral-900 dark:to-violet-500/5 border-violet-500/20 dark:border-violet-500/35 hover:shadow-[0_8px_30px_rgba(99,102,241,0.12)]'
                : 'bg-neutral-50/70 dark:bg-neutral-900/30 border-neutral-200 dark:border-neutral-850/60 opacity-80 hover:opacity-100'
            }`}
          >
            {/* Rótulo de Recompensa */}
            <span className="absolute top-4 right-4 text-[9px] font-extrabold font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-850 text-neutral-500 dark:text-neutral-400">
              +{badge.xp_reward} XP
            </span>

            {/* Ícone de Estado */}
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                badge.unlocked
                  ? 'bg-gradient-to-tr from-violet-500 to-indigo-600 text-white shadow-md'
                  : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-450 dark:text-neutral-500'
              }`}>
                {badge.unlocked ? renderBadgeIcon(badge.icon_path, true) : <LockKeyhole className="w-6 h-6" />}
              </div>

              <div className="min-w-0 pr-12">
                <h3 className="text-base font-extrabold text-neutral-850 dark:text-white truncate">
                  {badge.name}
                </h3>
                <span className={`text-[9px] font-extrabold uppercase tracking-widest mt-1 block ${
                  badge.unlocked ? 'text-violet-600 dark:text-violet-400' : 'text-neutral-450'
                }`}>
                  {badge.unlocked ? 'Desbloqueada' : 'Bloqueada'}
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
                <span className="text-neutral-500 font-mono">{badge.current_value} / {badge.target_value}</span>
              </div>
              <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-850 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    badge.unlocked ? 'bg-gradient-to-r from-violet-500 to-indigo-500' : 'bg-neutral-400 dark:bg-neutral-600'
                  }`}
                  style={{ width: `${Math.min(100, (badge.current_value / badge.target_value) * 100)}%` }}
                />
              </div>
            </div>
          </motion.div>
        ))}

        {filteredAchievements.length === 0 && (
          <div className="col-span-full py-12 text-center text-neutral-500 italic text-sm">
            Nenhuma conquista encontrada nesta categoria.
          </div>
        )}
      </div>

      {/* Modal Interativo de Ficha de Troféu */}
      <AnimatePresence>
        {selectedAchievement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-sm w-full p-8 rounded-3xl bg-neutral-900 border border-neutral-800 text-white text-center shadow-[0_0_50px_rgba(99,102,241,0.25)] flex flex-col items-center gap-6"
            >
              {/* Moldura Holográfica */}
              <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg relative ${
                selectedAchievement.unlocked
                  ? 'bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 shadow-violet-500/30'
                  : 'bg-neutral-800 border border-neutral-700 text-neutral-500'
              }`}>
                {selectedAchievement.unlocked ? renderBadgeIcon(selectedAchievement.icon_path, true) : <LockKeyhole className="w-10 h-10" />}
                
                {selectedAchievement.unlocked && (
                  <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-emerald-500 border-2 border-neutral-900 flex items-center justify-center text-white">
                    <CheckCircle2 className="w-4.5 h-4.5" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-violet-400 uppercase tracking-widest block">// {selectedAchievement.category.toUpperCase()}_LOG</span>
                <h2 className="text-2xl font-black tracking-tight">{selectedAchievement.name}</h2>
                <p className="text-xs text-neutral-400 leading-relaxed max-w-xs px-2">
                  {selectedAchievement.description}
                </p>
              </div>

              {/* Box de Progresso Detalhado */}
              <div className="w-full bg-neutral-950/50 border border-neutral-850 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-neutral-500">Métrica</span>
                  <span className="text-neutral-200 font-mono">{selectedAchievement.current_value} / {selectedAchievement.target_value}</span>
                </div>
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedAchievement.unlocked ? 'bg-gradient-to-r from-violet-500 to-cyan-400' : 'bg-neutral-600'
                    }`}
                    style={{ width: `${Math.min(100, (selectedAchievement.current_value / selectedAchievement.target_value) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs pt-1 border-t border-neutral-800">
                  <span className="text-neutral-500">Recompensa</span>
                  <span className="text-amber-400 font-bold">+{selectedAchievement.xp_reward} XP de Carreira</span>
                </div>
              </div>

              <div className="w-full flex gap-3">
                {selectedAchievement.unlocked ? (
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`Conquistei a medalha "${selectedAchievement.name}" no DevFolio! 🏆`);
                      alert('Copiado para a área de transferência! Compartilhe nas suas redes sociais.');
                    }}
                    className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-violet-500/10 hover:shadow-violet-500/20"
                  >
                    Compartilhar
                  </button>
                ) : (
                  <Link
                    href={selectedAchievement.category === 'Developer Stack' || selectedAchievement.category === 'Projects' ? '/dashboard/projects' : '/dashboard/profile'}
                    onClick={() => setSelectedAchievement(null)}
                    className="flex-1 py-3 rounded-xl bg-neutral-850 hover:bg-neutral-800 text-white text-xs font-bold transition-all text-center flex items-center justify-center"
                  >
                    Trabalhar na Quest
                  </Link>
                )}

                <button 
                  onClick={() => setSelectedAchievement(null)}
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
