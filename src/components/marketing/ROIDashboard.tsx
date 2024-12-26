import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Users, Target } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ROIDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({
    totalInvestment: 0,
    totalRevenue: 0,
    roi: 0,
    conversionRate: 0,
    historicalData: [],
    campaignROI: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadROIMetrics();
  }, []);

  const loadROIMetrics = async () => {
    try {
      const { data: campaigns } = await supabase
        .from('campaigns')
        .select(`
          id,
          name,
          budget,
          revenue,
          roi,
          start_date,
          campaign_metrics (
            impressions,
            clicks,
            conversions
          )
        `)
        .order('start_date', { ascending: true });

      if (!campaigns) return;

      const totalInvestment = campaigns.reduce((sum, camp) => sum + (camp.budget || 0), 0);
      const totalRevenue = campaigns.reduce((sum, camp) => sum + (camp.revenue || 0), 0);
      const roi = totalInvestment > 0 ? ((totalRevenue - totalInvestment) / totalInvestment) * 100 : 0;

      // Calculate average conversion rate
      const conversionRate = campaigns.reduce((sum, camp) => {
        const metrics = camp.campaign_metrics || [];
        const conversions = metrics.reduce((total, m) => total + (m.conversions || 0), 0);
        const impressions = metrics.reduce((total, m) => total + (m.impressions || 0), 0);
        return sum + (impressions > 0 ? (conversions / impressions) * 100 : 0);
      }, 0) / (campaigns.length || 1);

      // Historical data for chart
      const historicalData = campaigns.map(camp => ({
        date: new Date(camp.start_date).toLocaleDateString(),
        investment: camp.budget || 0,
        revenue: camp.revenue || 0,
        roi: camp.roi || 0
      }));

      // ROI by campaign
      const campaignROI = campaigns.map(camp => ({
        name: camp.name,
        roi: camp.roi || 0,
        revenue: camp.revenue || 0,
        investment: camp.budget || 0
      }));

      setMetrics({
        totalInvestment,
        totalRevenue,
        roi,
        conversionRate,
        historicalData,
        campaignROI
      });
    } catch (error) {
      console.error('Error loading ROI metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse">Carregando métricas...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Investimento Total</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(metrics.totalInvestment)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receita Total</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(metrics.totalRevenue)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">ROI Médio</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {metrics.roi.toFixed(2)}%
              </p>
            </div>
            <Target className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Taxa de Conversão</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {metrics.conversionRate.toFixed(2)}%
              </p>
            </div>
            <Users className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* ROI Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Evolução do ROI
        </h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics.historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="roi"
                stroke="#8884d8"
                name="ROI (%)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#82ca9d"
                name="Receita"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Campaign ROI Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          ROI por Campanha
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campanha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Investimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receita
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ROI
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {metrics.campaignROI.map((campaign, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {campaign.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(campaign.investment)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(campaign.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full font-medium ${
                      campaign.roi > 0 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    }`}>
                      {campaign.roi.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ROIDashboard;