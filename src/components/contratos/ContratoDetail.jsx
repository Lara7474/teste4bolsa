import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Pencil, Trash2, ExternalLink, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';
import { format, parseISO, differenceInDays } from 'date-fns';

const Field = ({ label, value, className = '' }) => (
  <div className={className}>
    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
    <p className="text-sm text-foreground">{value || <span className="text-muted-foreground italic">—</span>}</p>
  </div>
);

export default function ContratoDetail({ item, onBack, onEdit, onDelete }) {
  if (!item) return null;

  const today = new Date();
  const diasRestantes = item.data_fim ? differenceInDays(parseISO(item.data_fim), today) : null;

  const esocialIcon = item.status_esocial === 'ok'
    ? <CheckCircle2 className="w-4 h-4 text-success inline mr-1" />
    : item.status_esocial === 'termo_assinatura'
      ? <Clock className="w-4 h-4 text-warning inline mr-1" />
      : <AlertCircle className="w-4 h-4 text-muted-foreground inline mr-1" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit} size="sm"><Pencil className="w-4 h-4 mr-1" />Editar</Button>
          <Button variant="destructive" onClick={onDelete} size="sm"><Trash2 className="w-4 h-4 mr-1" />Excluir</Button>
        </div>
      </div>

      {/* Cabeçalho */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="pt-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">{item.numero_contrato || 'S/N'}</span>
                <span className="text-xs text-muted-foreground">Projeto: <strong>{item.numero_projeto}</strong></span>
                {item.meta_etapa && <span className="text-xs bg-muted px-2 py-0.5 rounded">{item.meta_etapa}</span>}
              </div>
              <h2 className="text-xl font-bold text-foreground">{item.nome_bolsista}</h2>
              {item.cpf_bolsista && <p className="text-xs text-muted-foreground">CPF: {item.cpf_bolsista}</p>}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={item.status} />
              {diasRestantes !== null && (
                <Badge className={diasRestantes < 0 ? 'bg-destructive/10 text-destructive' : diasRestantes <= 30 ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}>
                  {diasRestantes < 0 ? `Vencido há ${Math.abs(diasRestantes)}d` : `${diasRestantes} dias restantes`}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Dados principais */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3"><CardTitle className="text-sm">Dados do Contrato</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Field label="Coordenador" value={item.nome_coordenador} className="col-span-2" />
            <Field label="Tipo de Bolsa" value={item.tipo_bolsa} className="col-span-2" />
            <Field label="Instituição" value={item.instituicao} />
            <Field label="Financiadora" value={item.financiadora} />
            <Field label="Período" value={item.periodo || (item.data_inicio && item.data_fim ? `${item.data_inicio} a ${item.data_fim}` : null)} className="col-span-2" />
            <Field label="Início" value={item.data_inicio ? format(parseISO(item.data_inicio), 'dd/MM/yyyy') : null} />
            <Field label="Fim" value={item.data_fim ? format(parseISO(item.data_fim), 'dd/MM/yyyy') : null} />
            <Field label="Duração" value={item.duracao_meses ? `${item.duracao_meses} meses` : null} />
            <Field label="Período de Recesso" value={item.periodo_recesso} />
          </CardContent>
        </Card>

        {/* Valores e controles */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Valores</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Valor Mensal</p>
                <p className="text-2xl font-bold text-primary">
                  {item.valor_mensal ? `R$ ${Number(item.valor_mensal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}
                </p>
              </div>
              <Field label="Total do Contrato" value={item.total_contrato ? `R$ ${Number(item.total_contrato).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : null} />
              <Field label="Seguro de Vida" value={item.seguro_vida ? `R$ ${Number(item.seguro_vida).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês` : null} />
              <Field label="Auxílio Transporte" value={item.auxilio_transporte ? `R$ ${Number(item.auxilio_transporte).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês` : null} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Controles</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Status E-Social</p>
                <p className="text-sm">{esocialIcon}{item.status_esocial || '—'}</p>
              </div>
              <Field label="Gestora" value={item.gestora} />
              <Field label="Termo no SEI" value={item.termo_sei} />
              <Field label="Distrato" value={item.distrato} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Autentique e Observações */}
      {(item.link_autentique || item.observacoes) && (
        <Card>
          <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {item.link_autentique && (
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Autentique</p>
                <a href={item.link_autentique} target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" /> Abrir documento
                </a>
              </div>
            )}
            {item.observacoes && <Field label="Observações" value={item.observacoes} />}
          </CardContent>
        </Card>
      )}

      {/* Histórico */}
      {item.historico?.length > 0 && (
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Histórico</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {item.historico.map((h, i) => (
                <div key={i} className="flex gap-3 text-sm border-l-2 border-muted pl-3">
                  <span className="text-muted-foreground text-xs min-w-[100px]">{h.data}</span>
                  <span className="font-medium">{h.acao}</span>
                  {h.detalhes && <span className="text-muted-foreground">{h.detalhes}</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
