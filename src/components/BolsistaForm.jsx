import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';

export default function BolsistaForm({ initialData, onSubmit, isLoading }) {
  const [form, setForm] = useState(initialData || {
    nome_completo: '', cpf: '', rg: '', data_nascimento: '', nacionalidade: 'Brasileira',
    estado_civil: '', endereco: '', cidade: '', uf: '', cep: '', email: '', telefone: '',
    formacao_academica: '', banco: '', agencia: '', conta: '', tipo_conta: 'corrente',
    pix: '', declaracao_nao_acumulo: false, aceite_termos: false, numero_edital: '', status: 'candidato',
  });

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2"><Label className="text-xs">Nome Completo *</Label><Input value={form.nome_completo} onChange={(e) => set('nome_completo', e.target.value)} /></div>
        <div><Label className="text-xs">CPF *</Label><Input value={form.cpf} onChange={(e) => set('cpf', e.target.value)} /></div>
        <div><Label className="text-xs">RG</Label><Input value={form.rg} onChange={(e) => set('rg', e.target.value)} /></div>
        <div><Label className="text-xs">Data Nascimento</Label><Input type="date" value={form.data_nascimento} onChange={(e) => set('data_nascimento', e.target.value)} /></div>
        <div><Label className="text-xs">Nacionalidade</Label><Input value={form.nacionalidade} onChange={(e) => set('nacionalidade', e.target.value)} /></div>
        <div>
          <Label className="text-xs">Estado Civil</Label>
          <Select value={form.estado_civil} onValueChange={(v) => set('estado_civil', v)}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="solteiro">Solteiro(a)</SelectItem>
              <SelectItem value="casado">Casado(a)</SelectItem>
              <SelectItem value="divorciado">Divorciado(a)</SelectItem>
              <SelectItem value="viuvo">Viúvo(a)</SelectItem>
              <SelectItem value="uniao_estavel">União Estável</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label className="text-xs">E-mail</Label><Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></div>
        <div><Label className="text-xs">Telefone</Label><Input value={form.telefone} onChange={(e) => set('telefone', e.target.value)} /></div>
        <div className="md:col-span-2"><Label className="text-xs">Endereço</Label><Input value={form.endereco} onChange={(e) => set('endereco', e.target.value)} /></div>
        <div><Label className="text-xs">Cidade</Label><Input value={form.cidade} onChange={(e) => set('cidade', e.target.value)} /></div>
        <div><Label className="text-xs">UF</Label><Input value={form.uf} onChange={(e) => set('uf', e.target.value)} maxLength={2} /></div>
        <div><Label className="text-xs">CEP</Label><Input value={form.cep} onChange={(e) => set('cep', e.target.value)} /></div>
        <div><Label className="text-xs">Formação Acadêmica</Label><Input value={form.formacao_academica} onChange={(e) => set('formacao_academica', e.target.value)} /></div>
      </div>

      <div className="border-t pt-4">
        <p className="text-sm font-semibold mb-3">Dados Bancários</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div><Label className="text-xs">Banco</Label><Input value={form.banco} onChange={(e) => set('banco', e.target.value)} /></div>
          <div><Label className="text-xs">Agência</Label><Input value={form.agencia} onChange={(e) => set('agencia', e.target.value)} /></div>
          <div><Label className="text-xs">Conta</Label><Input value={form.conta} onChange={(e) => set('conta', e.target.value)} /></div>
          <div>
            <Label className="text-xs">Tipo</Label>
            <Select value={form.tipo_conta} onValueChange={(v) => set('tipo_conta', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="corrente">Corrente</SelectItem>
                <SelectItem value="poupanca">Poupança</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-3"><Label className="text-xs">Chave PIX</Label><Input value={form.pix} onChange={(e) => set('pix', e.target.value)} /></div>
      </div>

      <div className="border-t pt-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="text-xs">Nº Edital</Label><Input value={form.numero_edital} onChange={(e) => set('numero_edital', e.target.value)} /></div>
          <div>
            <Label className="text-xs">Status</Label>
            <Select value={form.status} onValueChange={(v) => set('status', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="candidato">Candidato</SelectItem>
                <SelectItem value="selecionado">Selecionado</SelectItem>
                <SelectItem value="contratado">Contratado</SelectItem>
                <SelectItem value="encerrado">Encerrado</SelectItem>
                <SelectItem value="desistente">Desistente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox checked={form.declaracao_nao_acumulo} onCheckedChange={(v) => set('declaracao_nao_acumulo', v)} />
          <Label className="text-xs">Declaração de não acúmulo de bolsa</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox checked={form.aceite_termos} onCheckedChange={(v) => set('aceite_termos', v)} />
          <Label className="text-xs">Aceite dos termos</Label>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={() => onSubmit(form)} disabled={isLoading} className="bg-primary">
          <Save className="w-4 h-4 mr-2" /> Salvar
        </Button>
      </div>
    </div>
  );
}
