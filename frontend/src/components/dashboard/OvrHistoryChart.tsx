'use client';

import { useMemo, useState } from 'react';

interface HistoryItem {
  ovr: number;
  recorded_at: string;
}

interface OvrHistoryChartProps {
  history?: HistoryItem[];
  className?: string;
}

export function OvrHistoryChart({ history = [], className }: OvrHistoryChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; val: number; date: string } | null>(null);

  // Filtra e ordena o histórico cronologicamente
  const sortedHistory = useMemo(() => {
    if (!history || history.length === 0) return [];
    return [...history]
      .map(item => ({
        ovr: Number(item.ovr),
        recorded_at: new Date(item.recorded_at)
      }))
      .sort((a, b) => a.recorded_at.getTime() - b.recorded_at.getTime());
  }, [history]);

  // Se não houver histórico, cria um mock básico para demonstração bonita e interativa
  const chartPoints = useMemo(() => {
    const data = sortedHistory.length > 0 ? sortedHistory : [
      { ovr: 10, recorded_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { ovr: 15, recorded_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
      { ovr: 28, recorded_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
      { ovr: 42, recorded_at: new Date() }
    ];

    const width = 500;
    const height = 180;
    const paddingLeft = 40;
    const paddingRight = 30;
    const paddingTop = 20;
    const paddingBottom = 30;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const scores = data.map((d) => d.ovr);
    const minScore = Math.max(0, Math.min(...scores) - 10);
    const maxScore = Math.min(100, Math.max(...scores) + 10);
    const scoreRange = maxScore - minScore || 1;

    return data.map((d, index) => {
      const x = paddingLeft + (index / (data.length - 1 || 1)) * chartWidth;
      // y invertido no SVG
      const y = height - paddingBottom - ((d.ovr - minScore) / scoreRange) * chartHeight;
      const formattedDate = d.recorded_at.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short'
      });
      return {
        x,
        y,
        val: d.ovr,
        date: formattedDate
      };
    });
  }, [sortedHistory]);

  // Constrói o path da linha e da área
  const { linePath, areaPath } = useMemo(() => {
    if (chartPoints.length === 0) return { linePath: '', areaPath: '' };
    
    // Caminho da linha
    const pointsStr = chartPoints.map((p) => `${p.x},${p.y}`).join(' L ');
    const linePath = `M ${pointsStr}`;

    // Caminho da área (fecha o polígono na base do gráfico: y = 150)
    const baseHeight = 150; // altura do chão do gráfico
    const firstPoint = chartPoints[0];
    const lastPoint = chartPoints[chartPoints.length - 1];
    const areaPath = `M ${firstPoint.x},${baseHeight} L ${pointsStr} L ${lastPoint.x},${baseHeight} Z`;

    return { linePath, areaPath };
  }, [chartPoints]);

  return (
    <div className={`p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 shadow-sm ${className}`}>
      <div className="mb-4">
        <h4 className="font-bold text-sm text-neutral-850 dark:text-neutral-200 uppercase tracking-wider">
          Evolução Temporal do OVR
        </h4>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-450 mt-0.5">
          Histórico do seu progresso geral de reputação. Sincronize evidências para ver a linha subir.
        </p>
      </div>

      <div className="relative w-full">
        <svg
          viewBox="0 0 500 180"
          className="w-full h-auto overflow-visible"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <defs>
            {/* Gradiente da linha */}
            <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>

            {/* Gradiente da área */}
            <linearGradient id="area-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
            </linearGradient>

            {/* Sombra dos pontos */}
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#8b5cf6" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Grid de fundo Y */}
          {[25, 50, 75, 100].map((lvl, idx) => {
            const y = 150 - (lvl / 100) * 110;
            return (
              <g key={idx}>
                <line
                  x1="40"
                  y1={y}
                  x2="470"
                  y2={y}
                  stroke="currentColor"
                  className="text-neutral-100 dark:text-neutral-800"
                  strokeWidth="0.8"
                  strokeDasharray="4 4"
                />
                <text
                  x="30"
                  y={y + 3}
                  fontSize="8"
                  fontWeight="600"
                  textAnchor="end"
                  className="fill-neutral-400 dark:fill-neutral-500 font-sans"
                >
                  {lvl}
                </text>
              </g>
            );
          })}

          {/* Área preenchida */}
          {areaPath && (
            <path
              d={areaPath}
              fill="url(#area-grad)"
              className="animate-in fade-in duration-500"
            />
          )}

          {/* Linha do gráfico */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="url(#line-grad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-in slide-in-from-left-4 duration-700"
            />
          )}

          {/* Rótulos X (Datas) e pontos interativos */}
          {chartPoints.map((p, idx) => (
            <g key={idx}>
              {/* Rótulo de Data */}
              <text
                x={p.x}
                y="165"
                fontSize="8"
                fontWeight="700"
                textAnchor="middle"
                className="fill-neutral-400 dark:fill-neutral-500 font-sans"
              >
                {p.date}
              </text>

              {/* Ponto interativo */}
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill="#8b5cf6"
                stroke="white"
                strokeWidth="1.5"
                filter="url(#shadow)"
                className="cursor-pointer transition-transform duration-300 hover:scale-150"
                onMouseEnter={() => setHoveredPoint(p)}
              />

              {/* Área Invisível Ampliada para facilitar Hover */}
              <circle
                cx={p.x}
                cy={p.y}
                r="15"
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(p)}
              />
            </g>
          ))}
        </svg>

        {/* Tooltip Dinâmico Absoluto */}
        {hoveredPoint && (
          <div
            className="absolute z-10 px-2 py-1.5 rounded-lg bg-neutral-900 text-white text-[10px] font-bold shadow-md pointer-events-none transform -translate-x-1/2 -translate-y-full flex flex-col items-center gap-0.5 border border-neutral-800"
            style={{
              left: `${(hoveredPoint.x / 500) * 100}%`,
              top: `${(hoveredPoint.y / 180) * 100 - 8}%`
            }}
          >
            <span className="text-[9px] text-neutral-400 font-medium">{hoveredPoint.date}</span>
            <span className="text-violet-400 text-xs">OVR {hoveredPoint.val}</span>
            <div className="absolute w-2 h-2 bg-neutral-900 border-r border-b border-neutral-800 transform rotate-45 bottom-[-4px] left-1/2 -translate-x-1/2" />
          </div>
        )}
      </div>
    </div>
  );
}
