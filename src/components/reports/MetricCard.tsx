import React from 'react';

interface MetricCardProps {
  title: string;
  value: number;
  type: 'number' | 'currency' | 'percentage';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, type }) => {
  const formatValue = (value: number, type: string) => {
    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat('pt-BR').format(value);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-gray-900">
        {formatValue(value, type)}
      </p>
    </div>
  );
};

export default MetricCard;