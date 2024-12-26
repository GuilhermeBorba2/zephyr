import React from 'react';
import { UserPlus, Pencil, Ban } from 'lucide-react';
import { leadsService } from '../../lib/leads';
import { useToastStore } from '../../stores/toastStore';
import type { Lead } from '../../types/database.types';

interface LeadActionsProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onSuccess: () => void;
}

const LeadActions: React.FC<LeadActionsProps> = ({ lead, onEdit, onSuccess }) => {
  const addToast = useToastStore(state => state.addToast);

  const handleConvertToClient = async () => {
    try {
      await leadsService.convertToClient(lead);
      addToast('Lead convertido para cliente com sucesso!', 'success');
      onSuccess();
    } catch (error) {
      console.error('Error converting lead to client:', error);
      addToast('Erro ao converter lead para cliente', 'error');
    }
  };

  const handleDisable = async () => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: 'lost' })
        .eq('id', lead.id);

      if (error) throw error;
      addToast('Lead desativado com sucesso', 'success');
      onSuccess();
    } catch (error) {
      console.error('Erro ao desativar lead:', error);
      addToast('Erro ao desativar lead', 'error');
    }
  };

  return (
    <div className="flex items-center space-x-3">
      {lead.status !== 'converted' && lead.status !== 'lost' && (
        <button
          onClick={handleConvertToClient}
          className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
          title="Converter para Cliente"
        >
          <UserPlus className="w-5 h-5" />
        </button>
      )}
      
      <button
        onClick={() => onEdit(lead)}
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        title="Editar"
      >
        <Pencil className="w-5 h-5" />
      </button>
      
      {lead.status !== 'lost' && (
        <button
          onClick={handleDisable}
          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
          title="Desativar"
        >
          <Ban className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default LeadActions;