import React, { useState } from 'react';
import { marketing } from '../../lib/marketing';
import { useToastStore } from '../../stores/toastStore';
import Input from '../common/Input';
import CurrencyInput from './CurrencyInput';
import type { Campaign } from '../../types/database.types';

interface CampaignEditorProps {
  initialData?: Campaign | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const CampaignEditor: React.FC<CampaignEditorProps> = ({
  initialData,
  onSuccess,
  onCancel
}) => {
  const addToast = useToastStore(state => state.addToast);
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'email',
    status: initialData?.status || 'draft',
    start_date: initialData?.start_date?.split('T')[0] || '',
    end_date: initialData?.end_date?.split('T')[0] || '',
    budget: initialData?.budget || 0,
    content: initialData?.content || '',
    target_audience: initialData?.target_audience || []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData) {
        await marketing.updateCampaign(initialData.id, campaign);
        addToast('Campanha atualizada com sucesso!', 'success');
      } else {
        await marketing.createCampaign(campaign);
        addToast('Campanha criada com sucesso!', 'success');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving campaign:', error);
      addToast('Erro ao salvar campanha', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Nome da Campanha"
        value={campaign.name}
        onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo
          </label>
          <select
            value={campaign.type}
            onChange={(e) => setCampaign({ ...campaign, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="email">Email</option>
            <option value="social">Redes Sociais</option>
            <option value="ads">Anúncios</option>
            <option value="event">Evento</option>
            <option value="other">Outro</option>
          </select>
        </div>

        <CurrencyInput
          label="Orçamento"
          value={campaign.budget}
          onChange={(value) => setCampaign({ ...campaign, budget: value })}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="date"
          label="Data de Início"
          value={campaign.start_date}
          onChange={(e) => setCampaign({ ...campaign, start_date: e.target.value })}
          required
        />

        <Input
          type="date"
          label="Data de Término"
          value={campaign.end_date}
          onChange={(e) => setCampaign({ ...campaign, end_date: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Conteúdo da Campanha
        </label>
        <textarea
          value={campaign.content}
          onChange={(e) => setCampaign({ ...campaign, content: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-32"
          required
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
};

export default CampaignEditor;