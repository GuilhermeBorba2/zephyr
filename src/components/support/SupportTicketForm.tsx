import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useToastStore } from '../../stores/toastStore';
import Input from '../common/Input';
import { Mail, User, Phone, MessageSquare } from 'lucide-react';

interface SupportTicketFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const SupportTicketForm: React.FC<SupportTicketFormProps> = ({ onSuccess, onCancel }) => {
  const addToast = useToastStore(state => state.addToast);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requester_name: '',
    requester_email: '',
    requester_phone: '',
    priority: 'medium'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('support_tickets')
        .insert([formData]);

      if (error) throw error;
      
      addToast('Ticket criado com sucesso!', 'success');
      onSuccess();
    } catch (error) {
      console.error('Error creating ticket:', error);
      addToast('Erro ao criar ticket', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Nome"
        icon={User}
        value={formData.requester_name}
        onChange={(e) => setFormData({ ...formData, requester_name: e.target.value })}
        required
      />

      <Input
        label="Email"
        type="email"
        icon={Mail}
        value={formData.requester_email}
        onChange={(e) => setFormData({ ...formData, requester_email: e.target.value })}
        required
      />

      <Input
        label="Telefone"
        icon={Phone}
        value={formData.requester_phone}
        onChange={(e) => setFormData({ ...formData, requester_phone: e.target.value })}
      />

      <Input
        label="Assunto"
        icon={MessageSquare}
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Prioridade
        </label>
        <select
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        >
          <option value="low">Baixa</option>
          <option value="medium">Média</option>
          <option value="high">Alta</option>
          <option value="urgent">Urgente</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Descrição
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={4}
          required
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </form>
  );
};

export default SupportTicketForm;