import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { Opportunity } from '../../types/database.types';
import SortableOpportunityCard from './SortableOpportunityCard';

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  opportunities: Opportunity[];
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  color,
  opportunities
}) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`${color} p-4 rounded-lg shadow-sm transition-colors`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {opportunities.length}
        </span>
      </div>

      <div className="space-y-3">
        {opportunities.map(opportunity => (
          <SortableOpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;