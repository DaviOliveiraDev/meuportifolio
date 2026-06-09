'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { NavigationHeader } from '@/components/navigation-header';
import DeveloperCard, { ProfileType } from '@/components/developer-card';
import { apiClient } from '@/lib/api-client';
import { 
  Search, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert, 
  MapPin, 
  Sliders, 
  Briefcase,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function ExplorePage() {
  // Estados de Busca e Filtros
  const [q, setQ] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [minOvr, setMinOvr] = useState('0');
  const [maxOvr, setMaxOvr] = useState('100');
  const [sort, setSort] = useState('ovr_desc');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Estados de Dados
  const [profiles, setProfiles] = useState<ProfileType[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Estados da Denúncia (Report)
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportUsername, setReportUsername] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);

  // Busca inicial e reações a filtros
  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/explore', {
        params: {
          q,
          role,
          location,
          min_ovr: minOvr,
          max_ovr: maxOvr,
          sort,
          page,
          per_page: 8
        }
      });
      setProfiles(response.data.data || []);
      setTotalPages(response.data.last_page || 1);
      setTotalItems(response.data.total || 0);
    } catch (error: any) {
      console.error(error);
      toast.error('Erro ao buscar desenvolvedores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce na busca de texto
    const delayDebounce = setTimeout(() => {
      fetchProfiles();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [q, role, location, minOvr, maxOvr, sort, page]);

  // Resetar página quando filtros mudam
  useEffect(() => {
    setPage(1);
  }, [q, role, location, minOvr, maxOvr, sort]);

  // Lógica de Envio de Denúncia
  const handleOpenReport = (username: string) => {
    setReportUsername(username);
    setReportReason('');
    setIsReportOpen(true);
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) {
      toast.error('Por favor, informe o motivo da denúncia.');
      return;
    }

    setSubmittingReport(true);
    try {
      await apiClient.post('/reports', {
        reported_username: reportUsername,
        reason: reportReason,
        reported_type: 'profile'
      });
      toast.success('Denúncia enviada com sucesso para análise.');
      setIsReportOpen(false);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Erro ao enviar denúncia.';
      toast.error(msg);
    } finally {
      setSubmittingReport(false);
    }
  };

  return (
    <div className="bg-[#050508] text-white min-h-screen relative overflow-x-hidden font-sans">
      <NavigationHeader />

      {/* Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[300px] right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <main className="max-w-6xl mx-auto px-6 pt-24 pb-20 relative z-10">
        
        {/* Título da Página */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-450 bg-clip-text text-transparent">
            Descubra Talentos Técnicos
          </h1>
          <p className="text-sm text-neutral-400 mt-2 max-w-xl mx-auto">
            Explore cartas profissionais de desenvolvedores, avalie sub-pontuações e encontre especialistas com base em OVR, nível e XP.
          </p>
        </div>

        {/* Barra de Pesquisa Principal */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              type="text"
              placeholder="Buscar por nome, bio, tecnologias ou username..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full bg-neutral-900/60 border border-neutral-850 hover:border-neutral-700 focus:border-violet-500 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-neutral-500 outline-none transition-all"
            />
          </div>

          <div className="flex gap-3">
            {/* Botão de Toggle de Filtros Avançados */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border border-neutral-850 transition-all ${
                showFilters ? 'bg-violet-600/10 border-violet-500/40 text-violet-400' : 'bg-neutral-900/60 text-white hover:bg-neutral-850'
              }`}
            >
              <SlidersHorizontal className="w-4.5 h-4.5" />
              Filtros
            </Button>

            {/* Ordenação */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-neutral-900/60 border border-neutral-850 text-white text-sm rounded-xl px-4 py-3 outline-none hover:border-neutral-700 focus:border-violet-500 transition-all cursor-pointer"
            >
              <option value="ovr_desc">Maior OVR</option>
              <option value="level_desc">Maior Nível</option>
              <option value="newest">Mais Recentes</option>
            </select>
          </div>
        </div>

        {/* Filtros Avançados Expansíveis */}
        {showFilters && (
          <div className="bg-neutral-900/40 border border-neutral-850/60 rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Cargo */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="role-filter" className="text-xs font-semibold text-neutral-450 uppercase tracking-wider">Cargo Especialidade</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-550" />
                <input
                  id="role-filter"
                  type="text"
                  placeholder="Ex: Backend, Frontend"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-neutral-950/60 border border-neutral-850 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-neutral-600 outline-none hover:border-neutral-700 focus:border-violet-500 transition-all"
                />
              </div>
            </div>

            {/* Localização */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="loc-filter" className="text-xs font-semibold text-neutral-450 uppercase tracking-wider">Localização</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-550" />
                <input
                  id="loc-filter"
                  type="text"
                  placeholder="Ex: São Paulo, Remoto"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-neutral-950/60 border border-neutral-850 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-neutral-600 outline-none hover:border-neutral-700 focus:border-violet-500 transition-all"
                />
              </div>
            </div>

            {/* OVR Mínimo Slider */}
            <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
              <div className="flex justify-between items-end">
                <Label className="text-xs font-semibold text-neutral-450 uppercase tracking-wider">Faixa de OVR ({minOvr} - {maxOvr})</Label>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={minOvr}
                  onChange={(e) => setMinOvr(e.target.value)}
                  className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={maxOvr}
                  onChange={(e) => setMaxOvr(e.target.value)}
                  className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Grid de Resultados */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center py-20">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-80 h-[450px] rounded-3xl bg-neutral-900/40 border border-neutral-850 animate-pulse flex flex-col justify-center items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-neutral-800" />
                <div className="h-4 w-32 bg-neutral-800 rounded-md" />
                <div className="h-3 w-24 bg-neutral-800 rounded-md" />
              </div>
            ))}
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-20 bg-neutral-950/20 border border-neutral-900 rounded-3xl p-10 max-w-lg mx-auto">
            <AlertTriangle className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white">Nenhum desenvolvedor encontrado</h3>
            <p className="text-xs text-neutral-450 mt-2">
              Tente alterar os termos da busca ou limpar os filtros para encontrar perfis correspondentes.
            </p>
            {(q || role || location || minOvr !== '0' || maxOvr !== '100') && (
              <Button
                variant="outline"
                onClick={() => {
                  setQ('');
                  setRole('');
                  setLocation('');
                  setMinOvr('0');
                  setMaxOvr('100');
                }}
                className="mt-6 border-neutral-800 text-xs text-neutral-400 hover:text-white"
              >
                Limpar Todos os Filtros
              </Button>
            )}
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center mb-12">
              {profiles.map((profile) => (
                <div key={profile.id} className="flex flex-col items-center gap-3 group relative">
                  {/* Card Container Link */}
                  <Link href={`/${profile.username}`} className="block">
                    <DeveloperCard profile={profile} />
                  </Link>

                  {/* Ações Rápidas adicionais */}
                  <div className="flex gap-2 w-full max-w-sm justify-between px-4 mt-1">
                    <Link
                      href={`/compare?users=${profile.username}`}
                      className="text-[11px] font-semibold text-neutral-450 hover:text-white transition-colors"
                    >
                      Comparar
                    </Link>

                    <button
                      onClick={() => handleOpenReport(profile.username)}
                      className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-red-400 transition-colors font-medium"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Reportar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 border-t border-neutral-900 pt-8">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="bg-neutral-900 border-neutral-800 text-white disabled:opacity-30 disabled:hover:bg-neutral-900"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
                <span className="text-xs text-neutral-400 font-semibold">
                  Página {page} de {totalPages} ({totalItems} devs)
                </span>
                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="bg-neutral-900 border-neutral-800 text-white disabled:opacity-30 disabled:hover:bg-neutral-900"
                >
                  Próximo
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Modal / Dialog de Denúncia */}
      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent className="bg-neutral-950 border border-neutral-850 text-white p-6 max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              Reportar Perfil: <span className="text-violet-400">@{reportUsername}</span>
            </DialogTitle>
            <DialogDescription className="text-neutral-450 text-xs mt-1.5 leading-relaxed">
              Você está denunciando o perfil deste desenvolvedor por conteúdo inadequado, ofensivo, ou que viola os Termos de Serviço.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitReport} className="space-y-4 mt-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="report-reason" className="text-xs text-neutral-400 font-medium">Motivo da denúncia</Label>
              <Textarea
                id="report-reason"
                placeholder="Descreva detalhadamente o motivo da denúncia..."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                maxLength={500}
                rows={4}
                className="bg-neutral-900 border-neutral-800 focus:border-violet-500 rounded-lg text-xs p-3 text-white placeholder-neutral-600 outline-none w-full"
              />
              <span className="text-[10px] text-neutral-600 text-right">
                {reportReason.length}/500 caracteres
              </span>
            </div>

            <DialogFooter className="flex gap-3 justify-end pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsReportOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={submittingReport}
                className="bg-red-600 hover:bg-red-500 text-white font-semibold shadow-md shadow-red-950/20"
              >
                {submittingReport ? 'Enviando...' : 'Enviar Denúncia'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
