'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { useProjects } from '@/features/projects/hooks/use-projects';
import { useExperiences } from '@/features/experiences/hooks/use-experiences';
import { useEducations } from '@/features/educations/hooks/use-educations';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  FolderGit2, 
  Briefcase, 
  GraduationCap, 
  Palette, 
  ArrowRight, 
  Sparkles,
  Link2,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { user } = useAuth();
  const { projects, isLoading: projectsLoading } = useProjects();
  const { experiences, isLoading: experiencesLoading } = useExperiences();
  const { educations, isLoading: educationsLoading } = useEducations();

  const profile = user?.profile;
  const username = profile?.username || '';
  
  const [portfolioUrl, setPortfolioUrl] = useState('');
  
  useEffect(() => {
    if (typeof window !== 'undefined' && username) {
      setPortfolioUrl(`${window.location.protocol}//${window.location.host}/${username}`);
    }
  }, [username]);

  const handleCopyLink = () => {
    if (portfolioUrl) {
      navigator.clipboard.writeText(portfolioUrl);
      toast.success('Link do portfólio copiado!');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl animate-in fade-in duration-500 font-sans">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden p-6 md:p-8 bg-gradient-to-br from-violet-50/90 via-indigo-50/40 to-white dark:from-violet-950/20 dark:via-indigo-950/5 dark:to-neutral-905 border border-violet-100 dark:border-neutral-850 shadow-sm">
        <div className="absolute right-0 bottom-0 opacity-[0.03] dark:opacity-[0.03] pointer-events-none">
          <Sparkles className="w-64 h-64 text-violet-600 dark:text-violet-500 animate-pulse" />
        </div>
        <div className="space-y-4 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-100/80 text-violet-800 border border-violet-200/50 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
            Seu Painel de Controle
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">
            Bem-vindo ao <span className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">DevFolio</span>, {profile?.name || 'Desenvolvedor'}!
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm md:text-base font-medium">
            Aqui você gerencia seu portfólio de forma rápida e intuitiva. Adicione seus projetos de maior orgulho, organize seu histórico profissional e escolha um tema incrível.
          </p>
          {username && (
            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={`/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-sm font-semibold text-white transition-all cursor-pointer shadow-sm shadow-violet-500/10 hover:shadow-violet-500/20"
              >
                Ver Portfólio
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-sm font-semibold text-neutral-700 dark:text-neutral-300 transition-all border border-neutral-200 dark:border-neutral-850 cursor-pointer shadow-sm"
              >
                <Link2 className="w-4 h-4" />
                Copiar Link
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Projects count */}
        <Card className="relative overflow-hidden bg-white border border-neutral-200/80 hover:border-violet-500/30 dark:bg-neutral-900/30 dark:border-neutral-850 dark:hover:border-violet-500/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/[0.02] transition-all duration-300 shadow-sm shadow-neutral-100/40">
          <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Projetos</span>
            <div className="p-2 rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
              <FolderGit2 className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="text-4xl font-black text-neutral-950 dark:text-neutral-50 tracking-tight">
              {projectsLoading ? (
                <div className="h-9 w-12 bg-neutral-150 dark:bg-neutral-800 animate-pulse rounded"></div>
              ) : projects.length}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 font-medium">
              {projects.filter(p => p.is_featured).length} destacados (máx. 3)
            </p>
          </CardContent>
        </Card>

        {/* Experience count */}
        <Card className="relative overflow-hidden bg-white border border-neutral-200/80 hover:border-emerald-500/30 dark:bg-neutral-900/30 dark:border-neutral-850 dark:hover:border-emerald-500/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/[0.02] transition-all duration-300 shadow-sm shadow-neutral-100/40">
          <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Experiências</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <Briefcase className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="text-4xl font-black text-neutral-950 dark:text-neutral-50 tracking-tight">
              {experiencesLoading ? (
                <div className="h-9 w-12 bg-neutral-150 dark:bg-neutral-800 animate-pulse rounded"></div>
              ) : experiences.length}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 font-medium">
              Atividades profissionais salvas
            </p>
          </CardContent>
        </Card>

        {/* Education count */}
        <Card className="relative overflow-hidden bg-white border border-neutral-200/80 hover:border-cyan-500/30 dark:bg-neutral-900/30 dark:border-neutral-850 dark:hover:border-cyan-500/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/[0.02] transition-all duration-300 shadow-sm shadow-neutral-100/40">
          <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Formação</span>
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
              <GraduationCap className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="text-4xl font-black text-neutral-950 dark:text-neutral-50 tracking-tight">
              {educationsLoading ? (
                <div className="h-9 w-12 bg-neutral-150 dark:bg-neutral-800 animate-pulse rounded"></div>
              ) : educations.length}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 font-medium">
              Cursos e graduações
            </p>
          </CardContent>
        </Card>

        {/* Selected Theme */}
        <Card className="relative overflow-hidden bg-white border border-neutral-200/80 hover:border-amber-500/30 dark:bg-neutral-900/30 dark:border-neutral-850 dark:hover:border-amber-500/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/[0.02] transition-all duration-300 shadow-sm shadow-neutral-100/40">
          <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Tema Ativo</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              <Palette className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="text-3xl font-black text-neutral-950 dark:text-neutral-50 tracking-tight capitalize">
              {profile?.theme_name || 'minimalist'}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2.5 font-medium">
              Estilo visual do portfólio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-55 tracking-tight">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Link href="/dashboard/profile" className="group">
            <div className="flex items-center justify-between p-6 rounded-xl bg-white hover:bg-neutral-50/50 dark:bg-neutral-900/10 dark:hover:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-850 hover:border-violet-500/30 dark:hover:border-violet-500/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/[0.02] transition-all duration-300 shadow-sm shadow-neutral-100/40">
              <div className="space-y-2">
                <h3 className="font-bold text-neutral-850 dark:text-neutral-205 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors text-base">Completar Perfil</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">Adicione sua bio, localização, redes sociais e foto.</p>
              </div>
              <ArrowRight className="w-5 h-5 text-neutral-450 group-hover:text-violet-600 dark:group-hover:text-violet-400 group-hover:translate-x-2 transition-all duration-300" />
            </div>
          </Link>

          <Link href="/dashboard/projects" className="group">
            <div className="flex items-center justify-between p-6 rounded-xl bg-white hover:bg-neutral-50/50 dark:bg-neutral-900/10 dark:hover:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-850 hover:border-violet-500/30 dark:hover:border-violet-500/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/[0.02] transition-all duration-300 shadow-sm shadow-neutral-100/40">
              <div className="space-y-2">
                <h3 className="font-bold text-neutral-850 dark:text-neutral-205 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors text-base">Gerenciar Projetos</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">Crie, edite e selecione seus projetos de maior relevância.</p>
              </div>
              <ArrowRight className="w-5 h-5 text-neutral-450 group-hover:text-violet-600 dark:group-hover:text-violet-400 group-hover:translate-x-2 transition-all duration-300" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
