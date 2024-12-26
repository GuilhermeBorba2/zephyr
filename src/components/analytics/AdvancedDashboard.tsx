import React, { useState, useEffect } from 'react';
import { analytics } from '../../lib/analytics';
import { LineChart, BarChart, PieChart } from 'recharts';
import PerformanceMetrics from './PerformanceMetrics';

const AdvancedDashboard = () => {
  const [metrics, setMetrics] = useState({
    revenue: [],
    conversion: [],
    performance: {}
  });

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    const [revenue, conversion, performance] = await Promise.all([
      analytics.getRevenueData(),
      analytics.getConversionData(),
      analytics.getPerformanceData()
    ]);

    setMetrics({ revenue, conversion, performance });
  };

  return (
    <div className="space-y-6">
      <PerformanceMetrics />

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Receita por Período
          </h3>
          <LineChart data={metrics.revenue} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Taxa de Conversão
          </h3>
          <BarChart data={metrics.conversion} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performance por Consultor
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <PieChart data={metrics.performance} />
          <div className="space-y-4">
            {/* Métricas detalhadas por consultor */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedDashboard;