import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { supabase } from '../../lib/supabase';

const OpportunitiesChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpportunitiesData();
  }, []);

  const fetchOpportunitiesData = async () => {
    try {
      const { data: opportunities, error } = await supabase
        .from('opportunities')
        .select('status, potential_value');

      if (error) throw error;

      const statusData = opportunities.reduce((acc: any, curr) => {
        acc[curr.status] = {
          count: (acc[curr.status]?.count || 0) + 1,
          value: (acc[curr.status]?.value || 0) + curr.potential_value
        };
        return acc;
      }, {});

      const chartData = Object.entries(statusData).map(([status, data]: [string, any]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        quantidade: data.count,
        valor: data.value
      }));

      setData(chartData);
    } catch (error) {
      console.error('Erro ao buscar dados das oportunidades:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Carregando gráfico...</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="quantidade" fill="#3B82F6" name="Quantidade" />
        <Bar yAxisId="right" dataKey="valor" fill="#10B981" name="Valor Total" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default OpportunitiesChart;