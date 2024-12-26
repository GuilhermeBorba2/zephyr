import React, { useState } from 'react';
import { FileDown, Filter, BarChart2 } from 'lucide-react';
import { reports } from '../../lib/reports';

const CustomReportBuilder = () => {
  const [config, setConfig] = useState({
    startDate: '',
    endDate: '',
    metrics: [],
    groupBy: '',
    filters: {}
  });

  const availableMetrics = [
    { id: 'leads', label: 'Leads' },
    { id: 'conversion_rate', label: 'Taxa de Conversão' },
    { id: 'revenue', label: 'Receita' },
    { id: 'roi', label: 'ROI' }
  ];

  const handleGenerate = async () => {
    try {
      const data = await reports.generateCustomReport({
        startDate: new Date(config.startDate),
        endDate: new Date(config.endDate),
        metrics: config.metrics,
        groupBy: config.groupBy || undefined,
        filters: Object.keys(config.filters).length ? config.filters : undefined
      });

      console.log(data);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Relatório Personalizado
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <BarChart2 className="w-4 h-4" />
            Gerar Relatório
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
            <FileDown className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Período */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Inicial
            </label>
            <input
              type="date"
              value={config.startDate}
              onChange={(e) => setConfig({ ...config, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Final
            </label>
            <input
              type="date"
              value={config.endDate}
              onChange={(e) => setConfig({ ...config, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Métricas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Métricas
          </label>
          <div className="grid grid-cols-2 gap-2">
            {availableMetrics.map(metric => (
              <label
                key={metric.id}
                className="flex items-center gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
              >
                <input
                  type="checkbox"
                  checked={config.metrics.includes(metric.id)}
                  onChange={(e) => {
                    const newMetrics = e.target.checked
                      ? [...config.metrics, metric.id]
                      : config.metrics.filter(m => m !== metric.id);
                    setConfig({ ...config, metrics: newMetrics });
                  }}
                  className="text-blue-600 dark:bg-gray-700"
                />
                {metric.label}
              </label>
            ))}
          </div>
        </div>

        {/* Filtros */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filtros
            </label>
          </div>
          <div className="border border-gray-300 dark:border-gray-600 rounded-md p-4">
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              + Adicionar Filtro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomReportBuilder;