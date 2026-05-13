import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, FilePlus, Upload } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import FilterBar from '@/components/shared/FilterBar';
import DocumentosList from '@/components/documentos/DocumentosList';
import DocumentoGenerator from '@/components/documentos/DocumentoGenerator';
import ModelosUpload from '@/components/documentos/ModelosUpload';
import { toast } from 'sonner';

export const tipoLabels = {
  termo_referencia: 'Termo de Referência',
  edital: 'Edital',
  termo_outorga: 'Termo de Outorga',
  aditivo_valor: 'Aditivo de Valor',
  aditivo_modalidade: 'Aditivo de Modalidade',
  aditivo_periodo: 'Aditivo de Período',
  distrato: 'Distrato',
  declaracao: 'Declaração',
  relatorio: 'Relatório',
};

export default function Documentos() {
  const [filters, setFilters] = useState({});
  const queryClient = useQueryClient();

  const { data: documentos = [], isLoading } = useQuery({
    queryKey: ['documentos'],
    queryFn: () => base44.entities.Documento.list('-created_date', 200),
  });

  const { data: contratos = [] } = useQuery({
    queryKey: ['contratos'],
    queryFn: () => base44.entities.Contrato.list('-created_date', 500),
  });

  const { data: modelos = [] } = useQuery({
    queryKey: ['modelos'],
    queryFn: () => base44.entities.ModeloDocumento.list('-created_date', 100),
  });

  const { data: solicitacoes = [] } = useQuery({
    queryKey: ['solicitacoes'],
    queryFn: () => base44.entities.Solicitacao.list('-created_date', 500),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Documento.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['documentos'] }); toast.success('Documento removido.'); },
  });

  const filteredData = documentos.filter(d => {
    if (filters.search && !JSON.stringify(d).toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.tipo && (d.TipoDocumento || d.tipo) !== filters.tipo) return false;
    if (filters.status && (d.StatusDocumento || d.status) !== filters.status) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <PageHeader title="Documentos" description="Geração, controle e modelos de documentos" />

      <Tabs defaultValue="gerador">
        <TabsList>
          <TabsTrigger value="gerador" className="gap-2"><FilePlus className="w-3.5 h-3.5" /> Gerar Documento</TabsTrigger>
          <TabsTrigger value="lista" className="gap-2"><FileText className="w-3.5 h-3.5" /> Documentos Gerados</TabsTrigger>
          <TabsTrigger value="modelos" className="gap-2"><Upload className="w-3.5 h-3.5" /> Modelos</TabsTrigger>
        </TabsList>

        <TabsContent value="gerador" className="mt-4">
          <DocumentoGenerator contratos={contratos} solicitacoes={solicitacoes} modelos={modelos} onCreated={() => queryClient.invalidateQueries({ queryKey: ['documentos'] })} />
        </TabsContent>

        <TabsContent value="lista" className="mt-4 space-y-4">
          <FilterBar
            filters={[
              { key: 'search', type: 'search', placeholder: 'Buscar documentos...' },
              { key: 'tipo', placeholder: 'Tipo', options: Object.entries(tipoLabels).map(([v, l]) => ({ value: v, label: l })) },
              { key: 'status', placeholder: 'Status', options: [{ value: 'gerado', label: 'Gerado' }, { value: 'enviado_assinatura', label: 'Enviado p/ Assinatura' }, { value: 'assinado', label: 'Assinado' }] },
            ]}
            values={filters}
            onChange={(k, v) => setFilters(prev => ({ ...prev, [k]: v }))}
            onClear={() => setFilters({})}
          />
          <DocumentosList documentos={filteredData} isLoading={isLoading} onDelete={(id) => deleteMutation.mutate(id)} />
        </TabsContent>

        <TabsContent value="modelos" className="mt-4">
          <ModelosUpload modelos={modelos} onRefresh={() => queryClient.invalidateQueries({ queryKey: ['modelos'] })} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
