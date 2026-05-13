import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { FLUXO_STEPS } from './FluxoKanban';

const TIPOS = Object.keys(FLUXO_STEPS);

export default function FluxoForm({ onSubmit, onCancel, isLoading }) {
  const [form, setForm] = useState({
    tipo_processo: '',
    prioridade: 'Média',
    solicitante_nome: '',
    solicitante_email: '',
    projeto: '',
    bolsista_nome: '',
    observacao_atual: '',
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const steps = FLUXO_STEPS[form.tipo_processo] || [];
    const first = steps[0];
    onSubmit({
      ...form,
      status_atual: first?.status || 'Recebido',
      etapa_numero: 1,
      responsavel_atual: first?.responsavel || 'Bolsas',
      acao_necessaria: first?.acao || '',
      historico: [{
        data: new Date().toISOString(),
        usuario: form.solicitante_nome || 'Sistema',
        de_status: '',
        para_status: first?.status || 'Recebido',
        responsavel: first?.responsavel || 'Bolsas',
        observacao: 'Solicitação criada',
      }],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onCancel}><ArrowLeft className="w-4 h-4" /></Button>
        <h2 className="text-xl font-bold">Nova Solicitação de Fluxo</h2>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Dados da Solicitação</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Tipo de Processo *</Label>
                <Select value={form.tipo_processo} onValueChange={v => set('tipo_processo', v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {TIPOS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Prioridade</Label>
                <Select value={form.prioridade} onValueChange={v => set('prioridade', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Baixa','Média','Alta','Urgente'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Nome do Solicitante *</Label>
                <Input value={form.solicitante_nome} onChange={e => set('solicitante_nome', e.target.value)} required />
              </div>
              <div>
                <Label className="text-xs">E-mail do Solicitante</Label>
                <Input type="email" value={form.solicitante_email} onChange={e => set('solicitante_email', e.target.value)} />
              </div>
              <div>
                <Label className="text-xs">Projeto</Label>
                <Input value={form.projeto} onChange={e => set('projeto', e.target.value)} placeholder="Nº do projeto" />
              </div>
              <div>
                <Label className="text-xs">Bolsista</Label>
                <Input value={form.bolsista_nome} onChange={e => set('bolsista_nome', e.target.value)} />
              </div>
            </div>
            <div>
              <Label className="text-xs">Observações</Label>
              <Textarea value={form.observacao_atual} onChange={e => set('observacao_atual', e.target.value)} rows={3} />
            </div>
            {form.tipo_processo && (
              <div className="bg-accent/50 rounded-lg p-3 text-xs text-muted-foreground">
                <strong className="text-foreground">Fluxo:</strong>{' '}
                {(FLUXO_STEPS[form.tipo_processo] || []).map(s => s.status).join(' → ')}
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
              <Button type="submit" disabled={isLoading || !form.tipo_processo || !form.solicitante_nome} className="bg-primary">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Criar Solicitação
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
