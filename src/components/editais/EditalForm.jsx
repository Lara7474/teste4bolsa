import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';

export default function EditalForm({ initialData, onSubmit, isLoading }) {
  const [form, setForm] = useState(initialData || {
    numero_edital: '', titulo: '', status: 'rascunho', data_publicacao: '',
    data_limite_inscricao: '', modalidade_bolsa: '', quantidade_vagas: 1,
    valor_bolsa: '', nome_projeto: '', instituicao: '', unidade_executora: '',
  });

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-xs">Nº Edital *</Label><Input value={form.numero_edital} onChange={(e) => set('numero_edital', e.target.value)} /></div>
        <div>
          <Label className="text-xs">Status</Label>
          <Select value={form.status} onValueChange={(v) => set('status', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="rascunho">Rascunho</SelectItem>
              <SelectItem value="publicado">Publicado</SelectItem>
              <SelectItem value="inscricoes_abertas">Inscrições Abertas</SelectItem>
              <SelectItem value="inscricoes_encerradas">Inscrições Encerradas</SelectItem>
              <SelectItem value="selecao">Em Seleção</SelectItem>
              <SelectItem value="resultado">Resultado</SelectItem>
              <SelectItem value="encerrado">Encerrado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div><Label className="text-xs">Título *</Label><Input value={form.titulo} onChange={(e) => set('titulo', e.target.value)} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-xs">Data Publicação</Label><Input type="date" value={form.data_publicacao} onChange={(e) => set('data_publicacao', e.target.value)} /></div>
        <div><Label className="text-xs">Data Limite Inscrição</Label><Input type="date" value={form.data_limite_inscricao} onChange={(e) => set('data_limite_inscricao', e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div><Label className="text-xs">Modalidade</Label><Input value={form.modalidade_bolsa} onChange={(e) => set('modalidade_bolsa', e.target.value)} /></div>
        <div><Label className="text-xs">Vagas</Label><Input type="number" min={1} value={form.quantidade_vagas} onChange={(e) => set('quantidade_vagas', parseInt(e.target.value) || 1)} /></div>
        <div><Label className="text-xs">Valor Bolsa (R$)</Label><Input type="number" value={form.valor_bolsa} onChange={(e) => set('valor_bolsa', parseFloat(e.target.value) || '')} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-xs">Projeto</Label><Input value={form.nome_projeto} onChange={(e) => set('nome_projeto', e.target.value)} /></div>
        <div><Label className="text-xs">Instituição</Label><Input value={form.instituicao} onChange={(e) => set('instituicao', e.target.value)} /></div>
      </div>
      <div><Label className="text-xs">Unidade Executora</Label><Input value={form.unidade_executora} onChange={(e) => set('unidade_executora', e.target.value)} /></div>
      <div className="flex justify-end">
        <Button onClick={() => onSubmit(form)} disabled={isLoading} className="bg-primary">
          <Save className="w-4 h-4 mr-2" /> Salvar
        </Button>
      </div>
    </div>
  );
}
