'use client';

import { Sparkles, ArrowRight, FolderGit2, Briefcase, GraduationCap, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface GuidedOnboardingProps {
  projectsCount: number;
  experiencesCount: number;
  educationsCount: number;
}

export function GuidedOnboarding({
  projectsCount = 0,
  experiencesCount = 0,
  educationsCount = 0,
}: GuidedOnboardingProps) {
  const totalEvidences = projectsCount + experiencesCount + educationsCount;
  const isCompleted = totalEvidences >= 3;

  if (isCompleted) {
    return null; // Não exibe se já tiver 3 ou mais evidências
  }

  const steps = [
    {
      title: 'Adicionar Projetos / Sync GitHub',
      description: 'Importe seus repositórios reais ou adicione seus projetos manuais.',
      count: projectsCount,
      href: '/dashboard/projects',
      icon: FolderGit2,
      label: projectsCount > 0 ? `${projectsCount} cadastrado(s)` : 'Pendente',
    },
    {
      title: 'Adicionar Experiência Profissional',
      description: 'Registre seus cargos anteriores, freelances ou bootcamps práticos.',
      count: experiencesCount,
      href: '/dashboard/experiences',
      icon: Briefcase,
      label: experiencesCount > 0 ? `${experiencesCount} cadastrado(s)` : 'Pendente',
    },
    {
      title: 'Adicionar Formação ou Curso',
      description: 'Informe seus cursos técnicos, graduações ou certificações obtidas.',
      count: educationsCount,
      href: '/dashboard/educations',
      icon: GraduationCap,
      label: educationsCount > 0 ? `${educationsCount} cadastrado(s)` : 'Pendente',
    },
  ];

  const progressPercent = Math.min(100, Math.round((totalEvidences / 3) * 100));

  return (
    <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/[0.04] via-indigo-500/[0.02] to-transparent p-6 dark:border-violet-500/10 dark:from-violet-950/20 dark:via-indigo-950/5 dark:to-neutral-900 shadow-md animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Elementos visuais decorativos de fundo */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-200/50 dark:border-neutral-800/50">
        <div className="space-y-2 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-100 text-violet-850 dark:bg-violet-950 dark:text-violet-400 border border-violet-200 dark:border-violet-850">
            <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 animate-pulse" />
            Ativação do Motor de Reputação OVR V2
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">
            Desbloqueie seu Perfil de Reputação OVR
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
            O novo motor profissional do DevFolio analisa dados físicos e verídicos de suas evidências (commits, linguagens, escopos, tempos de mercado e produções) para calcular seu OVR. Adicione no mínimo <strong className="text-violet-600 dark:text-violet-450">3 evidências</strong> para desbloquear seu DNA Profile e seu OVR calculado.
          </p>
        </div>

        {/* Indicador de progresso */}
        <div className="flex flex-col items-center md:items-end justify-center gap-2 flex-shrink-0 bg-white/50 dark:bg-neutral-950/45 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm min-w-[160px]">
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest leading-none">Progresso</span>
          <span className="text-3xl font-black text-neutral-850 dark:text-neutral-200 leading-none mt-1">
            {totalEvidences} <span className="text-lg font-bold text-neutral-450">/ 3</span>
          </span>
          <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2 overflow-hidden mt-1.5">
            <div 
              className="bg-gradient-to-r from-violet-600 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[10px] font-semibold text-neutral-500 mt-1">
            {progressPercent}% concluído
          </span>
        </div>
      </div>

      {/* Grid de passos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const done = step.count > 0;

          return (
            <Link
              key={index}
              href={step.href}
              className={`group relative flex flex-col justify-between p-4 rounded-xl border transition-all duration-300 ${
                done
                  ? 'bg-neutral-50/50 dark:bg-neutral-950/20 border-neutral-200 dark:border-neutral-800 opacity-90'
                  : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-850 hover:border-violet-500/50 dark:hover:border-violet-500/30 hover:shadow-md'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${
                    done 
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-violet-500/10 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {done ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      Pronto
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-neutral-450 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full border border-neutral-200 dark:border-neutral-750">
                      Adicionar
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-neutral-855 dark:text-neutral-200 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-normal">
                    {step.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-850/50">
                <span className={`text-[10px] font-bold ${done ? 'text-neutral-600 dark:text-neutral-450' : 'text-violet-650 dark:text-violet-400'}`}>
                  {step.label}
                </span>
                {!done && (
                  <ArrowRight className="w-3.5 h-3.5 text-violet-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
