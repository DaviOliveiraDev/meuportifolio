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
    <aside className="hidden md:flex flex-col w-64 bg-neutral-900 border-r border-neutral-800 p-6 flex-shrink-0">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white text-lg">
          D
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
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
                  ? "bg-violet-600/15 text-violet-400 border border-violet-500/20" 
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-violet-400" : "text-neutral-400")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {user?.profile?.username && (
        <div className="mt-auto pt-6 border-t border-neutral-800">
          <a
            href={`/${user.profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold transition-colors text-neutral-300"
          >
            <Globe className="w-4 h-4" />
            Ver Portfólio Público
          </a>
        </div>
      )}
    </aside>
  );
}
