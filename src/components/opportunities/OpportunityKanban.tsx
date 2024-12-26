import React from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Opportunity } from '../../types/database.types';
import KanbanColumn from './KanbanColumn';
import OpportunityCard from './OpportunityCard';
import { useOpportunityStore } from '../../stores/opportunityStore';
import { supabase } from '../../lib/supabase';
import { useToastStore } from '../../stores/toastStore';

interface OpportunityKanbanProps {
  opportunities: Opportunity[];
  loading: boolean;
}

const OpportunityKanban: React.FC<OpportunityKanbanProps> = ({ opportunities, loading }) => {
  const { updateOpportunity } = useOpportunityStore();
  const addToast = useToastStore(state => state.addToast);
  const sensors = useSensors(useSensor(PointerSensor));

  const columns = [
    { id: 'aberta', title: 'Em Aberto', color: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 'ganha', title: 'Ganhas', color: 'bg-green-50 dark:bg-green-900/20' },
    { id: 'perdida', title: 'Perdidas', color: 'bg-red-50 dark:bg-red-900/20' }
  ];

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const opportunityId = active.id as string;
    const newStatus = over.id as string;
    
    try {
      const { error } = await supabase
        .from('opportunities')
        .update({ status: newStatus })
        .eq('id', opportunityId);

      if (error) throw error;

      updateOpportunity(opportunityId, { status: newStatus });
      addToast('Oportunidade atualizada com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao atualizar oportunidade:', error);
      addToast('Erro ao atualizar oportunidade', 'error');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando pipeline...</div>;
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map(column => {
          const columnOpportunities = opportunities.filter(
            opp => opp.status === column.id
          );

          return (
            <SortableContext
              key={column.id}
              items={columnOpportunities.map(opp => opp.id)}
              strategy={verticalListSortingStrategy}
            >
              <KanbanColumn
                id={column.id}
                title={column.title}
                color={column.color}
                opportunities={columnOpportunities}
              />
            </SortableContext>
          );
        })}
      </div>

      <DragOverlay>
        {/* Placeholder para o card sendo arrastado */}
      </DragOverlay>
    </DndContext>
  );
};

export default OpportunityKanban;