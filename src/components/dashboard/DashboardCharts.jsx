import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const COLORS = ['#184680', '#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function DashboardCharts({ contratos, solicitacoes, editais, aditivos, distratos }) {
  // Status distribution
  const statusCounts = contratos.reduce((acc, c) => {
    const s = c.status || 'sem_status';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const statusLabels = {
    ativo: 'Ativos', encerrado: 'Encerrados', suspenso: 'Suspensos',
    cancelado: 'Cancelados', vencido: 'Vencidos', proximo_vencimento: 'Próx. Vencimento',
  };

  const statusData = Object.entries(statusCounts).map(([key, value]) => ({
    name: statusLabels[key] || key,
    value,
  }));

  // By type
  const tipoData = [
    { name: 'Bolsas', value: contratos.filter(c => c.tipo_contrato === 'bolsa').length },
    { name: 'Estágios', value: contratos.filter(c => c.tipo_contrato === 'estagio').length },
  ];

  // By institution
  const instCounts = contratos.reduce((acc, c) => {
    const inst = c.instituicao || 'Não informado';
    acc[inst] = (acc[inst] || 0) + 1;
    return acc;
  }, {});
  const instData = Object.entries(instCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 7);

  // Summary bar
  const summaryData = [
    { name: 'Contratos', value: contratos.length },
    { name: 'Solicitações', value: solicitacoes.length },
    { name: 'Editais', value: editais.length },
    { name: 'Aditivos', value: aditivos.length },
    { name: 'Distratos', value: distratos.length },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Contratos por Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                {statusData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {statusData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-1 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-muted-foreground">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Por Instituição</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={instData} layout="vertical" margin={{ left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" fontSize={11} />
              <YAxis type="category" dataKey="name" fontSize={11} width={100} />
              <Tooltip />
              <Bar dataKey="value" fill="#184680" radius={[0, 4, 4, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Resumo Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={summaryData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={32}>
                {summaryData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
