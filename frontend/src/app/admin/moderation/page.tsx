'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { Shield, ShieldAlert, CheckCircle2, XCircle, Clock, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

type ProfileShort = {
  id: string;
  name: string;
  username: string;
  avatar_url?: string | null;
  is_active: boolean;
};

type ReportItem = {
  id: string;
  reporter_profile_id: string | null;
  reported_profile_id: string;
  reported_type: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  resolution_notes: string | null;
  created_at: string;
  reporter?: ProfileShort | null;
  reported_profile?: ProfileShort;
};

export default function AdminModerationPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados do Modal de Ação
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [actionType, setActionType] = useState<'resolved' | 'dismissed'>('resolved');
  const [profileAction, setProfileAction] = useState<'hide_profile' | 'activate_profile' | 'none'>('none');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadReports = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/admin/reports');
      setReports(response.data.reports || []);
    } catch (error: any) {
      console.error(error);
      toast.error('Erro ao carregar fila de moderação.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const openActionModal = (report: ReportItem, type: 'resolved' | 'dismissed', profAction: 'hide_profile' | 'activate_profile' | 'none' = 'none') => {
    setSelectedReport(report);
    setActionType(type);
    setProfileAction(profAction);
    setNotes('');
    setIsActionOpen(true);
  };

  const handleExecuteAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;
    if (!notes.trim()) {
      toast.error('Por favor, digite as notas de resolução.');
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.put(`/admin/reports/${selectedReport.id}`, {
        status: actionType,
        action: profileAction,
        resolution_notes: notes.trim(),
      });
      toast.success('Ação de moderação aplicada com sucesso!');
      setIsActionOpen(false);
      loadReports();
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Erro ao aplicar decisão.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-neutral-455 font-medium">Carregando denúncias...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Resumo */}
      <div className="bg-neutral-900/30 border border-neutral-850 p-6 rounded-2xl">
        <h3 className="font-bold text-base text-white">Fila de Denúncias e Moderação</h3>
        <p className="text-xs text-neutral-400 mt-1 max-w-xl">
          Revise denúncias enviadas pelos usuários. Você pode arquivar denúncias infundadas ou resolver aplicando restrições de visibilidade temporárias/permanentes nos perfis.
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-20 bg-neutral-950/20 border border-neutral-900 rounded-3xl p-10 max-w-md mx-auto">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-white">Tudo em ordem por aqui!</h3>
          <p className="text-xs text-neutral-450 mt-2">
            Nenhuma denúncia pendente de moderação no momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {reports.map((report) => {
            const isPending = report.status === 'pending';
            const isResolved = report.status === 'resolved';
            const isDismissed = report.status === 'dismissed';

            return (
              <div 
                key={report.id} 
                className={`bg-neutral-900/10 border p-6 rounded-2xl space-y-4 flex flex-col justify-between ${
                  isPending 
                    ? 'border-neutral-850/80 shadow-md' 
                    : 'border-neutral-900/60 opacity-75'
                }`}
              >
                {/* Cabeçalho da denúncia */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-neutral-900 pb-3">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full flex items-center gap-1.5 border ${
                      isPending
                        ? 'bg-amber-500/5 text-amber-400 border-amber-500/10'
                        : isResolved
                          ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10'
                          : 'bg-neutral-800/10 text-neutral-400 border-neutral-800'
                    }`}>
                      {isPending ? (
                        <>
                          <Clock className="w-3 h-3" /> Pendente
                        </>
                      ) : isResolved ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Resolvido
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> Arquivado
                        </>
                      )}
                    </span>
                    <span className="text-[10px] text-neutral-550 font-semibold">
                      Denunciado em {new Date(report.created_at).toLocaleString('pt-BR')}
                    </span>
                  </div>

                  {/* Usuários envolvidos */}
                  <div className="text-xs font-semibold text-neutral-400">
                    Por: <span className="text-white">@{report.reporter?.username || 'Anônimo'}</span> &rarr; Denunciado: <span className="text-violet-400">@{report.reported_profile?.username || 'Desconhecido'}</span>
                  </div>
                </div>

                {/* Motivo */}
                <div className="space-y-1 bg-neutral-950/20 p-4 rounded-xl border border-neutral-900">
                  <span className="text-[9px] uppercase font-bold text-neutral-500 tracking-wider flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    Conteúdo Denunciado / Motivação
                  </span>
                  <p className="text-xs text-neutral-300 font-medium leading-relaxed italic">
                    "{report.reason}"
                  </p>
                </div>

                {/* Notas de resolução existentes */}
                {report.resolution_notes && (
                  <div className="bg-neutral-900/30 p-3 rounded-xl border border-neutral-850/40 text-xs space-y-1">
                    <span className="text-[9px] uppercase font-bold text-violet-450 tracking-wider">Notas de Resolução:</span>
                    <p className="text-neutral-400 font-medium">{report.resolution_notes}</p>
                  </div>
                )}

                {/* Status do perfil denunciado */}
                {!isPending && report.reported_profile && (
                  <div className="text-[11px] font-semibold flex items-center gap-1 text-neutral-500">
                    <span>Status atual do perfil denunciado:</span>
                    <span className={report.reported_profile.is_active ? 'text-emerald-450' : 'text-red-400'}>
                      {report.reported_profile.is_active ? 'Ativo / Visível' : 'Suspenso / Oculto'}
                    </span>
                  </div>
                )}

                {/* Ações de Moderação */}
                {isPending && (
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button
                      onClick={() => openActionModal(report, 'resolved', 'hide_profile')}
                      className="bg-red-650 hover:bg-red-600 text-white font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 shadow-md shadow-red-950/20"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      Suspender Perfil
                    </Button>
                    <Button
                      onClick={() => openActionModal(report, 'resolved', 'none')}
                      variant="outline"
                      className="border-neutral-800 text-white hover:bg-neutral-850 font-semibold text-xs py-2 px-4 rounded-lg"
                    >
                      Manter Perfil Ativo
                    </Button>
                    <Button
                      onClick={() => openActionModal(report, 'dismissed', 'none')}
                      variant="ghost"
                      className="text-neutral-550 hover:text-neutral-300 font-semibold text-xs py-2 px-4 rounded-lg"
                    >
                      Ignorar / Arquivar
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal / Dialog de Confirmação e Nota de Auditoria */}
      <Dialog open={isActionOpen} onOpenChange={setIsActionOpen}>
        <DialogContent className="bg-neutral-950 border border-neutral-850 text-white p-6 max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Shield className="w-5 h-5 text-violet-400" />
              Decisão de Moderação
            </DialogTitle>
            <DialogDescription className="text-neutral-450 text-xs mt-1.5 leading-relaxed">
              Você está {actionType === 'dismissed' ? 'arquivando a denúncia' : profileAction === 'hide_profile' ? 'suspendendo o perfil' : 'resolvendo a denúncia sem suspender o perfil'} de <span className="text-violet-400">@{selectedReport?.reported_profile?.username}</span>. Digite a justificativa.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleExecuteAction} className="space-y-4 mt-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="moderation-notes" className="text-xs text-neutral-400 font-semibold">Notas de Resolução (Obrigatório)</Label>
              <Textarea
                id="moderation-notes"
                placeholder="Ex: Conteúdo ofensivo verificado e perfil ocultado do explorador..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={1000}
                required
                rows={4}
                className="bg-neutral-900 border-neutral-800 focus:border-violet-500 rounded-lg text-xs p-3 text-white placeholder-neutral-700 outline-none w-full"
              />
            </div>

            <DialogFooter className="flex gap-3 justify-end pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsActionOpen(false)}
                className="text-neutral-455 hover:text-white"
              >
                Voltar
              </Button>
              <Button
                type="submit"
                disabled={submitting || !notes.trim()}
                className={`font-extrabold text-xs shadow ${
                  actionType === 'dismissed' 
                    ? 'bg-neutral-800 hover:bg-neutral-700 text-white' 
                    : profileAction === 'hide_profile'
                      ? 'bg-red-650 hover:bg-red-600 text-white'
                      : 'bg-violet-650 hover:bg-violet-600 text-white'
                }`}
              >
                {submitting ? 'Executando...' : 'Aplicar Decisão'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
