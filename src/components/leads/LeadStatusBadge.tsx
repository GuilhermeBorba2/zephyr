import React from 'react';

type StatusType = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

const statusConfig: Record<StatusType, { label: string; classes: string }> = {
  new: { label: 'Novo', classes: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' },
  contacted: { label: 'Em Contato', classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' },
  qualified: { label: 'Qualificado', classes: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' },
  converted: { label: 'Convertido', classes: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300' },
  lost: { label: 'Perdido', classes: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300' },
};

interface LeadStatusBadgeProps {
  status: StatusType;
}

const LeadStatusBadge: React.FC<LeadStatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status];
  
  if (!config) {
    console.warn(`Invalid status: ${status}`);
    return null;
  }
  
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${config.classes}`}>
      {config.label}
    </span>
  );
};

export default LeadStatusBadge;