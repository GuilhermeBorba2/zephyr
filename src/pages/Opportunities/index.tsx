import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Opportunity } from '../../types/database.types';
import SearchInput from '../../components/common/SearchInput';
import OpportunityKanban from '../../components/opportunities/OpportunityKanban';
import NewOpportunityModal from '../../components/modals/NewOpportunityModal';
import { useOpportunityStore } from '../../stores/opportunityStore';

const OpportunitiesPage = () => {
  const [loading, setLoading] = useState(true);
  const { opportunities, setOpportunities } = useOpportunityStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select(`
          *,
          lead:leads(name, company)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error('Erro ao buscar oportunidades:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOpportunities = opportunities.filter(opp =>
    opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.lead?.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Pipeline de Oportunidades
        </h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Oportunidade
        </button>
      </div>

      <div className="mb-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Pesquisar oportunidades..."
        />
      </div>

      <OpportunityKanban 
        opportunities={filteredOpportunities}
        loading={loading}
      />

      <NewOpportunityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchOpportunities}
      />
    </div>
  );
};

export default OpportunitiesPage;