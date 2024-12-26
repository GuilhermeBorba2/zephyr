import React from 'react';
import { Package, FileText, DollarSign } from 'lucide-react';
import Input from '../../common/Input';

interface InterestInfoProps {
  data: {
    product_interest: string;
    needs: string;
    budget: string;
  };
  onChange: (field: string, value: string) => void;
}

const InterestInfoSection: React.FC<InterestInfoProps> = ({ data, onChange }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Informações de Interesse
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Produto/Serviço de Interesse"
          icon={Package}
          value={data.product_interest}
          onChange={(e) => onChange('product_interest', e.target.value)}
          required
        />

        <Input
          label="Orçamento Estimado"
          icon={DollarSign}
          type="number"
          min="0"
          step="0.01"
          value={data.budget}
          onChange={(e) => onChange('budget', e.target.value)}
          required
        />

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Necessidades
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              value={data.needs}
              onChange={(e) => onChange('needs', e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={3}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestInfoSection;