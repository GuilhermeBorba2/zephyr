import React from 'react';
import type { Lead } from '../../types/database.types';
import LeadStatusBadge from './LeadStatusBadge';
import LeadActions from './LeadActions';

interface LeadTableProps {
  leads: Lead[];
  loading: boolean;
  onEdit: (lead: Lead) => void;
  onRefresh: () => void;
}

const LeadTable: React.FC<LeadTableProps> = ({ leads, loading, onEdit, onRefresh }) => {
  if (loading) {
    return (
      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
        Carregando...
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
        Nenhum lead encontrado
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead className="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Nome
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Empresa
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Origem
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Ações
          </th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {leads.map((lead) => (
          <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {lead.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {lead.email}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {lead.corporate_name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <LeadStatusBadge status={lead.status} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {lead.source === 'referral' && 'Indicação'}
              {lead.source === 'campaign' && 'Campanha'}
              {lead.source === 'organic' && 'Orgânico'}
              {lead.source === 'other' && 'Outros'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              <LeadActions
                lead={lead}
                onEdit={onEdit}
                onSuccess={onRefresh}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LeadTable;