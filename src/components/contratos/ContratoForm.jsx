import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageHeader from '@/components/shared/PageHeader';

const Field = ({ label, children }) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</Label>
    {children}
  </div>
);

const GESTORAS = ['Marcella', 'Michelle', 'Flávia', 'Letícia', 'Fernanda', 'Lauriana', 'Jéssica', 'Maria Eduarda', 'Brenda', 'Imaculada', 'Outro'];

export default function ContratoForm({ initialData, onSubmit, onCancel, isLoading }) {
  const [form, setForm] = useState(initialData || {
    numero_contrato: '',
    numero_projeto: '',
    nome_coordenador: '',
    nome_bolsista: '',
    cpf_bolsista: '',
    meta_etapa: '',
    tipo_bolsa: '',
    status: 'ativo',
    periodo: '',
    data_inicio: '',
    data_fim: '',
    duracao_meses: '',
    valor_mensal: '',
    total_contrato: '',
    periodo_recesso: '',
    status_esocial: 'pendente',
    distrato: '',
    termo_sei: '',
    gestora: '',
    seguro_vida: 2.55,
    auxilio_transporte: '',
    instituicao: '',
    financiadora: '',
    observacoes: '',
  });

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div className="space-y-4">
      <PageHeader
        title={initialData ? 'Editar Contrato' : 'Novo Contrato'}
        description="Preencha os dados do contrato de bolsa"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Identificação */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Identificação</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Field label="ID do Contrato">
              <Input value={form.numero_contrato} onChange={e => set('numero_contrato', e.target.value)} placeholder="ex: ABC001" />
            </Field>
            <Field label="Nº do Projeto">
              <Input value={form.numero_projeto} onChange={e => set('numero_projeto', e.target.value)} placeholder="ex: 675 ou 1009 sub 43" />
            </Field>
            <Field label="Meta / Etapa">
              <Input value={form.meta_etapa} onChange={e => set('meta_etapa', e.target.value)} placeholder="ex: Meta 3 / Etapa 2" />
            </Field>
            <Field label="Gestora">
              <Select value={form.gestora} onValueChange={v => set('gestora', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{GESTORAS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
          </CardContent>
        </Card>

        {/* Bolsista */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Dados do Bolsista</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Field label="Nome Completo">
              <Input value={form.nome_bolsista} onChange={e => set('nome_bolsista', e.target.value)} placeholder="Nome do bolsista" className="col-span-2" />
            </Field>
            <Field label="CPF">
              <Input value={form.cpf_bolsista} onChange={e => set('cpf_bolsista', e.target.value)} placeholder="000.000.000-00" />
            </Field>
            <Field label="Coordenador">
              <Input value={form.nome_coordenador} onChange={e => set('nome_coordenador', e.target.value)} placeholder="Nome do coordenador" />
            </Field>
          </CardContent>
        </Card>

        {/* Tipo e Modalidade */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Tipo de Bolsa e Instituição</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Tipo de Bolsa">
              <Input value={form.tipo_bolsa} onChange={e => set('tipo_bolsa', e.target.value)} placeholder="ex: Bolsa de Estímulo à Inovação - Embrapa Soja" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Instituição">
                <Input value={form.instituicao} onChange={e => set('instituicao', e.target.value)} placeholder="ex: Embrapa Soja" />
              </Field>
              <Field label="Financiadora">
                <Input value={form.financiadora} onChange={e => set('financiadora', e.target.value)} placeholder="ex: Embrapa, FAPEMIG" />
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* Vigência e Valores */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Vigência e Valores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Período (texto livre)">
              <Textarea value={form.periodo} onChange={e => set('periodo', e.target.value)} placeholder="ex: 01/12/2024 a 31/05/2025&#10;01/06/2025 a 30/11/2025" rows={2} />
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Data Início">
                <Input type="date" value={form.data_inicio} onChange={e => set('data_inicio', e.target.value)} />
              </Field>
              <Field label="Data Fim">
                <Input type="date" value={form.data_fim} onChange={e => set('data_fim', e.target.value)} />
              </Field>
              <Field label="Duração (meses)">
                <Input type="number" value={form.duracao_meses} onChange={e => set('duracao_meses', e.target.value)} placeholder="12" />
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Valor Mensal (R$)">
                <Input type="number" value={form.valor_mensal} onChange={e => set('valor_mensal', e.target.value)} placeholder="3250" />
              </Field>
              <Field label="Total Contrato (R$)">
                <Input type="number" value={form.total_contrato} onChange={e => set('total_contrato', e.target.value)} placeholder="39000" />
              </Field>
              <Field label="Recesso">
                <Input value={form.periodo_recesso} onChange={e => set('periodo_recesso', e.target.value)} placeholder="ex: 67º" />
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* Benefícios */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Benefícios e Controles</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Field label="Seguro de Vida (R$/mês)">
              <Input type="number" value={form.seguro_vida} onChange={e => set('seguro_vida', e.target.value)} placeholder="2.55" step="0.01" />
            </Field>
            <Field label="Auxílio Transporte (R$/mês)">
              <Input type="number" value={form.auxilio_transporte} onChange={e => set('auxilio_transporte', e.target.value)} placeholder="220" />
            </Field>
            <Field label="Status E-Social">
              <Select value={form.status_esocial} onValueChange={v => set('status_esocial', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ok">OK</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="termo_assinatura">Termo p/ Assinatura</SelectItem>
                  <SelectItem value="nao_aplicavel">Não Aplicável</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Status do Contrato">
              <Select value={form.status} onValueChange={v => set('status', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="encerrado">Encerrado</SelectItem>
                  <SelectItem value="suspenso">Suspenso</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                  <SelectItem value="vencido">Vencido</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </CardContent>
        </Card>

        {/* SEI e Autentique */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">SEI / Autentique / Distrato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Termo no SEI (data ou número)">
              <Input value={form.termo_sei} onChange={e => set('termo_sei', e.target.value)} placeholder="ex: 2025-06-27 ou ok" />
            </Field>
            <Field label="Distrato (data ou observação)">
              <Input value={form.distrato} onChange={e => set('distrato', e.target.value)} placeholder="ex: 2026-05-31 ou fazer distrato em 31/07/2026" />
            </Field>
            <Field label="Link Autentique">
              <Input value={form.link_autentique} onChange={e => set('link_autentique', e.target.value)} placeholder="https://..." />
            </Field>
            <Field label="Observações">
              <Textarea value={form.observacoes} onChange={e => set('observacoes', e.target.value)} rows={2} placeholder="Observações internas..." />
            </Field>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-3 pb-6">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={() => onSubmit(form)} disabled={isLoading} className="bg-primary hover:bg-primary/90">
          {isLoading ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar Contrato'}
        </Button>
      </div>
    </div>
  );
}
