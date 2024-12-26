import React, { useEffect, useState } from 'react';
import { analytics } from '../../lib/analytics';
import MetricCard from '../reports/MetricCard';

const AdvancedMetrics = () => {
  const [metrics, setMetrics] = useState({
    conversionRate: 0,
    averageValue: 0,
    salesCycle: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const [conversionRate, averageValue, salesCycle] = await Promise.all([
          analytics.getLeadConversionRate('month'),
          analytics.getAverageOpportunityValue(),
          analytics.getSalesCycle()
        ]);

        setMetrics({ conversionRate, averageValue, salesCycle });
      } catch (error) {
        console.error('Error loading metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  if (loading) {
    return <div className="grid grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-gray-100 dark:bg-gray-800 animate-pulse h-32 rounded-lg"></div>
      ))}
    </div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard
        title="Taxa de Conversão"
        value={metrics.conversionRate}
        type="percentage"
      />
      <MetricCard
        title="Valor Médio"
        value={metrics.averageValue}
        type="currency"
      />
      <MetricCard
        title="Ciclo de Vendas (dias)"
        value={metrics.salesCycle}
        type="number"
      />
    </div>
  );
};

export default AdvancedMetrics;