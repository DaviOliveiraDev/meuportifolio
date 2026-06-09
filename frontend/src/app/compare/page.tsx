'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { NavigationHeader } from '@/components/navigation-header';
import DeveloperCard, { ProfileType } from '@/components/developer-card';
import { apiClient } from '@/lib/api-client';
import { ArrowRightLeft, Sparkles, Scale, Search, ShieldAlert, Award, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type ComparisonData = {
  user1: ProfileType & { breakdown: Record<string, number>; badges_count: number };
  user2: ProfileType & { breakdown: Record<string, number>; badges_count: number };
};

// Componente Interno que usa SearchParams
function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const usersParam = searchParams.get('users');

  const [user1Input, setUser1Input] = useState('');
  const [user2Input, setUser2Input] = useState('');
  const [loading, setLoading] = useState(false);
  const [compareData, setCompareData] = useState<ComparisonData | null>(null);

  const loadComparison = async (usernames: string) => {
    setLoading(true);
    try {
      const response = await apiClient.get('/compare', {
        params: { users: usernames }
      });
      setCompareData(response.data);
      
      const split = usernames.split(',');
      setUser1Input(split[0] || '');
      setUser2Input(split[1] || '');
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Erro ao carregar comparação.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (usersParam) {
      loadComparison(usersParam);
    } else {
      setCompareData(null);
    }
  }, [usersParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user1Input.trim() || !user2Input.trim()) {
      toast.error('Informe ambos os usernames para comparar.');
      return;
    }
    router.push(`/compare?users=${user1Input.trim()},${user2Input.trim()}`);
  };

  // Radar Chart Calculations
  const renderRadarChart = () => {
    if (!compareData) return null;

    const metrics = [
      { key: 'experience', label: 'Experiência' },
      { key: 'projects', label: 'Projetos' },
      { key: 'skills_badges', label: 'Conquistas' },
      { key: 'github', label: 'GitHub' },
      { key: 'education', label: 'Formação' },
      { key: 'completeness', label: 'Completude' }
    ];

    const center = 200;
    const rMax = 120;
    const totalAxes = metrics.length;

    // Converte coordenadas polares em cartesianas (SVG)
    const getCoordinates = (index: number, value: number) => {
      const angle = (index * 2 * Math.PI) / totalAxes - Math.PI / 2;
      const radius = (value / 100) * rMax;
      return {
        x: center + radius * Math.cos(angle),
        y: center + radius * Math.sin(angle)
      };
    };

    // Gera o caminho (path string) para o polígono de um usuário
    const getPolygonPath = (breakdown: Record<string, number>) => {
      const points = metrics.map((m, idx) => {
        const val = breakdown[m.key] ?? 0;
        const coords = getCoordinates(idx, val);
        return `${coords.x},${coords.y}`;
      });
      return `M ${points.join(' L ')} Z`;
    };

    // Gera os caminhos dos círculos ou hexágonos de grade (20%, 40%, 60%, 80%, 100%)
    const gridLevels = [20, 40, 60, 80, 100];
    const gridPolygons = gridLevels.map((lvl) => {
      const points = [...Array(totalAxes)].map((_, idx) => {
        const coords = getCoordinates(idx, lvl);
        return `${coords.x},${coords.y}`;
      });
      return points.join(' ');
    });

    const user1Path = getPolygonPath(compareData.user1.breakdown);
    const user2Path = getPolygonPath(compareData.user2.breakdown);

    return (
      <div className="flex flex-col items-center bg-neutral-900/30 border border-neutral-850/60 rounded-3xl p-6 backdrop-blur-md w-full max-w-md">
        <h3 className="text-sm font-bold text-neutral-450 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Scale className="w-4 h-4 text-violet-400" />
          Gráfico Comparativo OVR
        </h3>

        <svg viewBox="0 0 400 400" className="w-full max-w-[320px] h-auto drop-shadow-lg">
          {/* Eixos Grid de Fundo */}
          {gridPolygons.map((points, idx) => (
            <polygon
              key={idx}
              points={points}
              fill="none"
              stroke="#262626"
              strokeWidth="0.8"
              strokeDasharray={idx < 4 ? "4 4" : "none"}
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
                stroke="#262626"
                strokeWidth="1"
              />
            );
          })}

          {/* Rótulos de Texto */}
          {metrics.map((m, idx) => {
            const textCoords = getCoordinates(idx, 118);
            const anchor = idx === 0 || idx === 3 ? 'middle' : idx < 3 ? 'start' : 'end';
            return (
              <text
                key={m.key}
                x={textCoords.x}
                y={textCoords.y + 3}
                fill="#a3a3a3"
                fontSize="10"
                fontWeight="700"
                textAnchor={anchor}
                className="select-none font-sans"
              >
                {m.label}
              </text>
            );
          })}

          {/* Usuário 1 Polígono (Violeta) */}
          <polygon
            points={user1Path.replace('M ', '').replace(' Z', '')}
            fill="rgba(139, 92, 246, 0.25)"
            stroke="rgba(139, 92, 246, 0.85)"
            strokeWidth="2.5"
            className="transition-all duration-500"
          />

          {/* Usuário 2 Polígono (Ciano) */}
          <polygon
            points={user2Path.replace('M ', '').replace(' Z', '')}
            fill="rgba(6, 182, 212, 0.2)"
            stroke="rgba(6, 182, 212, 0.85)"
            strokeWidth="2.5"
            className="transition-all duration-500"
          />

          {/* Pontos de Interseção Usuário 1 */}
          {metrics.map((m, idx) => {
            const val = compareData.user1.breakdown[m.key] ?? 0;
            const pt = getCoordinates(idx, val);
            return (
              <circle
                key={`u1-${m.key}`}
                cx={pt.x}
                cy={pt.y}
                r="3.5"
                fill="#8b5cf6"
                stroke="#fff"
                strokeWidth="1"
              />
            );
          })}

          {/* Pontos de Interseção Usuário 2 */}
          {metrics.map((m, idx) => {
            const val = compareData.user2.breakdown[m.key] ?? 0;
            const pt = getCoordinates(idx, val);
            return (
              <circle
                key={`u2-${m.key}`}
                cx={pt.x}
                cy={pt.y}
                r="3.5"
                fill="#06b6d4"
                stroke="#fff"
                strokeWidth="1"
              />
            );
          })}
        </svg>

        {/* Legenda do Gráfico */}
        <div className="flex gap-6 mt-6 justify-center w-full text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-violet-600 border border-violet-400" />
            <span className="text-white truncate max-w-[120px]">@{compareData.user1.username}</span>
            <span className="text-violet-400 font-bold">{compareData.user1.ovr}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-cyan-500 border border-cyan-400" />
            <span className="text-white truncate max-w-[120px]">@{compareData.user2.username}</span>
            <span className="text-cyan-400 font-bold">{compareData.user2.ovr}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[200px] right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <main className="max-w-6xl mx-auto px-6 pt-24 pb-20 relative z-10">
        
        {/* Cabeçalho */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold mb-3">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Batalha de Atributos
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-100 to-neutral-450 bg-clip-text text-transparent">
            Comparador de Desenvolvedores
          </h1>
          <p className="text-sm text-neutral-450 mt-2 max-w-lg mx-auto">
            Analise lado a lado os cartões de desenvolvedor, raridades e breakdown de sub-scores no gráfico radar.
          </p>
        </div>

        {/* Formulário de Busca e Username Selecionável */}
        <form onSubmit={handleSearchSubmit} className="bg-neutral-900/30 border border-neutral-850/60 rounded-2xl p-6 mb-12 max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Dev 1 (username)</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
              <input
                type="text"
                placeholder="Ex: davi"
                value={user1Input}
                onChange={(e) => setUser1Input(e.target.value)}
                className="w-full bg-neutral-950/60 border border-neutral-850 rounded-lg py-2.5 pl-9 pr-3 text-sm text-white placeholder-neutral-700 outline-none hover:border-neutral-700 focus:border-violet-500 transition-all"
              />
            </div>
          </div>

          <div className="text-neutral-500 font-extrabold text-sm flex items-center justify-center h-8 sm:h-full px-2">
            VS
          </div>

          <div className="w-full flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Dev 2 (username)</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
              <input
                type="text"
                placeholder="Ex: joao"
                value={user2Input}
                onChange={(e) => setUser2Input(e.target.value)}
                className="w-full bg-neutral-950/60 border border-neutral-850 rounded-lg py-2.5 pl-9 pr-3 text-sm text-white placeholder-neutral-700 outline-none hover:border-neutral-700 focus:border-violet-500 transition-all"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-violet-650 hover:bg-violet-600 text-white font-bold h-[42px] px-8 sm:mt-5.5 rounded-lg shadow-md shadow-violet-950/20"
          >
            {loading ? 'Buscando...' : 'Comparar'}
          </Button>
        </form>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center items-center py-10">
            <div className="w-80 h-[450px] rounded-3xl bg-neutral-900/40 border border-neutral-850 animate-pulse" />
            <div className="w-80 h-[300px] rounded-3xl bg-neutral-900/40 border border-neutral-850 animate-pulse" />
            <div className="w-80 h-[450px] rounded-3xl bg-neutral-900/40 border border-neutral-850 animate-pulse" />
          </div>
        ) : compareData ? (
          <div className="space-y-12">
            {/* Visualização de Comparação Lado a Lado + Radar */}
            <div className="flex flex-col lg:flex-row justify-center items-center gap-10">
              {/* Usuário 1 Card */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest text-violet-400 bg-violet-650/15 py-1 px-3 border border-violet-500/20 rounded-full mb-2 uppercase">
                  Desafiante A
                </span>
                <DeveloperCard profile={compareData.user1} />
              </div>

              {/* Radar Chart central */}
              {renderRadarChart()}

              {/* Usuário 2 Card */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest text-cyan-400 bg-cyan-650/15 py-1 px-3 border border-cyan-500/20 rounded-full mb-2 uppercase">
                  Desafiante B
                </span>
                <DeveloperCard profile={compareData.user2} />
              </div>
            </div>

            {/* TABELA DE MÉTRICAS COMPARADAS */}
            <div className="bg-neutral-900/30 border border-neutral-850/60 rounded-3xl overflow-hidden backdrop-blur-md max-w-3xl mx-auto">
              <div className="px-6 py-4 border-b border-neutral-850 text-xs font-bold uppercase tracking-wider text-neutral-400">
                Comparativo de Estatísticas Técnicas
              </div>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-850 text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-950/20">
                    <th className="py-3 px-6">Métrica</th>
                    <th className="py-3 px-6 text-violet-400 text-right">@{compareData.user1.username}</th>
                    <th className="py-3 px-6 text-cyan-400 text-right">@{compareData.user2.username}</th>
                    <th className="py-3 px-6 text-center w-24">Vencedor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-850/40 font-medium">
                  {/* OVR */}
                  <tr className="hover:bg-white/2 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-white">Pontuação OVR</td>
                    <td className="py-3.5 px-6 text-right font-extrabold text-base text-violet-400">{compareData.user1.ovr}</td>
                    <td className="py-3.5 px-6 text-right font-extrabold text-base text-cyan-400">{compareData.user2.ovr}</td>
                    <td className="py-3.5 px-6 text-center font-bold">
                      {compareData.user1.ovr === compareData.user2.ovr ? (
                        <span className="text-neutral-500 text-[10px]">Empate</span>
                      ) : compareData.user1.ovr! > compareData.user2.ovr! ? (
                        <span className="text-violet-450 text-[10px] uppercase font-extrabold">Dev 1</span>
                      ) : (
                        <span className="text-cyan-400 text-[10px] uppercase font-extrabold">Dev 2</span>
                      )}
                    </td>
                  </tr>

                  {/* Nível */}
                  <tr className="hover:bg-white/2 transition-colors">
                    <td className="py-3 px-6">Nível do Desenvolvedor</td>
                    <td className="py-3 px-6 text-right font-bold">{compareData.user1.level}</td>
                    <td className="py-3 px-6 text-right font-bold">{compareData.user2.level}</td>
                    <td className="py-3 px-6 text-center">
                      {compareData.user1.level === compareData.user2.level ? (
                        '-'
                      ) : compareData.user1.level! > compareData.user2.level! ? (
                        <span className="text-violet-500">🏆</span>
                      ) : (
                        <span className="text-cyan-500">🏆</span>
                      )}
                    </td>
                  </tr>

                  {/* Experiência */}
                  <tr className="hover:bg-white/2 transition-colors">
                    <td className="py-3 px-6">Score de Experiência</td>
                    <td className="py-3 px-6 text-right">{compareData.user1.breakdown.experience}%</td>
                    <td className="py-3 px-6 text-right">{compareData.user2.breakdown.experience}%</td>
                    <td className="py-3 px-6 text-center">
                      {compareData.user1.breakdown.experience === compareData.user2.breakdown.experience ? (
                        '-'
                      ) : compareData.user1.breakdown.experience > compareData.user2.breakdown.experience ? (
                        <span className="text-violet-500">🏆</span>
                      ) : (
                        <span className="text-cyan-500">🏆</span>
                      )}
                    </td>
                  </tr>

                  {/* Projetos */}
                  <tr className="hover:bg-white/2 transition-colors">
                    <td className="py-3 px-6">Score de Projetos</td>
                    <td className="py-3 px-6 text-right">{compareData.user1.breakdown.projects}%</td>
                    <td className="py-3 px-6 text-right">{compareData.user2.breakdown.projects}%</td>
                    <td className="py-3 px-6 text-center">
                      {compareData.user1.breakdown.projects === compareData.user2.breakdown.projects ? (
                        '-'
                      ) : compareData.user1.breakdown.projects > compareData.user2.breakdown.projects ? (
                        <span className="text-violet-500">🏆</span>
                      ) : (
                        <span className="text-cyan-500">🏆</span>
                      )}
                    </td>
                  </tr>

                  {/* GitHub */}
                  <tr className="hover:bg-white/2 transition-colors">
                    <td className="py-3 px-6">Score de Conexão GitHub</td>
                    <td className="py-3 px-6 text-right">{compareData.user1.breakdown.github}%</td>
                    <td className="py-3 px-6 text-right">{compareData.user2.breakdown.github}%</td>
                    <td className="py-3 px-6 text-center">
                      {compareData.user1.breakdown.github === compareData.user2.breakdown.github ? (
                        '-'
                      ) : compareData.user1.breakdown.github > compareData.user2.breakdown.github ? (
                        <span className="text-violet-500">🏆</span>
                      ) : (
                        <span className="text-cyan-500">🏆</span>
                      )}
                    </td>
                  </tr>

                  {/* Badges / Conquistas */}
                  <tr className="hover:bg-white/2 transition-colors">
                    <td className="py-3 px-6">Conquistas Desbloqueadas</td>
                    <td className="py-3 px-6 text-right font-bold">{compareData.user1.badges_count}</td>
                    <td className="py-3 px-6 text-right font-bold">{compareData.user2.badges_count}</td>
                    <td className="py-3 px-6 text-center">
                      {compareData.user1.badges_count === compareData.user2.badges_count ? (
                        '-'
                      ) : compareData.user1.badges_count > compareData.user2.badges_count ? (
                        <span className="text-violet-500">🏆</span>
                      ) : (
                        <span className="text-cyan-500">🏆</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-neutral-950/20 border border-neutral-900 rounded-3xl max-w-xl mx-auto p-8">
            <ArrowRightLeft className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold">Nenhum duelo ativo</h3>
            <p className="text-xs text-neutral-450 mt-2">
              Informe o username de dois desenvolvedores acima e clique em comparar para ver a batalha de estatísticas!
            </p>
          </div>
        )}

      </main>
    </>
  );
}

export default function ComparePage() {
  return (
    <div className="bg-[#050508] text-white min-h-screen">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#050508] text-white">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-neutral-400 text-sm">Carregando comparador...</p>
          </div>
        </div>
      }>
        <CompareContent />
      </Suspense>
    </div>
  );
}
