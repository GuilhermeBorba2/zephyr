import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Heart, ThumbsUp, MessageCircle } from 'lucide-react';
import { satisfactionService } from '../../lib/satisfaction';

const SatisfactionDashboard = () => {
  const [metrics, setMetrics] = useState({
    averageSatisfaction: 0,
    totalResponses: 0,
    nps: 0
  });
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [metricsData, historical] = await Promise.all([
        satisfactionService.getSatisfactionMetrics(),
        satisfactionService.getHistoricalData()
      ]);

      setMetrics(metricsData);
      setHistoricalData(historical);
    } catch (error) {
      console.error('Error loading satisfaction data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Satisfação Média</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {metrics.averageSatisfaction.toFixed(1)}
              </p>
            </div>
            <Heart className="w-8 h-8 text-pink-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">NPS</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {metrics.nps}
              </p>
            </div>
            <ThumbsUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total de Avaliações</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {metrics.totalResponses}
              </p>
            </div>
            <MessageCircle className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Evolução da Satisfação
        </h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="satisfaction" 
                name="Satisfação" 
                fill="#8884d8"
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="responses" 
                name="Respostas" 
                fill="#82ca9d"
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SatisfactionDashboard;