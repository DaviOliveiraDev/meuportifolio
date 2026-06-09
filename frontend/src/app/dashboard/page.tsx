'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { useProjects } from '@/features/projects/hooks/use-projects';
import { useExperiences } from '@/features/experiences/hooks/use-experiences';
import { useEducations } from '@/features/educations/hooks/use-educations';
import { Sparkles, Link2, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Importando componentes gamificados modulares
import DeveloperCard from '@/components/developer-card';
import { LevelTracker } from '@/features/dashboard/components/level-tracker';
import { NextBestAction } from '@/features/dashboard/components/next-best-action';
import { QuestLog } from '@/features/dashboard/components/quest-log';
import { ProfileCompletionCard } from '@/features/dashboard/components/profile-completion-card';
import { AchievementsPreview } from '@/features/dashboard/components/achievements-preview';
import { OvrBreakdown } from '@/features/dashboard/components/ovr-breakdown';
import { ShareCardPanel } from '@/features/dashboard/components/share-card-panel';
import { CardCustomizerPanel } from '@/features/dashboard/components/card-customizer-panel';
import { calculateOvr } from '@/features/gamification/domain/calculate-ovr';
import { TierEvolutionModal } from '@/features/dashboard/components/tier-evolution-modal';

export default function DashboardPage() {
  const { user } = useAuth();
  const { projects, isLoading: projectsLoading } = useProjects();
  const { experiences, isLoading: experiencesLoading } = useExperiences();
  const { educations, isLoading: educationsLoading } = useEducations();

  const profile = user?.profile;
  const username = profile?.username || '';
  
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [isTierModalOpen, setIsTierModalOpen] = useState(false);
  
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

  // Calcula o OVR real do usuário no cliente para sincronizar com o modal de evolução
  const { ovr: calculatedOvr } = calculateOvr(
    {
      profile_completeness: profile?.profile_completeness || 0,
      github_url: profile?.github_url,
      experiences: experiences || [],
      projects: projects || [],
      skills: profile?.skills || [],
      badges: profile?.badges || [],
    },
    educations?.length || 0
  );

  // Carregamento inicial de dados
  const loading = projectsLoading || experiencesLoading || educationsLoading;

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 text-neutral-500">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold tracking-wider uppercase">Carregando painel de comando...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl animate-in fade-in duration-500 font-sans pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LADO ESQUERDO: PROGRESSÃO, MISSÕES E ATRIBUTOS (2 colunas) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Welcome Banner */}
          <div className="relative rounded-2xl overflow-hidden p-6 md:p-8 bg-gradient-to-br from-violet-50/90 via-indigo-50/40 to-white dark:from-violet-950/10 dark:via-indigo-950/5 dark:to-neutral-900 border border-violet-100 dark:border-neutral-850 shadow-sm">
            <div className="absolute right-0 bottom-0 opacity-[0.03] dark:opacity-[0.03] pointer-events-none">
              <Sparkles className="w-64 h-64 text-violet-600 dark:text-violet-500 animate-pulse" />
            </div>
            <div className="space-y-4 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-100/80 text-violet-800 border border-violet-200/50 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20">
                <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
                RPG de Carreira Ativo
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-neutral-55 tracking-tight">
                Olá, <span className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">{profile?.name || 'Desenvolvedor'}</span>!
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm font-medium">
                Sua jornada de evolução técnica está em andamento. Complete as missões de onboarding, sincronize seus commits diários e conquiste medalhas para subir de nível.
              </p>
              {username && (
                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href={`/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-sm font-semibold text-white transition-all cursor-pointer shadow-sm shadow-violet-500/10 hover:shadow-violet-500/20"
                  >
                    Ver Portfólio Público
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-neutral-50 dark:bg-neutral-950 dark:hover:bg-neutral-850 text-sm font-semibold text-neutral-700 dark:text-neutral-300 transition-all border border-neutral-200 dark:border-neutral-850 cursor-pointer shadow-sm"
                  >
                    <Link2 className="w-4 h-4" />
                    Copiar Link do Portfólio
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Level Tracker (XP Progress) */}
          <LevelTracker 
            level={profile?.level} 
            xp={profile?.xp} 
          />

          {/* Next Best Action (LinkedIn style checklist) */}
          <NextBestAction 
            profile={profile}
            projectsCount={projects.length}
            experiencesCount={experiences.length}
            educationsCount={educations.length}
            hasPdfResume={profile?.profile_completeness ? profile.profile_completeness >= 80 : false}
          />

          {/* Quest Log (Missões Diárias & Jornada) */}
          <QuestLog 
            profile={profile}
            projectsCount={projects.length}
            experiencesCount={experiences.length}
            educationsCount={educations.length}
            hasPdfResume={profile?.profile_completeness ? profile.profile_completeness >= 80 : false}
            streakDays={3} // Simula 3 dias de ofensiva do Duolingo
          />

          {/* OVR Breakdown (Radar Chart & Tips) */}
          <OvrBreakdown 
            profile={{
              ...profile,
              experiences,
              projects,
              badges: profile?.badges || []
            }}
            educationsCount={educations.length}
            onOpenTierModal={() => setIsTierModalOpen(true)}
          />
        </div>

        {/* LADO DIREITO: CARD VISUAL & COMPLETUDE (1 coluna) */}
        <div className="lg:col-span-1 lg:sticky lg:top-8 flex flex-col gap-6 items-center">
          <div className="w-full">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight mb-4 self-start">
              Seu Developer Card
            </h2>
            {profile && (
              <DeveloperCard 
                profile={profile} 
                showDetails={false} 
                projects={projects}
                experiences={experiences}
                educations={educations}
              />
            )}
          </div>

          {/* Customização de Estilo do Card */}
          {profile && (
            <CardCustomizerPanel 
              profile={profile} 
              className="w-full" 
              onOpenTierModal={() => setIsTierModalOpen(true)}
            />
          )}

          {/* Painel de Compartilhamento Viral */}
          <ShareCardPanel profile={profile} className="w-full" />

          {/* Completude do Perfil */}
          <ProfileCompletionCard
            completeness={profile?.profile_completeness}
            profile={profile}
            projectsCount={projects.length}
            experiencesCount={experiences.length}
            educationsCount={educations.length}
            hasPdfResume={profile?.profile_completeness ? profile.profile_completeness >= 80 : false}
            className="w-full"
          />

          {/* Badges & Conquistas */}
          <AchievementsPreview
            unlockedBadges={profile?.badges}
            projects={projects}
            skills={profile?.skills || []}
            githubUrl={profile?.github_url}
            className="w-full"
          />
        </div>

      </div>

      {profile && (
        <TierEvolutionModal
          isOpen={isTierModalOpen}
          onClose={() => setIsTierModalOpen(false)}
          currentOvr={calculatedOvr}
          profile={profile}
          projects={projects}
          experiences={experiences}
          educations={educations}
        />
      )}
    </div>
  );
}
