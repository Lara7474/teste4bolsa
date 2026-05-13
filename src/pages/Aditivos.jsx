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
import AditivoForm from '@/components/aditivos/AditivoForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function Aditivos() {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [filters, setFilters] = useState({});
  const queryClient = useQueryClient();

  const { data: aditivos = [], isLoading } = useQuery({
    queryKey: ['aditivos'],
    queryFn: () => base44.entities.Aditivo.list('-created_date', 100),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Aditivo.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['aditivos'] }); setShowForm(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Aditivo.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['aditivos'] }); setEditItem(null); setShowForm(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Aditivo.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['aditivos'] }),
  });

  const tipoLabels = { valor: 'Valor', modalidade: 'Modalidade', periodo: 'Período' };

  const filteredData = aditivos.filter(a => {
    if (filters.search && !JSON.stringify(a).toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.tipo && a.tipo_aditivo !== filters.tipo) return false;
    if (filters.status && a.status !== filters.status) return false;
    return true;
  });

  const columns = [
    { key: 'created_date', label: 'Data', render: (r) => r.created_date ? format(parseISO(r.created_date), 'dd/MM/yyyy') : '—' },
    { key: 'nome_bolsista', label: 'Bolsista', render: (r) => <span className="font-medium">{r.nome_bolsista}</span> },
    { key: 'numero_contrato', label: 'Nº Contrato' },
    { key: 'tipo_aditivo', label: 'Tipo', render: (r) => tipoLabels[r.tipo_aditivo] || r.tipo_aditivo },
    { key: 'justificativa', label: 'Justificativa', render: (r) => <span className="max-w-[200px] truncate block">{r.justificativa || '—'}</span> },
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
      <PageHeader title="Aditivos" description="Controle de aditivos contratuais">
        <Button onClick={() => { setEditItem(null); setShowForm(true); }} className="bg-primary">
          <Plus className="w-4 h-4 mr-2" /> Novo Aditivo
        </Button>
      </PageHeader>

      <FilterBar
        filters={[
          { key: 'search', type: 'search', placeholder: 'Buscar aditivos...' },
          { key: 'tipo', placeholder: 'Tipo', options: [{ value: 'valor', label: 'Valor' }, { value: 'modalidade', label: 'Modalidade' }, { value: 'periodo', label: 'Período' }] },
          { key: 'status', placeholder: 'Status', options: [{ value: 'rascunho', label: 'Rascunho' }, { value: 'pendente', label: 'Pendente' }, { value: 'aprovado', label: 'Aprovado' }, { value: 'assinado', label: 'Assinado' }] },
        ]}
        values={filters}
        onChange={(k, v) => setFilters(prev => ({ ...prev, [k]: v }))}
        onClear={() => setFilters({})}
      />

      <DataTable columns={columns} data={filteredData} isLoading={isLoading} />

      <Dialog open={showForm} onOpenChange={(open) => { if (!open) { setShowForm(false); setEditItem(null); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editItem ? 'Editar Aditivo' : 'Novo Aditivo'}</DialogTitle></DialogHeader>
          <AditivoForm
            initialData={editItem}
            onSubmit={(data) => editItem ? updateMutation.mutate({ id: editItem.id, data }) : createMutation.mutate(data)}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
