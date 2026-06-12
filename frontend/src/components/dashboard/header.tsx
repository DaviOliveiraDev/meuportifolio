'use client';

import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { 
  LogOut, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  LayoutDashboard, 
  User as UserIcon, 
  FolderGit2, 
  Briefcase, 
  GraduationCap, 
  Globe,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useDopamineLoop } from '@/features/gamification/contexts/dopamine-context';
import { calculateLevelProgress } from '@/features/gamification/lib/calculate-level';
import { motion } from 'framer-motion';

export function Header() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { isAnimating, animatingXp, animatingLevel } = useDopamineLoop();
  
  const actualXp = user?.profile?.xp || 0;
  const actualLevel = user?.profile?.level || 1;

  const currentXp = isAnimating ? animatingXp : actualXp;
  const currentLevel = isAnimating ? animatingLevel : actualLevel;

  const progress = calculateLevelProgress(currentLevel, currentXp);
  const xpInCurrentLevel = progress.xpInCurrentLevel;
  const xpForNext = progress.xpForNext;
  const percentage = progress.percentage;

  const menuItems = [
    { name: 'Geral', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Developer Card', href: '/dashboard/card', icon: Sparkles },
    { name: 'Perfil', href: '/dashboard/profile', icon: UserIcon },
    { name: 'Projetos', href: '/dashboard/projects', icon: FolderGit2 },
    { name: 'Experiências', href: '/dashboard/experiences', icon: Briefcase },
    { name: 'Formação', href: '/dashboard/educations', icon: GraduationCap },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Desconectado com sucesso!');
      router.push('/login');
    } catch (error) {
      toast.error('Erro ao desconectar.');
    }
  };

  return (
    <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-855 h-16 flex items-center justify-between px-6 z-30 relative">
      {/* Mobile Menu Toggle & Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-250 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className="flex items-center gap-2 md:hidden">
          <div className="w-7 h-7 rounded bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white text-sm">
            D
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
            DevFolio
          </span>
        </div>
      </div>

      {/* User profile & Actions */}
      <div className="flex items-center gap-4 ml-auto">
        {user?.profile && (
          <div className="hidden md:flex items-center gap-3 bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-850 px-4 py-1.5 rounded-xl max-w-xs w-60 mr-2 shadow-inner">
            <div className="flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg w-7 h-7 text-white font-black text-xs shadow-sm">
              L{currentLevel}
            </div>
            <div className="flex-1 space-y-0.5 min-w-0">
              <div className="flex justify-between text-[9px] font-bold text-neutral-450 dark:text-neutral-500 uppercase tracking-wider leading-none">
                <span>XP do Nível</span>
                <span className="font-mono">{xpInCurrentLevel} / {xpForNext} XP</span>
              </div>
              <div className="relative h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden border border-neutral-300/10 dark:border-neutral-900/40">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: isAnimating ? 0.05 : 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 rounded-full relative"
                >
                  {/* Liquid shimmer overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)] bg-[size:120px_100%] animate-shimmer" 
                       style={{
                         animation: 'shimmer 2.2s infinite linear',
                         backgroundImage: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
                         backgroundSize: '200% 100%'
                       }}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        )}

        <span className="hidden sm:inline text-sm text-neutral-500 dark:text-neutral-400">
          Olá, <strong className="text-neutral-800 dark:text-neutral-200 font-semibold">{user?.profile?.name || user?.email}</strong>
        </span>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          title="Alternar Tema"
        >
          <Sun className="w-5 h-5 hidden dark:block text-yellow-400" />
          <Moon className="w-5 h-5 block dark:hidden text-violet-450" />
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-red-650 hover:text-red-500 hover:bg-red-50 dark:text-red-450 dark:hover:text-red-400 dark:hover:bg-red-950/20 px-3 py-2 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 p-4 space-y-1 shadow-lg dark:shadow-xl md:hidden flex flex-col z-50 animate-in slide-in-from-top duration-200">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-violet-600/10 text-violet-600 dark:bg-violet-600/15 dark:text-violet-400" 
                    : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800/50"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
          {user?.profile?.username && (
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 mt-2">
              <a
                href={`/${user.profile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-850 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-300 text-xs font-semibold"
              >
                <Globe className="w-4 h-4" />
                Ver Portfólio Público
              </a>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
