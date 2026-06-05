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
    <div className="space-y-8 max-w-5xl animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden p-6 md:p-8 bg-gradient-to-r from-violet-950/30 via-indigo-950/10 to-transparent border border-violet-500/10 backdrop-blur-sm">
        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
          <Sparkles className="w-64 h-64 text-violet-500 animate-pulse" />
        </div>
        <div className="space-y-4 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
            Seu Painel de Controle
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-50 tracking-tight">
            Bem-vindo ao <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">DevFolio</span>, {profile?.name || 'Desenvolvedor'}!
          </h1>
          <p className="text-neutral-400 leading-relaxed text-sm md:text-base">
            Aqui você gerencia seu portfólio de forma rápida e intuitiva. Adicione seus projetos de maior orgulho, organize seu histórico profissional e escolha um tema incrível.
          </p>
          {username && (
            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={`/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-sm font-semibold text-white transition-colors cursor-pointer"
              >
                Ver Portfólio
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-sm font-semibold text-neutral-300 transition-colors border border-neutral-850 cursor-pointer"
              >
                <Link2 className="w-4 h-4" />
                Copiar Link
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Projects count */}
        <Card className="bg-neutral-900/30 border-neutral-850 hover:border-violet-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Projetos</span>
            <FolderGit2 className="w-5 h-5 text-violet-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-neutral-100">
              {projectsLoading ? (
                <div className="h-8 w-12 bg-neutral-800 animate-pulse rounded"></div>
              ) : projects.length}
            </div>
            <p className="text-xs text-neutral-500 mt-1.5">
              {projects.filter(p => p.is_featured).length} destacados (máx. 3)
            </p>
          </CardContent>
        </Card>

        {/* Experience count */}
        <Card className="bg-neutral-900/30 border-neutral-850 hover:border-violet-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Experiências</span>
            <Briefcase className="w-5 h-5 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-neutral-100">
              {experiencesLoading ? (
                <div className="h-8 w-12 bg-neutral-800 animate-pulse rounded"></div>
              ) : experiences.length}
            </div>
            <p className="text-xs text-neutral-500 mt-1.5">
              Atividades profissionais salvas
            </p>
          </CardContent>
        </Card>

        {/* Education count */}
        <Card className="bg-neutral-900/30 border-neutral-850 hover:border-violet-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Formação</span>
            <GraduationCap className="w-5 h-5 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-neutral-100">
              {educationsLoading ? (
                <div className="h-8 w-12 bg-neutral-800 animate-pulse rounded"></div>
              ) : educations.length}
            </div>
            <p className="text-xs text-neutral-500 mt-1.5">
              Cursos e graduações
            </p>
          </CardContent>
        </Card>

        {/* Selected Theme */}
        <Card className="bg-neutral-900/30 border-neutral-850 hover:border-violet-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Tema Ativo</span>
            <Palette className="w-5 h-5 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-neutral-100 capitalize">
              {profile?.theme_name || 'minimalist'}
            </div>
            <p className="text-xs text-neutral-500 mt-1.5">
              Estilo visual do portfólio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-neutral-100">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/dashboard/profile" className="group">
            <div className="flex items-center justify-between p-5 rounded-xl bg-neutral-900/20 hover:bg-neutral-900/50 border border-neutral-850 hover:border-neutral-800 transition-all duration-300">
              <div className="space-y-1">
                <h3 className="font-semibold text-neutral-200 group-hover:text-violet-400 transition-colors">Completar Perfil</h3>
                <p className="text-sm text-neutral-500">Adicione sua bio, localização, redes sociais e foto.</p>
              </div>
              <ArrowRight className="w-5 h-5 text-neutral-500 group-hover:text-violet-400 group-hover:translate-x-1.5 transition-all duration-300" />
            </div>
          </Link>

          <Link href="/dashboard/projects" className="group">
            <div className="flex items-center justify-between p-5 rounded-xl bg-neutral-900/20 hover:bg-neutral-900/50 border border-neutral-850 hover:border-neutral-800 transition-all duration-300">
              <div className="space-y-1">
                <h3 className="font-semibold text-neutral-200 group-hover:text-violet-400 transition-colors">Gerenciar Projetos</h3>
                <p className="text-sm text-neutral-500">Crie, edite e selecione seus projetos de maior relevância.</p>
              </div>
              <ArrowRight className="w-5 h-5 text-neutral-500 group-hover:text-violet-400 group-hover:translate-x-1.5 transition-all duration-300" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
