import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, List, LayoutGrid } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import DataTable from '@/components/shared/DataTable';
import FilterBar from '@/components/shared/FilterBar';
import ContratoForm from '@/components/contratos/ContratoForm';
import ContratoDetail from '@/components/contratos/ContratoDetail';
import ContratosByProject from '@/components/contratos/ContratosByProject';

export default function Contratos() {
  const [view, setView] = useState('list');
  const [selectedItem, setSelectedItem] = useState(null);
  const [filters, setFilters] = useState({});
  const [displayMode, setDisplayMode] = useState('grouped'); // 'grouped' | 'table'
  const queryClient = useQueryClient();

  const { data: contratos = [], isLoading } = useQuery({
    queryKey: ['contratos'],
    queryFn: () => base44.entities.Contrato.list('-created_date', 500),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Contrato.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['contratos'] }); setView('list'); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Contrato.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] });
      setView('list'); setSelectedItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Contrato.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['contratos'] }); setView('list'); setSelectedItem(null); },
  });

  const today = new Date();

  const filteredData = useMemo(() => contratos.filter(c => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const s = `${c.nome_bolsista} ${c.numero_projeto} ${c.nome_coordenador} ${c.tipo_bolsa} ${c.numero_contrato}`.toLowerCase();
      if (!s.includes(q)) return false;
    }
    if (filters.status && c.status !== filters.status) return false;
    if (filters.gestora && c.gestora !== filters.gestora) return false;
    if (filters.status_esocial && c.status_esocial !== filters.status_esocial) return false;
    return true;
  }), [contratos, filters]);

  const columns = [
    { key: 'numero_contrato', label: 'ID', render: (r) => <span className="font-mono text-xs font-bold text-primary">{r.numero_contrato || '—'}</span> },
    { key: 'numero_projeto', label: 'Projeto', render: (r) => <span className="font-semibold">{r.numero_projeto || '—'}</span> },
    { key: 'nome_bolsista', label: 'Bolsista', render: (r) => <span className="font-medium">{r.nome_bolsista}</span> },
    { key: 'nome_coordenador', label: 'Coordenador', render: (r) => <span className="max-w-[160px] truncate block text-xs">{r.nome_coordenador || '—'}</span> },
    { key: 'tipo_bolsa', label: 'Tipo de Bolsa', render: (r) => <span className="max-w-[200px] truncate block text-xs">{r.tipo_bolsa || '—'}</span> },
    {
      key: 'vigencia', label: 'Período', render: (r) => {
        if (r.periodo) return <span className="text-xs">{r.periodo.split('\n')[0]}</span>;
        if (!r.data_inicio || !r.data_fim) return '—';
        return <span className="text-xs">{format(parseISO(r.data_inicio), 'dd/MM/yy')} a {format(parseISO(r.data_fim), 'dd/MM/yy')}</span>;
      }
    },
    {
      key: 'dias_restantes', label: 'Venc.', render: (r) => {
        if (!r.data_fim) return '—';
        const dias = differenceInDays(parseISO(r.data_fim), today);
        const color = dias < 0 ? 'text-destructive' : dias <= 30 ? 'text-warning' : 'text-success';
        return <span className={`font-semibold text-xs ${color}`}>{dias}d</span>;
      }
    },
    {
      key: 'valor_mensal', label: 'R$/mês', render: (r) => r.valor_mensal
        ? <span className="font-semibold text-xs">R$ {Number(r.valor_mensal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        : '—'
    },
    { key: 'gestora', label: 'Gestora', render: (r) => r.gestora ? <span className="text-xs bg-muted px-2 py-0.5 rounded">{r.gestora}</span> : '—' },
    {
      key: 'status_esocial', label: 'E-Social', render: (r) => {
        const s = r.status_esocial;
        if (s === 'ok') return <span className="text-success text-xs font-bold">✓ ok</span>;
        if (s === 'termo_assinatura') return <span className="text-warning text-xs">Termo</span>;
        return <span className="text-muted-foreground text-xs">—</span>;
      }
    },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  const filterConfig = [
    { key: 'search', type: 'search', placeholder: 'Buscar por nome, projeto, coordenador...' },
    { key: 'status', placeholder: 'Status', options: [{ value: 'ativo', label: 'Ativo' }, { value: 'encerrado', label: 'Encerrado' }, { value: 'vencido', label: 'Vencido' }, { value: 'suspenso', label: 'Suspenso' }] },
    { key: 'gestora', placeholder: 'Gestora', options: ['Marcella','Michelle','Flávia','Letícia','Fernanda','Lauriana','Jéssica'].map(v => ({ value: v, label: v })) },
    { key: 'status_esocial', placeholder: 'E-Social', options: [{ value: 'ok', label: 'OK' }, { value: 'termo_assinatura', label: 'Termo p/ assinatura' }, { value: 'pendente', label: 'Pendente' }] },
  ];

  if (view === 'create') return <ContratoForm onSubmit={(data) => createMutation.mutate(data)} onCancel={() => setView('list')} isLoading={createMutation.isPending} />;
  if (view === 'edit' && selectedItem) return <ContratoForm initialData={selectedItem} onSubmit={(data) => updateMutation.mutate({ id: selectedItem.id, data })} onCancel={() => { setView('list'); setSelectedItem(null); }} isLoading={updateMutation.isPending} />;
  if (view === 'detail' && selectedItem) return <ContratoDetail item={selectedItem} onBack={() => { setView('list'); setSelectedItem(null); }} onEdit={() => setView('edit')} onDelete={() => deleteMutation.mutate(selectedItem.id)} />;

  return (
    <div className="space-y-4">
      <PageHeader title="Contratos" description="Gestão de contratos de bolsas e estágios">
        <div className="flex items-center gap-2">
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setDisplayMode('grouped')}
              className={`px-3 py-1.5 text-xs flex items-center gap-1.5 transition-colors ${displayMode === 'grouped' ? 'bg-primary text-white' : 'bg-background text-muted-foreground hover:bg-muted'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Por Projeto
            </button>
            <button
              onClick={() => setDisplayMode('table')}
              className={`px-3 py-1.5 text-xs flex items-center gap-1.5 transition-colors ${displayMode === 'table' ? 'bg-primary text-white' : 'bg-background text-muted-foreground hover:bg-muted'}`}
            >
              <List className="w-3.5 h-3.5" /> Tabela
            </button>
          </div>
          <Button onClick={() => setView('create')} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" /> Novo Contrato
          </Button>
        </div>
      </PageHeader>

      <FilterBar filters={filterConfig} values={filters} onChange={(k, v) => setFilters(prev => ({ ...prev, [k]: v }))} onClear={() => setFilters({})} />

      {displayMode === 'grouped' ? (
        <ContratosByProject
          contratos={filteredData}
          isLoading={isLoading}
          onEdit={(item) => { setSelectedItem(item); setView('edit'); }}
          onDelete={(id) => deleteMutation.mutate(id)}
          onView={(item) => { setSelectedItem(item); setView('detail'); }}
        />
      ) : (
        <DataTable columns={columns} data={filteredData} isLoading={isLoading} onRowClick={(row) => { setSelectedItem(row); setView('detail'); }} />
      )}
    </div>
  );
}
