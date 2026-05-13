import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import DataTable from '@/components/shared/DataTable';
import FilterBar from '@/components/shared/FilterBar';
import EditalForm from '@/components/editais/EditalForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function Editais() {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [filters, setFilters] = useState({});
  const queryClient = useQueryClient();

  const { data: editais = [], isLoading } = useQuery({
    queryKey: ['editais'],
    queryFn: () => base44.entities.Edital.list('-created_date', 100),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Edital.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['editais'] }); setShowForm(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Edital.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['editais'] }); setEditItem(null); setShowForm(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Edital.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['editais'] }),
  });

  const filteredData = editais.filter(e => {
    if (filters.search && !JSON.stringify(e).toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.status && e.status !== filters.status) return false;
    return true;
  });

  const columns = [
    { key: 'numero_edital', label: 'Nº Edital' },
    { key: 'titulo', label: 'Título', render: (r) => <span className="max-w-[200px] truncate block">{r.titulo}</span> },
    { key: 'modalidade_bolsa', label: 'Modalidade', render: (r) => r.modalidade_bolsa || '—' },
    { key: 'quantidade_vagas', label: 'Vagas' },
    { key: 'data_publicacao', label: 'Publicação', render: (r) => r.data_publicacao ? format(parseISO(r.data_publicacao), 'dd/MM/yyyy') : '—' },
    { key: 'data_limite_inscricao', label: 'Limite Inscrição', render: (r) => r.data_limite_inscricao ? format(parseISO(r.data_limite_inscricao), 'dd/MM/yyyy') : '—' },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    {
      key: 'acoes', label: '', render: (r) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); setEditItem(r); setShowForm(true); }}>
            <Pencil className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(r.id); }}>
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader title="Editais" description="Controle de editais de seleção">
        <Button onClick={() => { setEditItem(null); setShowForm(true); }} className="bg-primary">
          <Plus className="w-4 h-4 mr-2" /> Novo Edital
        </Button>
      </PageHeader>

      <FilterBar
        filters={[
          { key: 'search', type: 'search', placeholder: 'Buscar editais...' },
          {
            key: 'status', placeholder: 'Status',
            options: [
              { value: 'rascunho', label: 'Rascunho' },
              { value: 'publicado', label: 'Publicado' },
              { value: 'inscricoes_abertas', label: 'Inscrições Abertas' },
              { value: 'selecao', label: 'Em Seleção' },
              { value: 'resultado', label: 'Resultado' },
              { value: 'encerrado', label: 'Encerrado' },
            ]
          }
        ]}
        values={filters}
        onChange={(k, v) => setFilters(prev => ({ ...prev, [k]: v }))}
        onClear={() => setFilters({})}
      />

      <DataTable columns={columns} data={filteredData} isLoading={isLoading} />

      <Dialog open={showForm} onOpenChange={(open) => { if (!open) { setShowForm(false); setEditItem(null); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Editar Edital' : 'Novo Edital'}</DialogTitle>
          </DialogHeader>
          <EditalForm
            initialData={editItem}
            onSubmit={(data) => editItem ? updateMutation.mutate({ id: editItem.id, data }) : createMutation.mutate(data)}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
