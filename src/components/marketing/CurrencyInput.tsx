import React from 'react';
import { DollarSign } from 'lucide-react';

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  required?: boolean;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  label,
  required
}) => {
  const formatValue = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(val);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove currency formatting and convert to number
    const numericValue = e.target.value.replace(/[^\d,]/g, '').replace(',', '.');
    const value = parseFloat(numericValue);
    
    if (!isNaN(value)) {
      onChange(value);
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <DollarSign className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={formatValue(value)}
          onChange={handleChange}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required={required}
        />
      </div>
    </div>
  );
};

export default CurrencyInput;