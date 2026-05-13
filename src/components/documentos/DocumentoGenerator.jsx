import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { getAllowedDocumentButtons, downloadGeneratedDocument, markDocumentUpdated, DOCUMENT_BUTTONS } from '@/lib/processoBolsasRules';
import { toast } from 'sonner';

export default function DocumentoGenerator({ item = {}, onUpdate }) {
  const [generating, setGenerating] = useState('');
  const allowed = getAllowedDocumentButtons(item);
  const history = item.__documentHistory || [];

  const gerar = async (doc) => {
    setGenerating(doc.tipo);
    try {
      if ((doc.tipo.includes('Aditivo') || doc.tipo === 'Distrato') && !item.IDContratoOrigem && !item.IDContrato) {
        toast.error('Informe o ID do contrato de origem antes de gerar aditivo ou distrato.');
        return;
      }
      const payload = downloadGeneratedDocument(item, doc);
      const updated = markDocumentUpdated(item, doc, payload);
      await onUpdate?.(item.id, updated);
      toast.success(`${doc.tipo} gerado e registrado no controle de documentos.`);
    } finally {
      setGenerating('');
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2"><FileText className="w-4 h-4" />Geração documental</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {item.__documentNeedsRefresh && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-700" />
            <AlertDescription className="text-amber-800">Há dados alterados depois da última geração. Regere o documento para atualizar a versão.</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DOCUMENT_BUTTONS.map((doc) => {
            const can = allowed.some((a) => a.tipo === doc.tipo);
            const generated = item[doc.linkField];
            return (
              <div key={doc.tipo} className="rounded-xl border border-slate-200 p-3 flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-sm text-slate-800">{doc.button}</div>
                  <div className="text-xs text-slate-500">Status exigido: {doc.status}</div>
                  {generated && <Badge variant="outline" className="mt-2 gap-1"><CheckCircle2 className="w-3 h-3" />{item.__documentNeedsRefresh ? 'Desatualizado' : 'Gerado'}</Badge>}
                </div>
                <Button type="button" size="sm" disabled={!can || generating === doc.tipo} onClick={() => gerar(doc)} variant={can ? 'default' : 'outline'}>
                  {generating === doc.tipo ? <RefreshCw className="w-4 h-4 mr-1 animate-spin" /> : <FileText className="w-4 h-4 mr-1" />}
                  {generated ? 'Regenerar' : 'Gerar'}
                </Button>
              </div>
            );
          })}
        </div>

        {allowed.length === 0 && (
          <p className="text-sm text-slate-500">Nenhum documento está liberado para o status atual: <strong>{item.Status || 'não informado'}</strong>.</p>
        )}

        {history.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-700">Histórico de documentos</h3>
            <div className="rounded-lg border divide-y">
              {history.map((h, index) => (
                <div key={`${h.tipo}-${index}`} className="p-2 text-xs flex justify-between gap-2">
                  <span className="font-medium">{h.tipo}</span>
                  <span className="text-slate-500 truncate">{h.arquivo}</span>
                  <span>{new Date(h.data).toLocaleString('pt-BR')}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
