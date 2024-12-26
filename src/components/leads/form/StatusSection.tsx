import React from 'react';
import { Activity } from 'lucide-react';

interface StatusSectionProps {
  status: string;
  onChange: (value: string) => void;
}

const StatusSection: React.FC<StatusSectionProps> = ({ status, onChange }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Status do Lead
      </h3>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Activity className="h-5 w-5 text-gray-400" />
        </div>
        <select
          value={status}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
  );
};

export default StatusSection;