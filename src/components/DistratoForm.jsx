import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';

export default function DistratoForm({ initialData, onSubmit, isLoading }) {
  const [form, setForm] = useState(initialData || {
    contrato_id: '', numero_contrato: '', nome_bolsista: '', motivo: '',
    data_encerramento: '', status: 'rascunho',
  });

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-xs">Nº Contrato</Label><Input value={form.numero_contrato} onChange={(e) => set('numero_contrato', e.target.value)} /></div>
        <div><Label className="text-xs">Bolsista</Label><Input value={form.nome_bolsista} onChange={(e) => set('nome_bolsista', e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-xs">Data Encerramento</Label><Input type="date" value={form.data_encerramento} onChange={(e) => set('data_encerramento', e.target.value)} /></div>
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
      <div><Label className="text-xs">Motivo *</Label><Textarea value={form.motivo} onChange={(e) => set('motivo', e.target.value)} rows={3} /></div>
      <div className="flex justify-end">
        <Button onClick={() => onSubmit(form)} disabled={isLoading} className="bg-primary"><Save className="w-4 h-4 mr-2" /> Salvar</Button>
      </div>
    </div>
  );
}
