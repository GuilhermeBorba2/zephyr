import React from 'react';
import { Calendar, DollarSign, Activity, Pencil, Play, Pause, Check } from 'lucide-react';
import type { Campaign } from '../../types/database.types';
import { marketing } from '../../lib/marketing';
import { useToastStore } from '../../stores/toastStore';

interface CampaignListProps {
  campaigns: Campaign[];
  loading: boolean;
  onEdit: (campaign: Campaign) => void;
  onRefresh: () => void;
}

const CampaignList: React.FC<CampaignListProps> = ({ 
  campaigns, 
  loading, 
  onEdit,
  onRefresh
}) => {
  const addToast = useToastStore(state => state.addToast);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleStatusChange = async (campaign: Campaign, newStatus: string) => {
    try {
      await marketing.updateCampaignStatus(campaign.id, newStatus);
      addToast('Status da campanha atualizado com sucesso!', 'success');
      onRefresh();
    } catch (error) {
      console.error('Error updating campaign status:', error);
      addToast('Erro ao atualizar status da campanha', 'error');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-800 animate-pulse h-48 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Nenhuma campanha encontrada
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {campaigns.map(campaign => (
        <div key={campaign.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {campaign.name}
            </h3>
            <span className={`
              px-2 py-1 text-xs font-medium rounded-full
              ${campaign.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : ''}
              ${campaign.status === 'draft' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300' : ''}
              ${campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' : ''}
              ${campaign.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' : ''}
            `}>
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Início: {new Date(campaign.start_date).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span>Orçamento: {formatCurrency(campaign.budget)}</span>
            </div>

            {campaign.metrics && (
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span>ROI: {campaign.roi?.toFixed(2)}%</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
            <button
              onClick={() => onEdit(campaign)}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <Pencil className="w-4 h-4" />
              Editar
            </button>

            <div className="flex gap-2">
              {campaign.status === 'draft' && (
                <button
                  onClick={() => handleStatusChange(campaign, 'active')}
                  className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                >
                  <Play className="w-4 h-4" />
                  Iniciar
                </button>
              )}

              {campaign.status === 'active' && (
                <button
                  onClick={() => handleStatusChange(campaign, 'paused')}
                  className="flex items-center gap-1 text-sm text-yellow-600 hover:text-yellow-700"
                >
                  <Pause className="w-4 h-4" />
                  Pausar
                </button>
              )}

              {campaign.status === 'paused' && (
                <button
                  onClick={() => handleStatusChange(campaign, 'active')}
                  className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                >
                  <Play className="w-4 h-4" />
                  Retomar
                </button>
              )}

              {['active', 'paused'].includes(campaign.status) && (
                <button
                  onClick={() => handleStatusChange(campaign, 'completed')}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Check className="w-4 h-4" />
                  Concluir
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CampaignList;