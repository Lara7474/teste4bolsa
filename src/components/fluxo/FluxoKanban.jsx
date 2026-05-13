import React from 'react';
import { Clock, CheckCircle2, AlertTriangle, User } from 'lucide-react';

// Fluxo de status por tipo de processo
export const FLUXO_STEPS = {
  'Termo de Referência - Abertura de Edital': [
    { status: 'Recebido', responsavel: 'Projetos', acao: 'Validar projeto, rubrica e disponibilidade financeira' },
    { status: 'Aguardando análise de Projetos', responsavel: 'Projetos', acao: 'Validar projeto, rubrica e disponibilidade financeira' },
    { status: 'Aguardando emissão do edital', responsavel: 'Bolsas', acao: 'Emitir edital após validação do setor de Projetos' },
    { status: 'Edital emitido', responsavel: 'Bolsas', acao: 'Gerar e conferir edital' },
  ],
  'Contratação de Bolsista': [
    { status: 'Recebido', responsavel: 'Bolsas', acao: 'Conferir dados e documentos do bolsista' },
    { status: 'Aguardando conferência documental', responsavel: 'Bolsas', acao: 'Conferir dados e documentos do bolsista' },
    { status: 'Aguardando emissão do termo de outorga', responsavel: 'Bolsas', acao: 'Gerar termo de outorga' },
    { status: 'Aguardando assinatura', responsavel: 'Bolsista', acao: 'Assinar termo de outorga' },
    { status: 'Contratado', responsavel: 'Bolsas', acao: 'Concluir contratação' },
  ],
  'Aditivo de valor': [
    { status: 'Recebido', responsavel: 'Bolsas', acao: 'Buscar contrato ativo' },
    { status: 'Aguardando validação do contrato ativo', responsavel: 'Bolsas', acao: 'Buscar contrato ativo no BD_CONTRATOS' },
    { status: 'Aguardando emissão do aditivo', responsavel: 'Bolsas', acao: 'Gerar aditivo de valor' },
    { status: 'Aditivo emitido', responsavel: 'Bolsas', acao: 'Aditivo gerado' },
  ],
  'Aditivo de modalidade': [
    { status: 'Recebido', responsavel: 'Bolsas', acao: 'Buscar contrato ativo' },
    { status: 'Aguardando validação do contrato ativo', responsavel: 'Bolsas', acao: 'Buscar contrato ativo no BD_CONTRATOS' },
    { status: 'Aguardando emissão do aditivo', responsavel: 'Bolsas', acao: 'Gerar aditivo de modalidade' },
    { status: 'Aditivo emitido', responsavel: 'Bolsas', acao: 'Aditivo gerado' },
  ],
  'Aditivo de período': [
    { status: 'Recebido', responsavel: 'Bolsas', acao: 'Buscar contrato ativo' },
    { status: 'Aguardando validação do contrato ativo', responsavel: 'Bolsas', acao: 'Buscar contrato ativo no BD_CONTRATOS' },
    { status: 'Aguardando emissão do aditivo', responsavel: 'Bolsas', acao: 'Gerar aditivo de período' },
    { status: 'Aditivo emitido', responsavel: 'Bolsas', acao: 'Aditivo gerado' },
  ],
  'Distrato': [
    { status: 'Recebido', responsavel: 'Bolsas', acao: 'Buscar contrato ativo' },
    { status: 'Aguardando validação do contrato ativo', responsavel: 'Bolsas', acao: 'Buscar contrato ativo no BD_CONTRATOS' },
    { status: 'Aguardando emissão do distrato', responsavel: 'Bolsas', acao: 'Gerar termo de distrato' },
    { status: 'Distrato emitido', responsavel: 'Bolsas', acao: 'Distrato gerado' },
  ],
};

const COLUNAS_KANBAN = [
  { id: 'Solicitante', label: 'Solicitante', color: 'bg-blue-50 border-blue-200', dot: 'bg-blue-500' },
  { id: 'Projetos', label: 'Setor de Projetos', color: 'bg-amber-50 border-amber-200', dot: 'bg-amber-500' },
  { id: 'Bolsas', label: 'Setor de Bolsas', color: 'bg-purple-50 border-purple-200', dot: 'bg-purple-500' },
  { id: 'Bolsista', label: 'Bolsista', color: 'bg-green-50 border-green-200', dot: 'bg-green-500' },
];

const TIPO_COLORS = {
  'Termo de Referência - Abertura de Edital': 'bg-blue-100 text-blue-800',
  'Contratação de Bolsista': 'bg-green-100 text-green-800',
  'Aditivo de valor': 'bg-orange-100 text-orange-800',
  'Aditivo de modalidade': 'bg-purple-100 text-purple-800',
  'Aditivo de período': 'bg-teal-100 text-teal-800',
  'Distrato': 'bg-red-100 text-red-800',
};

export default function FluxoKanban({ fluxos, isLoading, onSelect }) {
  if (isLoading) return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {COLUNAS_KANBAN.map(col => {
        const items = fluxos.filter(f => f.responsavel_atual === col.id);
        return (
          <div key={col.id} className={`rounded-xl border-2 ${col.color} min-h-[300px]`}>
            <div className="p-3 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                <h3 className="font-semibold text-sm text-foreground">{col.label}</h3>
              </div>
              <span className="text-xs bg-white/60 text-muted-foreground px-2 py-0.5 rounded-full font-medium">{items.length}</span>
            </div>
            <div className="p-2 space-y-2">
              {items.map(f => (
                <button key={f.id} onClick={() => onSelect(f)} className="w-full text-left">
                  <div className="bg-white rounded-lg p-3 border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${TIPO_COLORS[f.tipo_processo] || 'bg-muted text-muted-foreground'}`}>
                        {f.tipo_processo?.split(' ').slice(0, 2).join(' ')}
                      </span>
                      <PrioridadeBadge prioridade={f.prioridade} />
                    </div>
                    {f.projeto && <p className="text-xs font-bold text-primary">Projeto {f.projeto}</p>}
                    {f.bolsista_nome && <p className="text-xs text-foreground font-medium truncate">{f.bolsista_nome}</p>}
                    {f.solicitante_nome && <p className="text-[11px] text-muted-foreground truncate">{f.solicitante_nome}</p>}
                    <p className="text-[10px] text-muted-foreground mt-1.5 border-t border-border/40 pt-1.5 truncate">{f.status_atual}</p>
                  </div>
                </button>
              ))}
              {items.length === 0 && (
                <div className="text-center py-6 text-muted-foreground text-xs">Nenhuma solicitação</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PrioridadeBadge({ prioridade }) {
  const map = { Baixa: 'text-muted-foreground', Média: 'text-amber-600', Alta: 'text-orange-600', Urgente: 'text-red-600' };
  if (!prioridade) return null;
  return <AlertTriangle className={`w-3.5 h-3.5 flex-shrink-0 ${map[prioridade] || 'text-muted-foreground'}`} />;
}
