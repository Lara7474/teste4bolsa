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
import DistratoForm from '@/components/distratos/DistratoForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function Distratos() {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [filters, setFilters] = useState({});
  const queryClient = useQueryClient();

  const { data: distratos = [], isLoading } = useQuery({
    queryKey: ['distratos'],
    queryFn: () => base44.entities.Distrato.list('-created_date', 100),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Distrato.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['distratos'] }); setShowForm(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Distrato.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['distratos'] }); setEditItem(null); setShowForm(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Distrato.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['distratos'] }),
  });

  const filteredData = distratos.filter(d => {
    if (filters.search && !JSON.stringify(d).toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.status && d.status !== filters.status) return false;
    return true;
  });

  const columns = [
    { key: 'created_date', label: 'Data', render: (r) => r.created_date ? format(parseISO(r.created_date), 'dd/MM/yyyy') : '—' },
    { key: 'nome_bolsista', label: 'Bolsista', render: (r) => <span className="font-medium">{r.nome_bolsista}</span> },
    { key: 'numero_contrato', label: 'Nº Contrato' },
    { key: 'motivo', label: 'Motivo', render: (r) => <span className="max-w-[250px] truncate block">{r.motivo}</span> },
    { key: 'data_encerramento', label: 'Encerramento', render: (r) => r.data_encerramento ? format(parseISO(r.data_encerramento), 'dd/MM/yyyy') : '—' },
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
      <PageHeader title="Distratos" description="Controle de rescisões contratuais">
        <Button onClick={() => { setEditItem(null); setShowForm(true); }} className="bg-primary">
          <Plus className="w-4 h-4 mr-2" /> Novo Distrato
        </Button>
      </PageHeader>

      <FilterBar
        filters={[
          { key: 'search', type: 'search', placeholder: 'Buscar distratos...' },
          { key: 'status', placeholder: 'Status', options: [{ value: 'rascunho', label: 'Rascunho' }, { value: 'pendente', label: 'Pendente' }, { value: 'aprovado', label: 'Aprovado' }, { value: 'assinado', label: 'Assinado' }] },
        ]}
        values={filters}
        onChange={(k, v) => setFilters(prev => ({ ...prev, [k]: v }))}
        onClear={() => setFilters({})}
      />

      <DataTable columns={columns} data={filteredData} isLoading={isLoading} />

      <Dialog open={showForm} onOpenChange={(open) => { if (!open) { setShowForm(false); setEditItem(null); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editItem ? 'Editar Distrato' : 'Novo Distrato'}</DialogTitle></DialogHeader>
          <DistratoForm
            initialData={editItem}
            onSubmit={(data) => editItem ? updateMutation.mutate({ id: editItem.id, data }) : createMutation.mutate(data)}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
