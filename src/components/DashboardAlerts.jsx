import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Clock, Cake, FileText } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';

export default function DashboardAlerts({ proximosVencimento, aniversariantes, solicitacoesPendentes }) {
  const today = new Date();
  const hasAlerts = proximosVencimento.length > 0 || aniversariantes.length > 0 || solicitacoesPendentes.length > 0;

  if (!hasAlerts) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {proximosVencimento.length > 0 && (
        <Card className="border-l-4 border-l-warning">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-warning" />
              Contratos Próximos do Vencimento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {proximosVencimento.slice(0, 5).map(c => {
              const dias = differenceInDays(parseISO(c.data_fim), today);
              return (
                <div key={c.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium truncate max-w-[60%]">{c.nome_bolsista}</span>
                  <span className={`text-xs font-semibold ${dias <= 15 ? 'text-destructive' : 'text-warning'}`}>
                    {dias} dias
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {aniversariantes.length > 0 && (
        <Card className="border-l-4 border-l-info">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Cake className="w-4 h-4 text-info" />
              Aniversariantes do Dia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {aniversariantes.map(c => (
              <div key={c.id} className="text-sm font-medium">{c.nome_bolsista}</div>
            ))}
          </CardContent>
        </Card>
      )}

      {solicitacoesPendentes.length > 0 && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Solicitações Pendentes ({solicitacoesPendentes.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {solicitacoesPendentes.slice(0, 5).map(s => (
              <div key={s.id} className="flex items-center justify-between text-sm">
                <span className="truncate max-w-[70%]">{s.nome_projeto || s.nome_solicitante}</span>
                <span className="text-xs text-muted-foreground capitalize">{s.status?.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
