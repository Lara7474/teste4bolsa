import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Edit, FileText, Eye } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import SolicitacaoForm from '@/components/solicitacoes/SolicitacaoForm';
import SolicitacaoDetail from '@/components/solicitacoes/SolicitacaoDetail';

function CardSolicitacao({ item, onEdit, onView }) {
  const periodo = [item.DataInicioVigencia, item.DataFimVigencia].filter(Boolean).join(' a ');
  return (
    <div className="space-y-2">
      <div className="text-xl font-medium text-slate-700">{item.CodigoProjeto || item.ID || 'Sem código'}</div>
      <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="text-sm font-bold text-slate-900">{item.Coordenador || item.NomeSolicitante || 'Responsável não informado'}</div>
            <Badge variant="outline">{item.Status || 'Recebido'}</Badge>
          </div>
          <div className="mt-8 text-2xl leading-tight text-slate-800">{item.NomeBolsista || item.Projeto || 'Bolsista/candidato não informado'}</div>
          <div className="mt-1 text-sm text-slate-500">{periodo || 'Período não informado'}</div>
          <div className="mt-7 text-base text-slate-700">{item.Modalidade || item.DescricaoModalidade || item.TipoSolicitacao || 'Modalidade não informada'}</div>
          <div className="mt-6 flex items-center justify-between">
            <Button variant="link" className="px-0 text-blue-900" onClick={onEdit}><Edit className="w-4 h-4 mr-1" />EDITAR</Button>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={onView} title="Visualizar"><Eye className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" title="Documentos"><FileText className="w-4 h-4" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Solicitacoes() {
  const [view, setView] = useState('list');
  const [selectedItem, setSelectedItem] = useState(null);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: solicitacoes = [], isLoading } = useQuery({
    queryKey: ['solicitacoes'],
    queryFn: () => base44.entities.Solicitacao.list('-created_date', 300),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Solicitacao.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['solicitacoes'] }); setView('list'); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Solicitacao.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['solicitacoes'] }); setView('list'); setSelectedItem(null); },
  });

  const filteredData = solicitacoes.filter((item) => JSON.stringify(item).toLowerCase().includes(search.toLowerCase()));

  if (view === 'create') return <SolicitacaoForm onSubmit={(data) => createMutation.mutate(data)} onCancel={() => setView('list')} isLoading={createMutation.isPending} />;
  if (view === 'edit' && selectedItem) return <SolicitacaoForm item={selectedItem} onSubmit={(data) => updateMutation.mutate({ id: selectedItem.id, data })} onCancel={() => { setView('list'); setSelectedItem(null); }} isLoading={updateMutation.isPending} />;
  if (view === 'detail' && selectedItem) return <SolicitacaoDetail item={selectedItem} onBack={() => { setView('list'); setSelectedItem(null); }} onUpdate={(id, data) => updateMutation.mutate({ id, data })} isUpdating={updateMutation.isPending} />;

  return (
    <div className="space-y-5">
      <PageHeader title="Solicitações" description="Cards e campos alinhados à planilha mãe de bolsistas.">
        <Button onClick={() => setView('create')}><Plus className="w-4 h-4 mr-2" />Nova Solicitação</Button>
      </PageHeader>
      <Input placeholder="Buscar por projeto, bolsista, CPF, coordenador ou status..." value={search} onChange={(e) => setSearch(e.target.value)} />
      {isLoading ? <div className="text-slate-500">Carregando...</div> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredData.map((item) => (
            <CardSolicitacao key={item.id || item.ID} item={item} onEdit={() => { setSelectedItem(item); setView('edit'); }} onView={() => { setSelectedItem(item); setView('detail'); }} />
          ))}
          {filteredData.length === 0 && <div className="text-slate-500">Nenhuma solicitação encontrada.</div>}
        </div>
      )}
    </div>
  );
}
