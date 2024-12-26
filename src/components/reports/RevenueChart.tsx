import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { supabase } from '../../lib/supabase';

const RevenueChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      const { data: opportunities, error } = await supabase
        .from('opportunities')
        .select('expected_closing_date, potential_value, status')
        .eq('status', 'ganha');

      if (error) throw error;

      const revenueByMonth = opportunities.reduce((acc: any, curr) => {
        const date = new Date(curr.expected_closing_date);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        
        acc[monthYear] = (acc[monthYear] || 0) + curr.potential_value;
        return acc;
      }, {});

      const chartData = Object.entries(revenueByMonth)
        .map(([date, value]) => ({
          date,
          value
        }))
        .sort((a: any, b: any) => {
          const [aMonth, aYear] = a.date.split('/');
          const [bMonth, bYear] = b.date.split('/');
          return new Date(aYear, aMonth - 1).getTime() - new Date(bYear, bMonth - 1).getTime();
        });

      setData(chartData);
    } catch (error) {
      console.error('Erro ao buscar dados de receita:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Carregando gráfico...</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip
          formatter={(value: number) =>
            new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(value)
          }
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#3B82F6"
          name="Receita"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;