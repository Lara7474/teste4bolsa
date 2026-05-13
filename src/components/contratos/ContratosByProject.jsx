import React, { useMemo, useState } from 'react';
import { Pencil, Trash2, List, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/shared/StatusBadge';

export default function ContratosByProject({ contratos, isLoading, onEdit, onDelete, onView }) {
  const [collapsed, setCollapsed] = useState({});

  const grouped = useMemo(() => {
    const map = {};
    contratos.forEach(c => {
      const key = c.numero_projeto || '(sem projeto)';
      if (!map[key]) map[key] = { projeto: key, coordenador: c.nome_coordenador, items: [] };
      map[key].items.push(c);
      // prefer first non-null coordenador
      if (!map[key].coordenador && c.nome_coordenador) map[key].coordenador = c.nome_coordenador;
    });
    return Object.values(map).sort((a, b) => String(a.projeto).localeCompare(String(b.projeto), 'pt-BR', { numeric: true }));
  }, [contratos]);

  if (isLoading) return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!grouped.length) return (
    <div className="text-center py-16 text-muted-foreground text-sm">Nenhum contrato encontrado.</div>
  );

  return (
    <div className="space-y-4">
      {grouped.map(({ projeto, coordenador, items }) => {
        const isOpen = !collapsed[projeto];
        return (
          <div key={projeto} className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
            {/* Project Header */}
            <button
              className="w-full flex items-center justify-between px-5 py-3 bg-muted/40 hover:bg-muted/70 transition-colors"
              onClick={() => setCollapsed(prev => ({ ...prev, [projeto]: !prev[projeto] }))}
            >
              <div className="flex items-center gap-3">
                {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                <span className="font-bold text-foreground text-base">{projeto}</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{items.length} bolsista{items.length !== 1 ? 's' : ''}</span>
              </div>
              {coordenador && <span className="text-xs text-muted-foreground hidden sm:block">{coordenador}</span>}
            </button>

            {/* Bolsistas */}
            {isOpen && (
              <div className="divide-y divide-border">
                {items.map(c => (
                  <ContratoCard key={c.id} contrato={c} onEdit={onEdit} onDelete={onDelete} onView={onView} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ContratoCard({ contrato: c, onEdit, onDelete, onView }) {
  return (
    <div className="px-5 py-4 hover:bg-accent/30 transition-colors group">
      {/* Coordenador */}
      {c.nome_coordenador && (
        <p className="text-xs font-semibold text-muted-foreground mb-1">{c.nome_coordenador}</p>
      )}

      {/* Nome bolsista */}
      <button
        className="text-left w-full"
        onClick={() => onView(c)}
      >
        <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">{c.nome_bolsista || '—'}</h3>
      </button>

      {/* Período */}
      {c.periodo && (
        <p className="text-xs text-muted-foreground mt-0.5 whitespace-pre-line leading-snug">
          {c.periodo.replace(/\n/g, '  ')}
        </p>
      )}

      {/* Tipo de bolsa */}
      {c.tipo_bolsa && (
        <p className="text-xs text-muted-foreground mt-1">{c.tipo_bolsa}</p>
      )}

      {/* Footer actions */}
      <div className="flex items-center justify-between mt-3 pt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onEdit(c)}
            className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors uppercase tracking-wide"
          >
            EDITAR
          </button>
          <StatusBadge status={c.status} />
          {c.valor_mensal && (
            <span className="text-xs font-medium text-foreground">
              R$ {Number(c.valor_mensal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10"
            onClick={() => { if (confirm('Excluir este contrato?')) onDelete(c.id); }}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7"
            onClick={() => onView(c)}>
            <List className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
