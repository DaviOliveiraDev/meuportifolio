'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (!user?.is_admin) {
        // Redireciona usuários comuns para o dashboard
        router.push('/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-400 text-sm font-medium">Carregando painel de controle...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user?.is_admin) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-neutral-50/50 dark:bg-background">
          <div className="mb-6 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-850 pb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5.5 h-5.5 text-amber-500" />
              <h2 className="text-lg font-bold tracking-tight text-neutral-850 dark:text-white uppercase">
                Painel Administrativo
              </h2>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/scoring"
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-350 transition-colors"
              >
                Pesos OVR
              </Link>
              <Link
                href="/admin/moderation"
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-350 transition-colors"
              >
                Fila de Moderação
              </Link>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
