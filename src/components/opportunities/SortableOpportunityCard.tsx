import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Opportunity } from '../../types/database.types';
import OpportunityCard from './OpportunityCard';

interface SortableOpportunityCardProps {
  opportunity: Opportunity;
}

const SortableOpportunityCard: React.FC<SortableOpportunityCardProps> = ({ opportunity }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: opportunity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <OpportunityCard opportunity={opportunity} />
    </div>
  );
};

export default SortableOpportunityCard;