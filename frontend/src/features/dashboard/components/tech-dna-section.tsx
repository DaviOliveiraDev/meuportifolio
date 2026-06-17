'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { RadarChart } from '@/components/dashboard/RadarChart';
import { OvrHistoryChart } from '@/components/dashboard/OvrHistoryChart';
import { Shield, Award, Cpu, Activity, TrendingUp, Trophy } from 'lucide-react';

interface TechDnaSectionProps {
  profile: any; // O perfil retornado com as relações eager-loaded
}

export function TechDnaSection({ profile }: TechDnaSectionProps) {
  // Busca o histórico do OVR via endpoint da API
  const { data: scoreHistory } = useQuery({
    queryKey: ['score-history'],
    queryFn: async () => {
      const response = await apiClient.get('/profile/score-history');
      return response.data;
    }
  });

  const repScore = profile?.reputation_score || [];
  const domainScores = profile?.user_domain_scores || [];
  
  // Rótulo padrão de DNA
  const profileLabel = repScore?.profile_label || 'Generalist Engineer';
  const ovrVal = repScore?.ovr ? Number(repScore.ovr) : 0;
  const percentile = repScore?.percentile_rank !== null && repScore?.percentile_rank !== undefined
    ? Number(repScore.percentile_rank) 
    : null;

  // Estilização dinâmica por Especialidade/DNA
  const getDnaStyle = (label: string) => {
    const lower = label.toLowerCase();
    if (lower.includes('backend')) {
      return {
        bg: 'from-violet-500/10 to-indigo-500/10 border-violet-500/20 dark:border-violet-500/30',
        text: 'text-violet-600 dark:text-violet-400',
        glow: 'shadow-violet-500/5',
        icon: Cpu,
        desc: 'Foco em APIs escaláveis, lógica de negócios, banco de dados e arquitetura de backend.'
      };
    }
    if (lower.includes('frontend')) {
      return {
        bg: 'from-pink-500/10 to-rose-500/10 border-pink-500/20 dark:border-pink-500/30',
        text: 'text-pink-600 dark:text-pink-400',
        glow: 'shadow-pink-500/5',
        icon: Activity,
        desc: 'Foco em interfaces responsivas, UX/UI impecável, animações e performance client-side.'
      };
    }
    if (lower.includes('full stack')) {
      return {
        bg: 'from-amber-500/10 to-orange-500/10 border-amber-500/20 dark:border-amber-500/30',
        text: 'text-amber-600 dark:text-amber-400',
        glow: 'shadow-amber-500/5',
        icon: Shield,
        desc: 'Habilidade balanceada cobrindo tanto o desenvolvimento frontend quanto a lógica de backend.'
      };
    }
    if (lower.includes('platform') || lower.includes('devops')) {
      return {
        bg: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/20 dark:border-cyan-500/30',
        text: 'text-cyan-600 dark:text-cyan-400',
        glow: 'shadow-cyan-500/5',
        icon: Shield,
        desc: 'Foco em infraestrutura como código, CI/CD, segurança na nuvem e automações de deploy.'
      };
    }
    return {
      bg: 'from-neutral-500/10 to-slate-500/10 border-neutral-500/20 dark:border-neutral-800',
      text: 'text-neutral-600 dark:text-neutral-400',
      glow: 'shadow-neutral-500/5',
      icon: Award,
      desc: 'Engenheiro com habilidades diversificadas cobrindo múltiplos pilares tecnológicos.'
    };
  };

  const dnaStyle = getDnaStyle(profileLabel);
  const DnaIcon = dnaStyle.icon;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 shadow-sm">
      
      {/* Lado Esquerdo: Gráfico Radar de Domínios */}
      <div className="md:col-span-5 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-neutral-100 dark:border-neutral-850 pb-6 md:pb-0 md:pr-6">
        <div className="text-center mb-4">
          <h4 className="font-extrabold text-sm text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
            Matriz de Domínios
          </h4>
          <p className="text-[10px] text-neutral-500 dark:text-neutral-450 mt-0.5">
            Sua proficiência ponderada nos 10 eixos de engenharia.
          </p>
        </div>
        
        {domainScores.length > 0 ? (
          <RadarChart domainScores={domainScores} className="w-full" />
        ) : (
          <div className="min-h-[200px] flex items-center justify-center text-xs text-neutral-450 font-medium italic">
            Adicione evidências para calibrar a matriz.
          </div>
        )}
      </div>

      {/* Lado Direito: DNA Profile Label, Percentil e Histórico */}
      <div className="md:col-span-7 flex flex-col justify-between space-y-6 md:pl-2">
        
        {/* Painel do DNA Profile */}
        <div className={`p-5 rounded-xl bg-gradient-to-r ${dnaStyle.bg} border ${dnaStyle.glow} relative overflow-hidden`}>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-450">
                Especialidade Inferida
              </span>
              <h3 className={`text-xl font-black ${dnaStyle.text} tracking-tight`}>
                {profileLabel}
              </h3>
            </div>
            
            <div className={`p-2 rounded-lg bg-white dark:bg-neutral-900 shadow-sm ${dnaStyle.text}`}>
              <DnaIcon className="w-5 h-5" />
            </div>
          </div>
          
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed mt-3 max-w-md">
            {dnaStyle.desc}
          </p>
          
          {/* Informações de Percentil e Rankings */}
          {ovrVal > 0 && (
            <div className="mt-4 pt-4 border-t border-neutral-100/55 dark:border-neutral-800/55 flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>OVR Geral: <span className="text-violet-600 dark:text-violet-400 font-black">{ovrVal}</span></span>
              </div>
              
              {percentile !== null && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span>Rank: <span className="text-emerald-600 dark:text-emerald-400 font-black">Top {100 - percentile}%</span> no grupo</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Histórico Temporal do OVR */}
        <div className="w-full">
          <OvrHistoryChart history={scoreHistory} className="border-0 p-0 dark:bg-transparent bg-transparent shadow-none" />
        </div>

      </div>
      
    </div>
  );
}
