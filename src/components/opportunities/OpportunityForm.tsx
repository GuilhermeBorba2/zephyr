import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Input from '../common/Input';
import { useAuthStore } from '../../stores/authStore';

interface OpportunityFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: any;
}

const OpportunityForm: React.FC<OpportunityFormProps> = ({ 
  onSuccess, 
  onCancel, 
  initialData 
}) => {
  const user = useAuthStore(state => state.user);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    potential_value: initialData?.potential_value || '',
    closing_probability: initialData?.closing_probability || 50,
    expected_closing_date: initialData?.expected_closing_date || '',
    status: initialData?.status || 'aberta',
    lead_id: initialData?.lead_id || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = initialData
        ? await supabase
            .from('opportunities')
            .update({ ...formData })
            .eq('id', initialData.id)
        : await supabase
            .from('opportunities')
            .insert([{ ...formData, user_id: user?.id }]);

      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar oportunidade:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Título"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />

      <Input
        label="Valor Potencial"
        type="number"
        value={formData.potential_value}
        onChange={(e) => setFormData({ ...formData, potential_value: e.target.value })}
        required
      />

      <Input
        label="Probabilidade de Fechamento (%)"
        type="number"
        min="0"
        max="100"
        value={formData.closing_probability}
        onChange={(e) => setFormData({ ...formData, closing_probability: parseInt(e.target.value) })}
        required
      />

      <Input
        label="Data Prevista de Fechamento"
        type="date"
        value={formData.expected_closing_date}
        onChange={(e) => setFormData({ ...formData, expected_closing_date: e.target.value })}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="aberta">Em Aberto</option>
          <option value="ganha">Ganha</option>
          <option value="perdida">Perdida</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
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

export default OpportunityForm;