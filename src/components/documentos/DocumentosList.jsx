import React from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { tipoLabels } from '@/pages/Documentos';

export default function DocumentosList({ documentos, isLoading, onDelete }) {
  const columns = [
    { key: 'created_date', label: 'Data', render: (r) => r.created_date ? format(parseISO(r.created_date), 'dd/MM/yyyy') : '—' },
    { key: 'titulo', label: 'Título', render: (r) => <span className="font-medium">{r.NomeDocumento || r.titulo}</span> },
    { key: 'tipo', label: 'Tipo', render: (r) => tipoLabels[r.TipoDocumento || r.tipo] || r.TipoDocumento || r.tipo },
    { key: 'modelo_utilizado', label: 'Modelo', render: (r) => r.modelo_utilizado || r.LinkArquivo || '—' },
    { key: 'gerado_por', label: 'Gerado por', render: (r) => r.GeradoPor || r.gerado_por || '—' },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.StatusDocumento || r.status} /> },
    {
      key: 'acoes', label: '', render: (r) => (
        <div className="flex gap-1">
          {(r.LinkArquivo || r.arquivo_url) && (
            <a href={r.LinkArquivo || r.arquivo_url} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="h-7 w-7"><Download className="w-3 h-3" /></Button>
            </a>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10"
            onClick={(e) => { e.stopPropagation(); if (confirm('Remover documento?')) onDelete(r.id); }}>
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      )
    },
  ];

  return <DataTable columns={columns} data={documentos} isLoading={isLoading} emptyMessage="Nenhum documento gerado ainda." />;
}
