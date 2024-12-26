import React from 'react';
import { Briefcase, DollarSign } from 'lucide-react';
import Input from '../../common/Input';

interface ServiceInfoProps {
  data: {
    service: string;
    value: string;
    status: string;
  };
  onChange: (field: string, value: string) => void;
}

const ServiceInfoSection: React.FC<ServiceInfoProps> = ({ data, onChange }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Informações do Serviço
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Serviço"
          icon={Briefcase}
          value={data.service}
          onChange={(e) => onChange('service', e.target.value)}
          required
        />

        <Input
          label="Valor"
          icon={DollarSign}
          type="number"
          min="0"
          step="0.01"
          value={data.value}
          onChange={(e) => onChange('value', e.target.value)}
          required
        />

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status do Lead
          </label>
          <select
            value={data.status}
            onChange={(e) => onChange('status', e.target.value)}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base py-3 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            required
          >
            <option value="new">Novo</option>
            <option value="contacted">Em Contato</option>
            <option value="qualified">Qualificado</option>
            <option value="proposal">Proposta Enviada</option>
            <option value="negotiation">Em Negociação</option>
            <option value="won">Ganho</option>
            <option value="lost">Perdido</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ServiceInfoSection;