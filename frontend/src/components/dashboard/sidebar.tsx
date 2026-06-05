'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  User, 
  FolderGit2, 
  Briefcase, 
  GraduationCap, 
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth/hooks/use-auth';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  
  const menuItems = [
    { name: 'Geral', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Perfil', href: '/dashboard/profile', icon: User },
    { name: 'Projetos', href: '/dashboard/projects', icon: FolderGit2 },
    { name: 'Experiências', href: '/dashboard/experiences', icon: Briefcase },
    { name: 'Formação', href: '/dashboard/educations', icon: GraduationCap },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-850 p-6 flex-shrink-0">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white text-lg">
          D
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
          DevFolio
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-violet-600/10 text-violet-600 dark:bg-violet-600/15 dark:text-violet-400 border border-violet-500/10 dark:border-violet-500/20" 
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800/50"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-violet-600 dark:text-violet-400" : "text-neutral-500 dark:text-neutral-400")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {user?.profile?.username && (
        <div className="mt-auto pt-6 border-t border-neutral-200 dark:border-neutral-850">
          <a
            href={`/${user.profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-850 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-300 text-xs font-semibold transition-colors"
          >
            <Globe className="w-4 h-4" />
            Ver Portfólio Público
          </a>
        </div>
      )}
    </aside>
  );
}
