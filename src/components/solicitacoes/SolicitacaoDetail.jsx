import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, Send, AlertTriangle } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import DocumentoGenerator from '@/components/documentos/DocumentoGenerator';
import { labelOf, getVisibleFields } from '@/lib/processoBolsasRules';

const InfoField = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
    <p className="text-sm font-medium mt-0.5 break-words">{value === true ? 'Sim' : value === false ? 'Não' : value || '—'}</p>
  </div>
);

const statusTransitions = [
  { from: 'Recebido', to: 'Em análise - Projetos', label: 'Enviar para Projetos' },
  { from: 'Em análise - Projetos', to: 'Aprovado - Projetos', label: 'Aprovar Projetos' },
  { from: 'Aprovado - Projetos', to: 'Aguardando emissão do edital', label: 'Liberar Edital' },
  { from: 'Aguardando emissão do edital', to: 'Edital emitido', label: 'Marcar Edital emitido' },
  { from: 'Edital emitido', to: 'Candidato aprovado', label: 'Registrar candidato aprovado' },
  { from: 'Candidato aprovado', to: 'Documentos recebidos', label: 'Liberar cadastro do bolsista' },
  { from: 'Documentos recebidos', to: 'Aguardando emissão do termo de outorga', label: 'Liberar Termo de Outorga' },
  { from: 'Aguardando emissão do termo de outorga', to: 'Contrato gerado', label: 'Marcar contrato gerado' },
  { from: 'Contrato gerado', to: 'Contrato ativo', label: 'Ativar contrato' },
  { from: 'Aguardando emissão do aditivo', to: 'Aditivo gerado', label: 'Marcar aditivo gerado' },
  { from: 'Aguardando emissão do distrato', to: 'Distrato gerado', label: 'Marcar distrato gerado' },
];

export default function SolicitacaoDetail({ item, onBack, onUpdate, isUpdating }) {
  const tipo = item.TipoSolicitacao || 'Contratação';
  const status = item.Status || 'Recebido';
  const solicitanteFields = getVisibleFields({ perfil: 'Solicitante', tipoSolicitacao: tipo }).filter((f) => item[f] !== undefined && item[f] !== '');
  const bolsistaFields = getVisibleFields({ perfil: 'Bolsista', tipoSolicitacao: tipo }).filter((f) => item[f] !== undefined && item[f] !== '');
  const projetoFields = getVisibleFields({ perfil: 'Projetos', tipoSolicitacao: tipo }).filter((f) => item[f] !== undefined && item[f] !== '');
  const next = statusTransitions.find((s) => s.from === status);

  const advanceStatus = () => {
    if (!next) return;
    const historico = [
      ...(item.historico || []),
      { data: new Date().toISOString(), usuario: 'Sistema', acao: `Status alterado para ${next.to}`, detalhes: `Fluxo anterior: ${status}` },
    ];
    onUpdate(item.id, { ...item, Status: next.to, historico });
  };

  return (
    <div className="space-y-4">
      <PageHeader title={`Solicitação ${item.ID || item.id || ''}`} description={item.Projeto || item.NomeBolsista || 'Processo de Bolsas'}>
        <Badge variant="outline">{status}</Badge>
        <Button variant="outline" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button>
      </PageHeader>

      {item.__documentNeedsRefresh && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 flex gap-2">
          <AlertTriangle className="w-4 h-4" /> Há documento gerado que pode estar desatualizado por alteração nos campos.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Dados da Solicitação</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <InfoField label="Tipo de solicitação" value={tipo} />
            <InfoField label="Prioridade" value={item.Prioridade} />
            <InfoField label="Status" value={status} />
            <InfoField label="Responsável atual" value={item.ResponsavelAtual} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Ações do Fluxo</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-500">O próximo status é definido pela lógica do Processo de Bolsas.</p>
            <Button onClick={advanceStatus} disabled={!next || isUpdating} className="gap-2">
              {next ? <Send className="w-4 h-4" /> : <Check className="w-4 h-4" />}
              {next?.label || 'Fluxo concluído'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Campos do Solicitante</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {solicitanteFields.map((field) => <InfoField key={field} label={labelOf(field)} value={item[field]} />)}
        </CardContent>
      </Card>

      {projetoFields.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Análise do Setor de Projetos</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projetoFields.map((field) => <InfoField key={field} label={labelOf(field)} value={item[field]} />)}
          </CardContent>
        </Card>
      )}

      {bolsistaFields.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Cadastro do Bolsista</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bolsistaFields.map((field) => <InfoField key={field} label={labelOf(field)} value={item[field]} />)}
          </CardContent>
        </Card>
      )}

      <DocumentoGenerator item={item} onUpdate={onUpdate} />

      {item.historico?.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Histórico</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {item.historico.map((h, index) => (
              <div key={index} className="text-sm border-b pb-2 last:border-0 flex flex-wrap gap-2">
                <span className="text-muted-foreground">{new Date(h.data).toLocaleString('pt-BR')}</span>
                <span className="font-medium">{h.acao}</span>
                {h.detalhes && <span className="text-muted-foreground">— {h.detalhes}</span>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
