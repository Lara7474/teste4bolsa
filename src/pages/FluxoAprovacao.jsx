import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import FilterBar from '@/components/shared/FilterBar';
import FluxoKanban from '@/components/fluxo/FluxoKanban';
import FluxoForm from '@/components/fluxo/FluxoForm';
import FluxoDetail from '@/components/fluxo/FluxoDetail';
import { toast } from 'sonner';

export default function FluxoAprovacao() {
  const [view, setView] = useState('kanban');
  const [selectedItem, setSelectedItem] = useState(null);
  const [filters, setFilters] = useState({});
  const queryClient = useQueryClient();

  const { data: fluxos = [], isLoading } = useQuery({
    queryKey: ['fluxos'],
    queryFn: () => base44.entities.FluxoAprovacao.list('-created_date', 200),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.FluxoAprovacao.create(data),
    onSuccess: async (created) => {
      queryClient.invalidateQueries({ queryKey: ['fluxos'] });
      setView('kanban');
      // Create alert
      await base44.entities.Alerta.create({
        tipo: 'aprovacao_pendente',
        titulo: `Nova solicitação: ${created.tipo_processo}`,
        mensagem: `Projeto ${created.projeto || '—'} aguarda análise do setor responsável.`,
        prioridade: 'media',
        destinatario_setor: created.responsavel_atual === 'Projetos' ? 'projetos' : 'bolsas',
      });
      toast.success('Solicitação criada e alerta enviado!');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.FluxoAprovacao.update(id, data),
    onSuccess: async (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['fluxos'] });
      if (vars.createAlert) {
        await base44.entities.Alerta.create(vars.createAlert);
      }
      toast.success('Status atualizado!');
      setView('kanban');
      setSelectedItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.FluxoAprovacao.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['fluxos'] }); toast.success('Processo removido.'); },
  });

  const filteredData = fluxos.filter(f => {
    if (filters.search && !JSON.stringify(f).toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.tipo_processo && f.tipo_processo !== filters.tipo_processo) return false;
    if (filters.responsavel && f.responsavel_atual !== filters.responsavel) return false;
    return true;
  });

  if (view === 'create') {
    return <FluxoForm onSubmit={(d) => createMutation.mutate(d)} onCancel={() => setView('kanban')} isLoading={createMutation.isPending} />;
  }

  if (view === 'detail' && selectedItem) {
    return (
      <FluxoDetail
        item={selectedItem}
        onBack={() => { setView('kanban'); setSelectedItem(null); }}
        onAdvance={(id, data, alertData) => updateMutation.mutate({ id, data, createAlert: alertData })}
        onDelete={(id) => { deleteMutation.mutate(id); setView('kanban'); setSelectedItem(null); }}
        isUpdating={updateMutation.isPending}
      />
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Fluxo de Aprovação" description="Acompanhe o fluxo de solicitações entre setores">
        <Button onClick={() => setView('create')} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> Nova Solicitação
        </Button>
      </PageHeader>

      <FilterBar
        filters={[
          { key: 'search', type: 'search', placeholder: 'Buscar por projeto, bolsista...' },
          {
            key: 'tipo_processo', placeholder: 'Tipo de Processo',
            options: [
              { value: 'Termo de Referência - Abertura de Edital', label: 'Termo de Referência' },
              { value: 'Contratação de Bolsista', label: 'Contratação' },
              { value: 'Aditivo de valor', label: 'Aditivo de Valor' },
              { value: 'Aditivo de modalidade', label: 'Aditivo de Modalidade' },
              { value: 'Aditivo de período', label: 'Aditivo de Período' },
              { value: 'Distrato', label: 'Distrato' },
            ],
          },
          {
            key: 'responsavel', placeholder: 'Responsável',
            options: [
              { value: 'Solicitante', label: 'Solicitante' },
              { value: 'Projetos', label: 'Projetos' },
              { value: 'Bolsas', label: 'Bolsas' },
              { value: 'Bolsista', label: 'Bolsista' },
            ],
          },
        ]}
        values={filters}
        onChange={(k, v) => setFilters(prev => ({ ...prev, [k]: v }))}
        onClear={() => setFilters({})}
      />

      <FluxoKanban
        fluxos={filteredData}
        isLoading={isLoading}
        onSelect={(item) => { setSelectedItem(item); setView('detail'); }}
        onAdvance={(id, data) => updateMutation.mutate({ id, data })}
      />
    </div>
  );
}
