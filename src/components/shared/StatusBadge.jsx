import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusConfig = {
  // Solicitação
  rascunho: { label: 'Rascunho', color: 'bg-muted text-muted-foreground' },
  enviada: { label: 'Enviada', color: 'bg-info/10 text-info border border-info/20' },
  em_analise_projetos: { label: 'Em Análise - Projetos', color: 'bg-warning/10 text-warning border border-warning/20' },
  diligencia: { label: 'Diligência', color: 'bg-warning/10 text-warning border border-warning/20' },
  aprovada_projetos: { label: 'Aprovada - Projetos', color: 'bg-success/10 text-success border border-success/20' },
  reprovada_projetos: { label: 'Reprovada', color: 'bg-destructive/10 text-destructive border border-destructive/20' },
  em_analise_bolsas: { label: 'Em Análise - Bolsas', color: 'bg-info/10 text-info border border-info/20' },
  edital_publicado: { label: 'Edital Publicado', color: 'bg-primary/10 text-primary border border-primary/20' },
  contratacao: { label: 'Em Contratação', color: 'bg-info/10 text-info border border-info/20' },
  concluida: { label: 'Concluída', color: 'bg-success/10 text-success border border-success/20' },
  cancelada: { label: 'Cancelada', color: 'bg-muted text-muted-foreground' },
  // Contrato
  ativo: { label: 'Ativo', color: 'bg-success/10 text-success border border-success/20' },
  encerrado: { label: 'Encerrado', color: 'bg-muted text-muted-foreground' },
  suspenso: { label: 'Suspenso', color: 'bg-warning/10 text-warning border border-warning/20' },
  cancelado: { label: 'Cancelado', color: 'bg-destructive/10 text-destructive border border-destructive/20' },
  vencido: { label: 'Vencido', color: 'bg-destructive/10 text-destructive border border-destructive/20' },
  proximo_vencimento: { label: 'Próx. Vencimento', color: 'bg-warning/10 text-warning border border-warning/20' },
  // Edital
  publicado: { label: 'Publicado', color: 'bg-success/10 text-success border border-success/20' },
  inscricoes_abertas: { label: 'Inscrições Abertas', color: 'bg-info/10 text-info border border-info/20' },
  inscricoes_encerradas: { label: 'Inscrições Encerradas', color: 'bg-warning/10 text-warning border border-warning/20' },
  selecao: { label: 'Em Seleção', color: 'bg-primary/10 text-primary border border-primary/20' },
  resultado: { label: 'Resultado', color: 'bg-success/10 text-success border border-success/20' },
  // Aditivo / Distrato
  pendente: { label: 'Pendente', color: 'bg-warning/10 text-warning border border-warning/20' },
  aprovado: { label: 'Aprovado', color: 'bg-success/10 text-success border border-success/20' },
  assinado: { label: 'Assinado', color: 'bg-primary/10 text-primary border border-primary/20' },
  // Documento
  gerado: { label: 'Gerado', color: 'bg-info/10 text-info border border-info/20' },
  enviado_assinatura: { label: 'Enviado p/ Assinatura', color: 'bg-warning/10 text-warning border border-warning/20' },
  // Bolsista
  candidato: { label: 'Candidato', color: 'bg-info/10 text-info border border-info/20' },
  selecionado: { label: 'Selecionado', color: 'bg-primary/10 text-primary border border-primary/20' },
  contratado: { label: 'Contratado', color: 'bg-success/10 text-success border border-success/20' },
  desistente: { label: 'Desistente', color: 'bg-muted text-muted-foreground' },
  // Assinatura
  enviado: { label: 'Enviado', color: 'bg-info/10 text-info border border-info/20' },
  recusado: { label: 'Recusado', color: 'bg-destructive/10 text-destructive border border-destructive/20' },
  // Contrato tipos
  bolsa: { label: 'Bolsa', color: 'bg-primary/10 text-primary border border-primary/20' },
  estagio: { label: 'Estágio', color: 'bg-info/10 text-info border border-info/20' },
};

export default function StatusBadge({ status, className }) {
  const config = statusConfig[status] || { label: status, color: 'bg-muted text-muted-foreground' };
  return (
    <Badge className={cn('font-medium text-[11px] px-2.5 py-0.5', config.color, className)}>
      {config.label}
    </Badge>
  );
}
