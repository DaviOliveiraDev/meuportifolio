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

export function Header() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-850 h-16 flex items-center justify-between px-6 z-30 relative">
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
