'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { useProjects } from '@/features/projects/hooks/use-projects';
import { useExperiences } from '@/features/experiences/hooks/use-experiences';
import { useEducations } from '@/features/educations/hooks/use-educations';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

// Importando componentes gamificados
import DeveloperCard from '@/components/developer-card';
import { CardCustomizerPanel } from '@/features/dashboard/components/card-customizer-panel';
import { ShareCardPanel } from '@/features/dashboard/components/share-card-panel';
import { calculateOvr } from '@/features/gamification/domain/calculate-ovr';
import { TierEvolutionModal } from '@/features/dashboard/components/tier-evolution-modal';

export default function CardCustomizationPage() {
  const { user } = useAuth();
  const { projects, isLoading: projectsLoading } = useProjects();
  const { experiences, isLoading: experiencesLoading } = useExperiences();
  const { educations, isLoading: educationsLoading } = useEducations();

  const profile = user?.profile;
  const [isTierModalOpen, setIsTierModalOpen] = useState(false);

  // Calcula o OVR real do usuário
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

  const loading = projectsLoading || experiencesLoading || educationsLoading;

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 text-neutral-500">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold tracking-wider uppercase">Carregando customizador...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl animate-in fade-in duration-500 font-sans pb-10 space-y-6">
      {/* Botão Voltar */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para o Geral
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-violet-500 animate-pulse" />
          Customização do Developer Card
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          Equipe seus títulos, molduras de elo conquistadas, temas de fundo e efeitos visuais especiais.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
        {/* LADO ESQUERDO: PREVIEW DO CARD EM DESTAQUE */}
        <div className="lg:col-span-5 flex flex-col items-center gap-6 bg-neutral-50/50 dark:bg-neutral-950/20 border border-neutral-200 dark:border-neutral-850 p-6 md:p-8 rounded-3xl lg:sticky lg:top-8 shadow-inner">
          <span className="text-[10px] font-bold font-mono tracking-widest text-neutral-450 uppercase mb-2">
            Visualização 3D Interativa
          </span>
          {profile && (
            <DeveloperCard 
              profile={profile} 
              showDetails={false} 
              projects={projects}
              experiences={experiences}
              educations={educations}
            />
          )}

          {/* Painel de Compartilhamento Viral */}
          <ShareCardPanel profile={profile} className="w-full mt-4" />
        </div>

        {/* LADO DIREITO: CUSTOMIZADOR DE ESTILO */}
        <div className="lg:col-span-7">
          {profile && (
            <CardCustomizerPanel 
              profile={profile} 
              className="w-full border-none shadow-none p-0 bg-transparent" 
              onOpenTierModal={() => setIsTierModalOpen(true)}
            />
          )}
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
