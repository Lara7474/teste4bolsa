import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, FileText, GraduationCap, BookOpen, FilePlus, FileX, AlertTriangle, Clock, Users, Calendar } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { format, differenceInDays, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import PageHeader from '@/components/shared/PageHeader';
import FilterBar from '@/components/shared/FilterBar';
import DashboardAlerts from '@/components/dashboard/DashboardAlerts';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import DashboardRecentTable from '@/components/dashboard/DashboardRecentTable';

export default function Dashboard() {
  const [filters, setFilters] = useState({});

  const { data: contratos = [], isLoading: loadingContratos } = useQuery({
    queryKey: ['contratos'],
    queryFn: () => base44.entities.Contrato.list('-created_date', 200),
  });

  const { data: solicitacoes = [], isLoading: loadingSolicitacoes } = useQuery({
    queryKey: ['solicitacoes'],
    queryFn: () => base44.entities.Solicitacao.list('-created_date', 100),
  });

  const { data: editais = [] } = useQuery({
    queryKey: ['editais'],
    queryFn: () => base44.entities.Edital.list('-created_date', 50),
  });

  const { data: aditivos = [] } = useQuery({
    queryKey: ['aditivos'],
    queryFn: () => base44.entities.Aditivo.list('-created_date', 50),
  });

  const { data: distratos = [] } = useQuery({
    queryKey: ['distratos'],
    queryFn: () => base44.entities.Distrato.list('-created_date', 50),
  });

  const today = new Date();
  const ativos = contratos.filter(c => c.status === 'ativo');
  const bolsasAtivas = ativos.filter(c => c.tipo_contrato === 'bolsa');
  const estagiosAtivos = ativos.filter(c => c.tipo_contrato === 'estagio');
  const vencidos = contratos.filter(c => c.status === 'vencido');

  const proximosVencimento = ativos.filter(c => {
    if (!c.data_fim) return false;
    const dias = differenceInDays(parseISO(c.data_fim), today);
    return dias >= 0 && dias <= 60;
  });

  const aniversariantes = ativos.filter(c => {
    if (!c.data_nascimento_bolsista) return false;
    const nasc = parseISO(c.data_nascimento_bolsista);
    return nasc.getDate() === today.getDate() && nasc.getMonth() === today.getMonth();
  });

  const solicitacoesPendentes = solicitacoes.filter(s =>
    ['enviada', 'em_analise_projetos', 'em_analise_bolsas'].includes(s.status)
  );

  const filterOptions = [
    {
      key: 'search',
      type: 'search',
      placeholder: 'Buscar contratos, bolsistas...',
    },
    {
      key: 'status',
      placeholder: 'Status',
      options: [
        { value: 'ativo', label: 'Ativo' },
        { value: 'encerrado', label: 'Encerrado' },
        { value: 'vencido', label: 'Vencido' },
      ],
    },
    {
      key: 'tipo',
      placeholder: 'Tipo',
      options: [
        { value: 'bolsa', label: 'Bolsa' },
        { value: 'estagio', label: 'Estágio' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Executivo"
        description={`Visão geral do sistema — ${format(today, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`}
      />

      <FilterBar
        filters={filterOptions}
        values={filters}
        onChange={(k, v) => setFilters(prev => ({ ...prev, [k]: v }))}
        onClear={() => setFilters({})}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatsCard title="Contratos Ativos" value={ativos.length} icon={Briefcase} variant="default" />
        <StatsCard title="Bolsas Ativas" value={bolsasAtivas.length} icon={GraduationCap} variant="info" />
        <StatsCard title="Estágios Ativos" value={estagiosAtivos.length} icon={Users} variant="success" />
        <StatsCard title="Próx. Vencimento" value={proximosVencimento.length} icon={Clock} variant="warning" />
        <StatsCard title="Vencidos" value={vencidos.length} icon={AlertTriangle} variant="danger" />
        <StatsCard title="Solicitações" value={solicitacoesPendentes.length} icon={FileText} variant="info" />
      </div>

      {/* Alerts */}
      <DashboardAlerts
        proximosVencimento={proximosVencimento}
        aniversariantes={aniversariantes}
        solicitacoesPendentes={solicitacoesPendentes}
      />

      {/* Charts */}
      <DashboardCharts
        contratos={contratos}
        solicitacoes={solicitacoes}
        editais={editais}
        aditivos={aditivos}
        distratos={distratos}
      />

      {/* Recent Tables */}
      <DashboardRecentTable contratos={ativos} solicitacoes={solicitacoes} />
    </div>
  );
}
