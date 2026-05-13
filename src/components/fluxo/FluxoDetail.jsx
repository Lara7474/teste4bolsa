import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ChevronRight, Trash2, Loader2, CheckCircle2, Clock, User } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FLUXO_STEPS } from './FluxoKanban';

const RESPONSAVEL_COLORS = {
  Solicitante: 'bg-blue-100 text-blue-800',
  Projetos: 'bg-amber-100 text-amber-800',
  Bolsas: 'bg-purple-100 text-purple-800',
  Bolsista: 'bg-green-100 text-green-800',
};

export default function FluxoDetail({ item, onBack, onAdvance, onDelete, isUpdating }) {
  const [obs, setObs] = useState('');
  const steps = FLUXO_STEPS[item.tipo_processo] || [];
  const currentIdx = steps.findIndex(s => s.status === item.status_atual);
  const nextStep = steps[currentIdx + 1];
  const isFinished = currentIdx === steps.length - 1;

  const handleAdvance = () => {
    if (!nextStep) return;
    const newHistorico = [...(item.historico || []), {
      data: new Date().toISOString(),
      usuario: 'Usuário',
      de_status: item.status_atual,
      para_status: nextStep.status,
      responsavel: nextStep.responsavel,
      observacao: obs,
    }];
    onAdvance(item.id, {
      status_atual: nextStep.status,
      etapa_numero: (item.etapa_numero || 1) + 1,
      responsavel_atual: nextStep.responsavel,
      acao_necessaria: nextStep.acao,
      historico: newHistorico,
      observacao_atual: obs,
    }, {
      tipo: 'aprovacao_pendente',
      titulo: `Fluxo avançado: ${item.tipo_processo}`,
      mensagem: `Projeto ${item.projeto || '—'} avançou para "${nextStep.status}". Responsável: ${nextStep.responsavel}`,
      prioridade: 'media',
      destinatario_setor: nextStep.responsavel === 'Projetos' ? 'projetos' : 'bolsas',
    });
    setObs('');
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="w-4 h-4" /></Button>
          <div>
            <h2 className="text-xl font-bold">{item.tipo_processo}</h2>
            <p className="text-sm text-muted-foreground">{item.projeto ? `Projeto ${item.projeto}` : ''} {item.bolsista_nome ? `— ${item.bolsista_nome}` : ''}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => { if (confirm('Remover este processo?')) onDelete(item.id); }}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Progresso do Fluxo</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-start gap-2 overflow-x-auto pb-2">
            {steps.map((step, idx) => {
              const done = idx < currentIdx;
              const active = idx === currentIdx;
              return (
                <div key={step.status} className="flex items-center gap-1 flex-shrink-0">
                  <div className={`flex flex-col items-center gap-1 min-w-[100px]`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${done ? 'bg-success border-success text-white' : active ? 'bg-primary border-primary text-white' : 'bg-muted border-border text-muted-foreground'}`}>
                      {done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <p className={`text-[10px] text-center leading-tight ${active ? 'text-primary font-semibold' : done ? 'text-success' : 'text-muted-foreground'}`}>{step.status}</p>
                    <span className={`text-[9px] px-1 py-0.5 rounded ${RESPONSAVEL_COLORS[step.responsavel] || 'bg-muted text-muted-foreground'}`}>{step.responsavel}</span>
                  </div>
                  {idx < steps.length - 1 && <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-[-12px]" />}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Status */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Status Atual</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="font-semibold">{item.status_atual}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Responsável Atual</p>
              <span className={`text-xs font-medium px-2 py-1 rounded ${RESPONSAVEL_COLORS[item.responsavel_atual] || 'bg-muted'}`}>{item.responsavel_atual}</span>
            </div>
            {item.acao_necessaria && (
              <div>
                <p className="text-xs text-muted-foreground">Ação Necessária</p>
                <p className="text-sm">{item.acao_necessaria}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground">Prioridade</p>
              <p className="text-sm">{item.prioridade || '—'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Informações</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><span className="text-xs text-muted-foreground">Solicitante: </span>{item.solicitante_nome || '—'}</div>
            <div><span className="text-xs text-muted-foreground">E-mail: </span>{item.solicitante_email || '—'}</div>
            <div><span className="text-xs text-muted-foreground">Projeto: </span>{item.projeto || '—'}</div>
            <div><span className="text-xs text-muted-foreground">Bolsista: </span>{item.bolsista_nome || '—'}</div>
          </CardContent>
        </Card>
      </div>

      {/* Advance */}
      {!isFinished && nextStep && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-primary">Avançar para Próxima Etapa</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm"><strong>Próximo status:</strong> {nextStep.status} <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${RESPONSAVEL_COLORS[nextStep.responsavel] || 'bg-muted'}`}>{nextStep.responsavel}</span></p>
            <p className="text-xs text-muted-foreground"><strong>Ação:</strong> {nextStep.acao}</p>
            <div>
              <Label className="text-xs">Observação (opcional)</Label>
              <Textarea value={obs} onChange={e => setObs(e.target.value)} rows={2} placeholder="Adicione uma observação..." />
            </div>
            <Button onClick={handleAdvance} disabled={isUpdating} className="bg-primary">
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Avançar: {nextStep.status}
            </Button>
          </CardContent>
        </Card>
      )}

      {isFinished && (
        <Card className="border-success/20 bg-success/5">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <p className="text-sm font-medium text-success">Processo concluído com sucesso!</p>
          </CardContent>
        </Card>
      )}

      {/* History */}
      {(item.historico || []).length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Histórico</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...(item.historico || [])].reverse().map((h, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{h.para_status}</p>
                    <p className="text-xs text-muted-foreground">{h.usuario} · {h.responsavel} · {h.data ? format(parseISO(h.data), "dd/MM/yyyy HH:mm", { locale: ptBR }) : '—'}</p>
                    {h.observacao && <p className="text-xs mt-0.5 text-muted-foreground">{h.observacao}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
