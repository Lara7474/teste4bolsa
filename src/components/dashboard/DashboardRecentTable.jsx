import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import StatusBadge from '@/components/shared/StatusBadge';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardRecentTable({ contratos, solicitacoes }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold">Contratos Ativos Recentes</CardTitle>
          <Link to="/contratos">
            <Button variant="ghost" size="sm" className="text-xs h-7">
              Ver todos <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {contratos.slice(0, 6).map(c => (
              <div key={c.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{c.nome_bolsista}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {c.nome_projeto} {c.unidade_executora ? `— ${c.unidade_executora}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                  <StatusBadge status={c.tipo_contrato} />
                  {c.data_fim && (
                    <span className="text-xs text-muted-foreground">
                      até {format(parseISO(c.data_fim), 'dd/MM/yyyy')}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {contratos.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhum contrato ativo</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold">Últimas Solicitações</CardTitle>
          <Link to="/solicitacoes">
            <Button variant="ghost" size="sm" className="text-xs h-7">
              Ver todas <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {solicitacoes.slice(0, 6).map(s => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{s.nome_projeto || 'Sem projeto'}</p>
                  <p className="text-xs text-muted-foreground truncate">{s.nome_solicitante}</p>
                </div>
                <StatusBadge status={s.status} />
              </div>
            ))}
            {solicitacoes.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhuma solicitação</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
