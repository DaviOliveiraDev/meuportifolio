'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { Sliders, RefreshCw, History, Shield, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type ScoringHistoryItem = {
  id: string;
  reason: string;
  old_weights: Record<string, number>;
  new_weights: Record<string, number>;
  created_at: string;
  updated_by?: {
    email: string;
  } | null;
};

type ScoringResponse = {
  active_config: {
    id: string;
    weights: Record<string, number>;
  } | null;
  default_weights: Record<string, number>;
  history: ScoringHistoryItem[];
};

export default function AdminScoringPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [recalculating, setRecalculating] = useState(false);
  
  // Pesos editáveis
  const [weights, setWeights] = useState<Record<string, number>>({
    experience: 30,
    projects: 25,
    skills_badges: 15,
    github: 15,
    education: 10,
    completeness: 5,
  });

  const [reason, setReason] = useState('');
  const [history, setHistory] = useState<ScoringHistoryItem[]>([]);
  const [defaultWeights, setDefaultWeights] = useState<Record<string, number>>({});

  // Busca dados de configuração
  const loadData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<ScoringResponse>('/admin/scoring');
      const data = response.data;
      if (data.active_config?.weights) {
        setWeights(data.active_config.weights);
      } else {
        setWeights(data.default_weights);
      }
      setDefaultWeights(data.default_weights);
      setHistory(data.history || []);
    } catch (error: any) {
      console.error(error);
      toast.error('Erro ao carregar configurações de pesos do OVR.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Soma cumulativa dos pesos
  const totalSum = Object.values(weights).reduce((a, b) => a + b, 0);
  const isValidSum = totalSum === 100;

  const handleSliderChange = (key: string, value: number) => {
    setWeights((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Restaura pesos padrão do OVR
  const handleRestoreDefaults = () => {
    if (Object.keys(defaultWeights).length > 0) {
      setWeights(defaultWeights);
      toast.info('Pesos padrão restaurados nos sliders. Clique em salvar para aplicar.');
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidSum) {
      toast.error(`A soma dos pesos deve ser exatamente 100%. Soma atual: ${totalSum}%`);
      return;
    }
    if (!reason.trim()) {
      toast.error('Descreva o motivo/justificativa para auditar esta alteração.');
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.post('/admin/scoring', {
        weights,
        reason: reason.trim(),
        recalculate: false // Dispara manualmente depois se quiser, para maior controle
      });
      toast.success('Novos pesos de OVR salvos com sucesso!');
      setReason('');
      loadData();
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Erro ao salvar pesos.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRecalculateAll = async () => {
    setRecalculating(true);
    try {
      await apiClient.post('/admin/scoring/recalculate');
      toast.success('Processamento em lote agendado com sucesso! Os OVRs serão atualizados em background.');
    } catch (error: any) {
      toast.error('Erro ao disparar reprocessamento geral.');
    } finally {
      setRecalculating(false);
    }
  };

  // Mapeamento de chaves para nomes legíveis
  const labelMap: Record<string, string> = {
    experience: 'Experiência Profissional',
    projects: 'Projetos Cadastrados',
    skills_badges: 'Habilidades & Conquistas',
    github: 'Atividade do GitHub',
    education: 'Formação Acadêmica',
    completeness: 'Completude de Perfil',
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-neutral-450 font-medium">Carregando painel de pesos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Título e Ação de Recalcular */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-neutral-900/30 border border-neutral-850 p-6 rounded-2xl">
        <div>
          <h3 className="font-bold text-base text-white">Configuração do Algoritmo OVR</h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            Ajuste a importância de cada eixo no cálculo do Score Geral dos desenvolvedores.
            Qualquer alteração requer justificativa e entrará no log de auditoria.
          </p>
        </div>
        <Button
          variant="outline"
          disabled={recalculating}
          onClick={handleRecalculateAll}
          className="bg-neutral-900 border-neutral-850 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 hover:bg-neutral-800"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${recalculating ? 'animate-spin' : ''}`} />
          Recalcular Todos
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Painel de Ajustes de Sliders */}
        <div className="lg:col-span-2 bg-neutral-900/10 border border-neutral-850 p-6 rounded-2xl space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-850/40">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Sliders de Pesos</span>
            <button
              onClick={handleRestoreDefaults}
              className="text-[10px] font-bold text-violet-400 hover:text-violet-300 transition-colors"
            >
              Restaurar Padrões
            </button>
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-6">
            <div className="space-y-5">
              {Object.entries(weights).map(([key, val]) => (
                <div key={key} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-white">{labelMap[key] || key}</span>
                    <span className="text-xs font-bold text-violet-400 bg-violet-500/5 px-2 py-0.5 rounded-md border border-violet-500/10">
                      {val}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={val}
                    onChange={(e) => handleSliderChange(key, parseInt(e.target.value))}
                    className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                  />
                </div>
              ))}
            </div>

            {/* Sum Indicator */}
            <div className={`p-4 rounded-xl flex items-center justify-between border ${
              isValidSum
                ? 'bg-emerald-950/10 border-emerald-500/20 text-emerald-400'
                : 'bg-amber-950/10 border-amber-500/20 text-amber-400'
            }`}>
              <div className="flex items-center gap-2 text-xs font-semibold">
                {isValidSum ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>Total Cumulativo:</span>
              </div>
              <span className="text-sm font-extrabold">{totalSum}% / 100%</span>
            </div>

            {/* Justificativa */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="audit-reason" className="text-xs text-neutral-400 font-semibold">
                Motivo da Alteração (Auditoria)
              </Label>
              <Textarea
                id="audit-reason"
                placeholder="Ex: Atualizando pesos para valorizar mais as contribuições do GitHub no MVP..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                maxLength={255}
                required
                className="bg-neutral-950 border-neutral-850 focus:border-violet-500 rounded-lg text-xs p-3 text-white placeholder-neutral-700 outline-none w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting || !isValidSum || !reason.trim()}
              className="w-full bg-violet-650 hover:bg-violet-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-30"
            >
              <Save className="w-4.5 h-4.5" />
              Salvar Nova Configuração
            </Button>
          </form>
        </div>

        {/* Histórico Lateral */}
        <div className="bg-neutral-900/10 border border-neutral-850 p-6 rounded-2xl flex flex-col h-[580px] max-h-[580px]">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-450 mb-4 pb-2 border-b border-neutral-850/40 flex items-center gap-1.5">
            <History className="w-4 h-4 text-violet-400" />
            Histórico de Mudanças
          </span>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {history.length === 0 ? (
              <div className="text-center py-20 text-xs text-neutral-500 italic">
                Nenhuma alteração registrada ainda.
              </div>
            ) : (
              history.map((item) => (
                <div key={item.id} className="bg-neutral-950/40 border border-neutral-850/50 p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-start text-[10px] text-neutral-550 font-semibold">
                    <span className="truncate max-w-[130px]">{item.updated_by?.email || 'Sistema'}</span>
                    <span>{new Date(item.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>

                  <p className="text-xs text-neutral-300 font-medium italic">
                    "{item.reason}"
                  </p>

                  {/* Weights compare preview */}
                  <div className="grid grid-cols-2 gap-2 text-[9px] border-t border-neutral-900 pt-2 font-bold uppercase tracking-wide">
                    <div>
                      <div className="text-neutral-500 mb-1">Pesos Anteriores</div>
                      {Object.entries(item.old_weights).slice(0, 3).map(([k, v]) => (
                        <div key={k} className="text-neutral-400">{k.substring(0, 8)}: {v}%</div>
                      ))}
                      {Object.keys(item.old_weights).length > 3 && <div className="text-neutral-500">...</div>}
                    </div>
                    <div>
                      <div className="text-violet-400 mb-1">Novos Pesos</div>
                      {Object.entries(item.new_weights).slice(0, 3).map(([k, v]) => (
                        <div key={k} className="text-white">{k.substring(0, 8)}: {v}%</div>
                      ))}
                      {Object.keys(item.new_weights).length > 3 && <div className="text-neutral-400">...</div>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
