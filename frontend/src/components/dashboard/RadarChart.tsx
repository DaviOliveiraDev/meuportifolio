'use client';

import { useMemo } from 'react';

interface DomainScore {
  score: number;
  domain: {
    name: string;
    slug: string;
    color?: string;
  };
}

interface RadarChartProps {
  domainScores: DomainScore[];
  className?: string;
}

const DEFAULT_DOMAINS = [
  { slug: 'backend', name: 'Backend' },
  { slug: 'frontend', name: 'Frontend' },
  { slug: 'mobile', name: 'Mobile' },
  { slug: 'devops-cloud', name: 'DevOps & Cloud' },
  { slug: 'data-engineering', name: 'Data Eng.' },
  { slug: 'ai-ml', name: 'AI & ML' },
  { slug: 'security', name: 'Security' },
  { slug: 'qa-testing', name: 'QA & Testing' },
  { slug: 'systems-embedded', name: 'Embedded' },
  { slug: 'web3-blockchain', name: 'Web3' }
];

export function RadarChart({ domainScores = [], className }: RadarChartProps) {
  const center = 150;
  const rMax = 95;
  
  // Constrói os dados mapeados para os 10 domínios, garantindo que todos existam (mesmo com score 0)
  const chartData = useMemo(() => {
    return DEFAULT_DOMAINS.map((def) => {
      const match = domainScores.find(
        (ds) => ds.domain?.slug === def.slug || ds.domain?.name?.toLowerCase() === def.name.toLowerCase()
      );
      return {
        name: def.name,
        slug: def.slug,
        score: match ? Number(match.score) : 0
      };
    });
  }, [domainScores]);

  const totalAxes = chartData.length;

  // Função auxiliar para converter coordenadas polares em cartesianas
  const getCoordinates = (index: number, value: number) => {
    const angle = (index * 2 * Math.PI) / totalAxes - Math.PI / 2;
    const radius = (Math.max(0, Math.min(100, value)) / 100) * rMax;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle)
    };
  };

  // Gera o caminho de polígono para o usuário
  const userPoints = useMemo(() => {
    return chartData.map((d, idx) => {
      const coords = getCoordinates(idx, d.score);
      return `${coords.x},${coords.y}`;
    });
  }, [chartData]);

  const polygonPointsStr = userPoints.join(' ');

  // Gera hexágonos/decágonos de grade (25%, 50%, 75%, 100%)
  const gridLevels = [25, 50, 75, 100];
  const gridPolygons = useMemo(() => {
    return gridLevels.map((lvl) => {
      const pts = Array.from({ length: totalAxes }).map((_, idx) => {
        const coords = getCoordinates(idx, lvl);
        return `${coords.x},${coords.y}`;
      });
      return pts.join(' ');
    });
  }, [totalAxes]);

  return (
    <div className={`flex flex-col items-center justify-center relative ${className}`}>
      <svg
        viewBox="0 0 300 300"
        className="w-full max-w-[270px] h-auto drop-shadow-xl select-none"
      >
        <defs>
          <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgb(139, 92, 246)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0.03" />
          </radialGradient>
          <linearGradient id="poly-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.45)" />
            <stop offset="100%" stopColor="rgba(99, 102, 241, 0.25)" />
          </linearGradient>
        </defs>

        {/* Círculo de brilho de fundo */}
        <circle cx={center} cy={center} r={rMax} fill="url(#radar-glow)" />

        {/* Linhas concêntricas da grade */}
        {gridPolygons.map((pts, idx) => (
          <polygon
            key={idx}
            points={pts}
            fill="none"
            stroke="currentColor"
            className="text-neutral-200 dark:text-neutral-800"
            strokeWidth="0.8"
            strokeDasharray={idx < 3 ? '3 3' : 'none'}
          />
        ))}

        {/* Linhas de eixos radiais */}
        {Array.from({ length: totalAxes }).map((_, idx) => {
          const outer = getCoordinates(idx, 100);
          return (
            <line
              key={idx}
              x1={center}
              y1={center}
              x2={outer.x}
              y2={outer.y}
              stroke="currentColor"
              className="text-neutral-200 dark:text-neutral-800"
              strokeWidth="0.8"
            />
          );
        })}

        {/* Polígono de Scores do Usuário */}
        {userPoints.length > 0 && (
          <polygon
            points={polygonPointsStr}
            fill="url(#poly-grad)"
            stroke="rgb(139, 92, 246)"
            strokeWidth="2"
            strokeLinejoin="round"
            className="transition-all duration-1000 ease-out"
          />
        )}

        {/* Rótulos de texto para os eixos */}
        {chartData.map((d, idx) => {
          const textCoords = getCoordinates(idx, 115);
          // Alinhamento inteligente do texto baseado no ângulo
          const angle = (idx * 2 * Math.PI) / totalAxes - Math.PI / 2;
          const xDiff = Math.cos(angle);
          let anchor: 'start' | 'end' | 'middle' = 'middle';
          if (xDiff > 0.15) anchor = 'start';
          else if (xDiff < -0.15) anchor = 'end';

          let yOffset = 3;
          if (idx === 0) yOffset = -3; // Top labels
          if (idx === 5) yOffset = 8;  // Bottom labels

          return (
            <text
              key={d.slug}
              x={textCoords.x}
              y={textCoords.y + yOffset}
              fill="currentColor"
              fontSize="8"
              fontWeight="800"
              textAnchor={anchor}
              className="text-neutral-500 dark:text-neutral-450 font-sans tracking-wide uppercase"
            >
              {d.name}
            </text>
          );
        })}

        {/* Pontos (círculos) de dados */}
        {chartData.map((d, idx) => {
          if (d.score === 0) return null;
          const pt = getCoordinates(idx, d.score);
          return (
            <g key={d.slug} className="group/dot cursor-pointer">
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4.5"
                fill="rgb(139, 92, 246)"
                stroke="white"
                strokeWidth="1.5"
                className="transition-transform duration-300 hover:scale-150 shadow-sm"
              />
              <circle
                cx={pt.x}
                cy={pt.y}
                r="8"
                fill="rgb(139, 92, 246)"
                fillOpacity="0"
                className="hover:fill-opacity-10 transition-all duration-300"
              />
              {/* Tooltip local no radar */}
              <title>{`${d.name}: ${d.score}`}</title>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
