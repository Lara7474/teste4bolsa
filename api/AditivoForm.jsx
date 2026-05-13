import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';

export default function AditivoForm({ initialData, onSubmit, isLoading }) {
  const [form, setForm] = useState(initialData || {
    contrato_id: '', numero_contrato: '', nome_bolsista: '', tipo_aditivo: '',
    status: 'rascunho', valor_anterior: '', valor_novo: '', modalidade_anterior: '',
    modalidade_nova: '', data_fim_anterior: '', data_fim_nova: '', justificativa: '',
  });

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-xs">Nº Contrato</Label><Input value={form.numero_contrato} onChange={(e) => set('numero_contrato', e.target.value)} /></div>
        <div><Label className="text-xs">Bolsista</Label><Input value={form.nome_bolsista} onChange={(e) => set('nome_bolsista', e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Tipo de Aditivo *</Label>
          <Select value={form.tipo_aditivo} onValueChange={(v) => set('tipo_aditivo', v)}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="valor">Valor</SelectItem>
              <SelectItem value="modalidade">Modalidade</SelectItem>
              <SelectItem value="periodo">Período</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Status</Label>
          <Select value={form.status} onValueChange={(v) => set('status', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="rascunho">Rascunho</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="aprovado">Aprovado</SelectItem>
              <SelectItem value="assinado">Assinado</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {form.tipo_aditivo === 'valor' && (
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="text-xs">Valor Anterior (R$)</Label><Input type="number" value={form.valor_anterior} onChange={(e) => set('valor_anterior', parseFloat(e.target.value) || '')} /></div>
          <div><Label className="text-xs">Valor Novo (R$)</Label><Input type="number" value={form.valor_novo} onChange={(e) => set('valor_novo', parseFloat(e.target.value) || '')} /></div>
        </div>
      )}
      {form.tipo_aditivo === 'modalidade' && (
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="text-xs">Modalidade Anterior</Label><Input value={form.modalidade_anterior} onChange={(e) => set('modalidade_anterior', e.target.value)} /></div>
          <div><Label className="text-xs">Modalidade Nova</Label><Input value={form.modalidade_nova} onChange={(e) => set('modalidade_nova', e.target.value)} /></div>
        </div>
      )}
      {form.tipo_aditivo === 'periodo' && (
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="text-xs">Data Fim Anterior</Label><Input type="date" value={form.data_fim_anterior} onChange={(e) => set('data_fim_anterior', e.target.value)} /></div>
          <div><Label className="text-xs">Data Fim Nova</Label><Input type="date" value={form.data_fim_nova} onChange={(e) => set('data_fim_nova', e.target.value)} /></div>
        </div>
      )}
      <div><Label className="text-xs">Justificativa</Label><Textarea value={form.justificativa} onChange={(e) => set('justificativa', e.target.value)} rows={3} /></div>
      <div className="flex justify-end">
        <Button onClick={() => onSubmit(form)} disabled={isLoading} className="bg-primary"><Save className="w-4 h-4 mr-2" /> Salvar</Button>
      </div>
    </div>
  );
}
