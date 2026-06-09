'use client';

import { Scale, Sparkles, AlertCircle, ArrowUp } from 'lucide-react';
import { calculateOvr, OvrWeights } from '@/features/gamification/domain/calculate-ovr';

interface OvrBreakdownProps {
  profile?: {
    bio?: string | null;
    avatar_url?: string | null;
    github_url?: string | null;
    profile_completeness?: number;
    experiences?: Array<{
      start_date: string;
      end_date?: string | null;
      is_current?: boolean;
    }>;
    projects?: Array<{
      is_featured?: boolean;
      repository_url?: string | null;
      demo_url?: string | null;
      cover_image_url?: string | null;
    }>;
    skills?: Array<{
      pivot?: {
        proficiency_level?: number;
      };
    }>;
    badges?: Array<unknown>;
  } | null;
  educationsCount?: number;
  className?: string;
  onOpenTierModal?: () => void;
}

export function OvrBreakdown({ profile, educationsCount = 0, className, onOpenTierModal }: OvrBreakdownProps) {
  // Realiza o cálculo do OVR e do detalhamento
  const { ovr, breakdown } = calculateOvr(profile || {}, educationsCount);

  // Mapeamento de rótulos e descrições de evolução
  const metricsInfo: Record<keyof OvrWeights, { label: string; tip: string; color: string }> = {
    experience: {
      label: 'Experiência',
      tip: 'Cadastre mais meses de histórico de trabalho no painel de Experiências.',
      color: 'bg-violet-500 text-violet-600 dark:text-violet-400',
    },
    projects: {
      label: 'Projetos',
      tip: 'Cadastre mais projetos e garanta que possuam link de repositório, imagem e destaque.',
      color: 'bg-emerald-500 text-emerald-600 dark:text-emerald-400',
    },
    skills_badges: {
      label: 'Habilidades',
      tip: 'Adicione mais competências técnicas e conquiste badges no perfil.',
      color: 'bg-amber-500 text-amber-600 dark:text-amber-450',
    },
    github: {
      label: 'GitHub Sync',
      tip: 'Mantenha sua conta conectada e adicione projetos que usam repositórios públicos.',
      color: 'bg-cyan-500 text-cyan-600 dark:text-cyan-400',
    },
    education: {
      label: 'Formação',
      tip: 'Adicione cursos técnicos, certificações ou graduações acadêmicas.',
      color: 'bg-pink-500 text-pink-600 dark:text-pink-400',
    },
    completeness: {
      label: 'Completude',
      tip: 'Preencha todos os campos do seu perfil no painel principal.',
      color: 'bg-indigo-500 text-indigo-600 dark:text-indigo-400',
    },
  };

  // Radar Chart Calculations
  const renderRadarChart = () => {
    const metricsKeys = Object.keys(metricsInfo) as Array<keyof OvrWeights>;
    const center = 150;
    const rMax = 90;
    const totalAxes = metricsKeys.length;

    // Converte coordenadas polares em cartesianas (SVG)
    const getCoordinates = (index: number, value: number) => {
      const angle = (index * 2 * Math.PI) / totalAxes - Math.PI / 2;
      const radius = (value / 100) * rMax;
      return {
        x: center + radius * Math.cos(angle),
        y: center + radius * Math.sin(angle),
      };
    };

    // Gera o polígono do usuário
    const points = metricsKeys.map((key, idx) => {
      const val = breakdown[key] ?? 0;
      const coords = getCoordinates(idx, val);
      return `${coords.x},${coords.y}`;
    });
    const polygonPath = `M ${points.join(' L ')} Z`;

    // Círculos e hexágonos de grade (20%, 40%, 60%, 80%, 100%)
    const gridLevels = [25, 50, 75, 100];
    const gridPolygons = gridLevels.map((lvl) => {
      const pts = [...Array(totalAxes)].map((_, idx) => {
        const coords = getCoordinates(idx, lvl);
        return `${coords.x},${coords.y}`;
      });
      return pts.join(' ');
    });

    return (
      <div className="flex flex-col items-center justify-center">
        <svg viewBox="0 0 300 300" className="w-full max-w-[230px] h-auto drop-shadow-md">
          {/* Eixos Grid de Fundo */}
          {gridPolygons.map((pts, idx) => (
            <polygon
              key={idx}
              points={pts}
              fill="none"
              stroke="#e5e5e5"
              className="dark:stroke-neutral-800"
              strokeWidth="0.8"
              strokeDasharray={idx < 3 ? '3 3' : 'none'}
            />
          ))}

          {/* Linhas Radiais */}
          {[...Array(totalAxes)].map((_, idx) => {
            const outer = getCoordinates(idx, 100);
            return (
              <line
                key={idx}
                x1={center}
                y1={center}
                x2={outer.x}
                y2={outer.y}
                stroke="#e5e5e5"
                className="dark:stroke-neutral-800"
                strokeWidth="0.8"
              />
            );
          })}

          {/* Rótulos curtos de texto no radar */}
          {metricsKeys.map((key, idx) => {
            const textCoords = getCoordinates(idx, 115);
            const anchor = idx === 0 || idx === 3 ? 'middle' : idx < 3 ? 'start' : 'end';
            return (
              <text
                key={key}
                x={textCoords.x}
                y={textCoords.y + 3}
                fill="#a3a3a3"
                fontSize="8"
                fontWeight="700"
                textAnchor={anchor}
                className="select-none font-sans"
              >
                {metricsInfo[key].label.toUpperCase()}
              </text>
            );
          })}

          {/* Polígono de Atributos do Usuário */}
          <polygon
            points={points.join(' ')}
            fill="rgba(139, 92, 246, 0.20)"
            stroke="rgba(139, 92, 246, 0.80)"
            strokeWidth="2.5"
            className="transition-all duration-700 ease-out"
          />

          {/* Pontos de Interseção */}
          {metricsKeys.map((key, idx) => {
            const val = breakdown[key] ?? 0;
            const pt = getCoordinates(idx, val);
            return (
              <circle
                key={key}
                cx={pt.x}
                cy={pt.y}
                r="3"
                fill="#8b5cf6"
                stroke="#fff"
                strokeWidth="0.8"
              />
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className={`p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 shadow-sm ${className}`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-extrabold text-neutral-850 dark:text-neutral-200 text-base flex items-center gap-1.5">
            <Scale className="w-5 h-5 text-violet-500" />
            Análise de Atributos (OVR)
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-450 mt-0.5">
            Sua classificação geral é a média ponderada de seus eixos técnicos.
          </p>
        </div>

        {/* Badge do OVR & Ver Elos Button */}
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex flex-col items-center">
            <div className="text-2xl font-black bg-gradient-to-tr from-amber-500 to-yellow-400 bg-clip-text text-transparent leading-none">
              {ovr}
            </div>
            <span className="text-[8px] font-bold text-neutral-450 uppercase tracking-widest mt-0.5">OVR</span>
          </div>
          {onOpenTierModal && (
            <button
              onClick={onOpenTierModal}
              className="text-[9px] font-extrabold text-violet-600 dark:text-violet-400 hover:text-violet-500 flex items-center gap-0.5 cursor-pointer uppercase tracking-widest hover:underline whitespace-nowrap"
            >
              <Sparkles className="w-2.5 h-2.5 text-amber-550 animate-pulse" />
              Ver Elos
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Gráfico Radar (Esquerda) */}
        <div className="md:col-span-5 flex justify-center">
          {renderRadarChart()}
        </div>

        {/* Detalhamento dos Scores & Dicas (Direita) */}
        <div className="md:col-span-7 space-y-4">
          {(Object.keys(metricsInfo) as Array<keyof OvrWeights>).map((key) => {
            const val = breakdown[key] ?? 0;
            const info = metricsInfo[key];

            return (
              <div key={key} className="group relative flex items-start gap-3 p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-950/20 transition-all duration-300">
                {/* Visual Circle Indicator */}
                <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-850 flex flex-col items-center justify-center font-bold text-neutral-700 dark:text-neutral-300 text-[10px] flex-shrink-0 border border-neutral-200/40 dark:border-neutral-800/40">
                  {val}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-extrabold text-neutral-850 dark:text-neutral-200 leading-none">
                      {info.label}
                    </span>
                    {val < 80 && (
                      <span className="text-[9px] font-bold text-violet-500 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUp className="w-2.5 h-2.5 animate-bounce" />
                        Subir
                      </span>
                    )}
                  </div>

                  {/* Visual Progress Line */}
                  <div className="w-full h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-violet-500 rounded-full transition-all duration-700"
                      style={{ width: `${val}%` }}
                    />
                  </div>

                  {/* Dynamic Upgrade Helper (Tooltip on hover) */}
                  <p className="text-[10px] text-neutral-450 dark:text-neutral-500 mt-1.5 font-light leading-relaxed hidden group-hover:block transition-all">
                    💡 {info.tip}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
