import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import DataTable from '@/components/shared/DataTable';
import FilterBar from '@/components/shared/FilterBar';
import BolsistaForm from '@/components/bolsistas/BolsistaForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function Bolsistas() {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [filters, setFilters] = useState({});
  const queryClient = useQueryClient();

  const { data: bolsistas = [], isLoading } = useQuery({
    queryKey: ['bolsistas'],
    queryFn: () => base44.entities.Bolsista.list('-created_date', 200),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Bolsista.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['bolsistas'] }); setShowForm(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Bolsista.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['bolsistas'] }); setEditItem(null); setShowForm(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Bolsista.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bolsistas'] }),
  });

  const filteredData = bolsistas.filter(b => {
    if (filters.search && !JSON.stringify(b).toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.status && b.status !== filters.status) return false;
    return true;
  });

  const columns = [
    { key: 'nome_completo', label: 'Nome', render: (r) => <span className="font-medium">{r.nome_completo}</span> },
    { key: 'cpf', label: 'CPF' },
    { key: 'email', label: 'E-mail' },
    { key: 'telefone', label: 'Telefone' },
    { key: 'formacao_academica', label: 'Formação', render: (r) => <span className="max-w-[150px] truncate block">{r.formacao_academica || '—'}</span> },
    { key: 'numero_edital', label: 'Edital' },
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
      <PageHeader title="Bolsistas" description="Cadastro de bolsistas e candidatos">
        <Button onClick={() => { setEditItem(null); setShowForm(true); }} className="bg-primary">
          <Plus className="w-4 h-4 mr-2" /> Novo Bolsista
        </Button>
      </PageHeader>

      <FilterBar
        filters={[
          { key: 'search', type: 'search', placeholder: 'Buscar bolsistas...' },
          {
            key: 'status', placeholder: 'Status',
            options: [
              { value: 'candidato', label: 'Candidato' },
              { value: 'selecionado', label: 'Selecionado' },
              { value: 'contratado', label: 'Contratado' },
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Editar Bolsista' : 'Novo Bolsista'}</DialogTitle>
          </DialogHeader>
          <BolsistaForm
            initialData={editItem}
            onSubmit={(data) => editItem ? updateMutation.mutate({ id: editItem.id, data }) : createMutation.mutate(data)}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
