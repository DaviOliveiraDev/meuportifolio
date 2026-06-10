'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { NavigationHeader } from '@/components/navigation-header';
import { apiClient } from '@/lib/api-client';
import { Trophy, Medal, ArrowUpRight, Award, Flame, User, Search, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

type LeaderboardProfile = {
  id: string;
  name: string;
  username: string;
  avatar_url?: string | null;
  role?: string | null;
  ovr: number;
  level: number;
  xp: number;
  badges?: { id: string }[];
};

export default function LeaderboardPage() {
  const [roleFilter, setRoleFilter] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Categorias rápidas para filtros
  const categories = [
    { label: 'Geral', value: '' },
    { label: 'Frontend', value: 'Frontend' },
    { label: 'Backend', value: 'Backend' },
    { label: 'DevOps', value: 'DevOps' },
    { label: 'Mobile', value: 'Mobile' },
  ];

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/leaderboard', {
        params: { role: roleFilter }
      });
      setLeaderboard(response.data.leaderboard || []);
    } catch (error: any) {
      console.error(error);
      toast.error('Erro ao carregar ranking de desenvolvedores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [roleFilter]);

  // Separa o pódio (Top 3) e o restante (4 a 100)
  const podium = leaderboard.slice(0, 3);
  const remainingList = leaderboard.slice(3);

  // Ordena o pódio para exibição visual: [Prata (2º), Ouro (1º), Bronze (3º)]
  const sortedPodium = [];
  if (podium[1]) sortedPodium.push({ ...podium[1], rank: 2 });
  if (podium[0]) sortedPodium.push({ ...podium[0], rank: 1 });
  if (podium[2]) sortedPodium.push({ ...podium[2], rank: 3 });

  return (
    <div className="bg-[#050508] text-white min-h-screen relative overflow-x-hidden font-sans">
      <NavigationHeader />

      {/* Glows */}
      <div className="absolute top-0 left-1/3 w-[800px] h-[500px] bg-violet-600/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[200px] right-10 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <main className="max-w-5xl mx-auto px-6 pt-24 pb-20 relative z-10">
        
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold mb-3">
            <Trophy className="w-4.5 h-4.5 text-amber-500" />
            Top 100 Global
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-100 to-neutral-450 bg-clip-text text-transparent">
            Rankings da Comunidade
          </h1>
          <p className="text-sm text-neutral-450 mt-2 max-w-lg mx-auto">
            Dispute o topo com base na sua performance técnica do GitHub, experiência, formação e conquistas no DevFolio.
          </p>
        </div>

        {/* Abas de Categorias Rápidas */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setRoleFilter(cat.value)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all border ${
                roleFilter === cat.value
                  ? 'bg-violet-600/15 border-violet-500/40 text-violet-400 font-bold shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                  : 'bg-neutral-900/40 border-neutral-850 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto items-end h-[300px]">
              <div className="h-[200px] bg-neutral-900/30 rounded-2xl animate-pulse" />
              <div className="h-[250px] bg-neutral-900/30 rounded-2xl animate-pulse" />
              <div className="h-[170px] bg-neutral-900/30 rounded-2xl animate-pulse" />
            </div>
            <div className="h-40 bg-neutral-900/30 rounded-2xl animate-pulse" />
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-20 bg-neutral-950/20 border border-neutral-900 rounded-3xl">
            <User className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
            <h3 className="text-lg font-bold">Nenhum desenvolvedor qualificado</h3>
            <p className="text-xs text-neutral-500 mt-2">
              Não encontramos perfis para esta especialidade cadastrados no momento.
            </p>
          </div>
        ) : (
          <div>
            {/* PÓDIO (TOP 3) */}
            {podium.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto items-end mb-16 px-4">
                {sortedPodium.map((dev) => {
                  const isFirst = dev.rank === 1;
                  const isSecond = dev.rank === 2;
                  
                  // Cores do Pódio
                  const colors = isFirst 
                    ? { border: 'border-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.15)]', bg: 'bg-amber-950/10', text: 'text-amber-400', badgeBg: 'bg-amber-500', height: 'h-[320px]' }
                    : isSecond
                      ? { border: 'border-slate-400/40 shadow-[0_0_20px_rgba(148,163,184,0.1)]', bg: 'bg-slate-900/10', text: 'text-slate-300', badgeBg: 'bg-slate-400', height: 'h-[280px]' }
                      : { border: 'border-amber-700/40 shadow-[0_0_15px_rgba(180,83,9,0.08)]', bg: 'bg-amber-950/5', text: 'text-amber-600', badgeBg: 'bg-amber-700', height: 'h-[250px]' };

                  return (
                    <div 
                      key={dev.id}
                      className={`relative flex flex-col items-center p-6 border ${colors.border} ${colors.bg} ${colors.height} rounded-3xl transition-transform hover:scale-[1.03] duration-300 order-last sm:order-none`}
                    >
                      {/* Coroa / Ícone do Top 1 */}
                      {isFirst && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 animate-bounce">
                          <Sparkles className="w-7 h-7 text-amber-400 fill-amber-400" />
                        </div>
                      )}

                      {/* Rank Medal */}
                      <span className={`absolute -top-3.5 right-6 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-black ${colors.badgeBg} shadow`}>
                        {dev.rank}
                      </span>

                      {/* Avatar */}
                      <div className={`relative w-20 h-20 rounded-full p-0.5 bg-gradient-to-tr ${
                        isFirst ? 'from-amber-400 to-yellow-600' : isSecond ? 'from-slate-300 to-zinc-500' : 'from-amber-700 to-orange-850'
                      } mb-4`}>
                        {dev.avatar_url ? (
                          <img
                            src={dev.avatar_url}
                            alt={dev.name}
                            className="w-full h-full rounded-full object-cover bg-neutral-900 border border-neutral-900"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center font-bold text-xl uppercase">
                            {dev.name.substring(0, 2)}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <h3 className="font-extrabold text-base tracking-tight truncate w-full text-center">
                        {dev.name}
                      </h3>
                      
                      <Link 
                        href={`/${dev.username}`} 
                        className="text-[10px] text-neutral-400 hover:text-white mt-0.5 transition-colors font-medium"
                      >
                        @{dev.username}
                      </Link>

                      <p className="text-[11px] text-neutral-500 font-semibold tracking-wide uppercase mt-3">
                        {dev.role || 'Developer'}
                      </p>

                      {/* OVR Box */}
                      <div className="mt-auto flex flex-col items-center">
                        <span className={`text-4xl font-black tracking-tighter ${colors.text}`}>
                          {dev.ovr}
                        </span>
                        <span className="text-[8px] font-bold text-neutral-400 tracking-widest uppercase">
                          OVR SCORE
                        </span>
                      </div>
                      
                      {/* Nível e XP */}
                      <div className="mt-2 text-[10px] text-neutral-450 font-bold">
                        LVL {dev.level} | {dev.xp} XP
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TABELA DOS DEMAIS COLOCADOS (4º ao 100º) */}
            {remainingList.length > 0 && (
              <div className="bg-neutral-900/30 border border-neutral-850/60 rounded-2xl overflow-hidden backdrop-blur-md">
                <div className="px-6 py-4 border-b border-neutral-850 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-450">
                    Posição 4 - {leaderboard.length}
                  </span>
                  <span className="text-[10px] font-semibold text-neutral-500">
                    Atualizado em tempo real
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-neutral-850 text-[10px] font-bold uppercase tracking-widest text-neutral-500 bg-neutral-950/20">
                        <th className="py-4 px-6 text-center w-16">Rank</th>
                        <th className="py-4 px-6">Desenvolvedor</th>
                        <th className="py-4 px-6">Especialidade</th>
                        <th className="py-4 px-6 text-center w-20">OVR</th>
                        <th className="py-4 px-6 text-center w-24">Nível</th>
                        <th className="py-4 px-6 text-center w-24">Conquistas</th>
                        <th className="py-4 px-6 text-center w-20">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-850/40">
                      {remainingList.map((dev, index) => {
                        const rank = index + 4;
                        return (
                          <tr key={dev.id} className="hover:bg-white/2 transition-colors">
                            {/* Posição */}
                            <td className="py-4 px-6 text-center font-extrabold text-sm text-neutral-400">
                              #{rank}
                            </td>

                            {/* Usuário */}
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-900 border border-neutral-800 flex-shrink-0">
                                  {dev.avatar_url ? (
                                    <img
                                      src={dev.avatar_url}
                                      alt={dev.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center font-bold text-xs uppercase bg-neutral-950">
                                      {dev.name.substring(0, 2)}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <div className="font-bold text-xs text-white">
                                    {dev.name}
                                  </div>
                                  <div className="text-[10px] text-neutral-450 mt-0.5">
                                    @{dev.username}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Cargo */}
                            <td className="py-4 px-6 text-xs text-neutral-400 font-medium">
                              {dev.role || 'Developer'}
                            </td>

                            {/* OVR */}
                            <td className="py-4 px-6 text-center">
                              <span className="font-extrabold text-base bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                                {dev.ovr}
                              </span>
                            </td>

                            {/* Nível & XP */}
                            <td className="py-4 px-6 text-center">
                              <div className="text-xs font-semibold text-white">
                                LVL {dev.level}
                              </div>
                              <div className="text-[9px] text-neutral-500 font-semibold mt-0.5">
                                {dev.xp} XP
                              </div>
                            </td>

                            {/* Conquistas (Count) */}
                            <td className="py-4 px-6 text-center">
                              <div className="inline-flex items-center gap-1 text-xs text-neutral-400 bg-neutral-950/40 px-2.5 py-1 rounded-full border border-neutral-850">
                                <Award className="w-3.5 h-3.5 text-amber-500" />
                                <span className="font-bold text-[10px]">{dev.badges?.length || 0}</span>
                              </div>
                            </td>

                            {/* Ações */}
                            <td className="py-4 px-6 text-center">
                              <Link
                                href={`/${dev.username}`}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-violet-400 hover:text-violet-300 transition-colors"
                              >
                                Ver
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
