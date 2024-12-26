import React from 'react';
import MetricCard from '../reports/MetricCard';
import { useMetrics } from '../../hooks/useMetrics';

const PerformanceMetrics = () => {
  const { metrics, loading } = useMetrics();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-800 animate-pulse h-32 rounded-lg" />
        ))}
      </div>
    );
  }

  const defaultMetrics = {
    totalLeads: 0,
    totalOpportunities: 0,
    wonOpportunities: 0,
    conversionRate: 0,
    ...metrics
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <MetricCard
        title="Total de Leads"
        value={defaultMetrics.totalLeads}
        type="number"
      />
      <MetricCard
        title="Oportunidades"
        value={defaultMetrics.totalOpportunities}
        type="number"
      />
      <MetricCard
        title="Oportunidades Ganhas"
        value={defaultMetrics.wonOpportunities}
        type="number"
      />
      <MetricCard
        title="Taxa de Conversão"
        value={defaultMetrics.conversionRate}
        type="percentage"
      />
    </div>
  );
};

export default PerformanceMetrics;