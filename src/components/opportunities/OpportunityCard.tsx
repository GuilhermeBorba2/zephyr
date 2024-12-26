import React from 'react';
import { Calendar, DollarSign, Percent } from 'lucide-react';
import type { Opportunity } from '../../types/database.types';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <h4 className="font-medium text-gray-900 mb-2">{opportunity.title}</h4>
      
      <div className="text-sm text-gray-600 mb-2">
        {opportunity.lead?.company}
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span>{formatCurrency(opportunity.potential_value)}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Percent className="w-4 h-4 text-gray-400" />
          <span>{opportunity.closing_probability}% probabilidade</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>Previsão: {formatDate(opportunity.expected_closing_date)}</span>
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard;