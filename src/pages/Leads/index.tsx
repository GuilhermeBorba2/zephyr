import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Lead } from '../../types/database.types';
import SearchInput from '../../components/common/SearchInput';
import LeadTable from '../../components/leads/LeadTable';
import NewLeadModal from '../../components/modals/NewLeadModal';
import EditLeadModal from '../../components/modals/EditLeadModal';

const LeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Leads</h1>
        <button 
          onClick={() => setIsNewModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Adicionar Lead
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Pesquisar leads..."
          />
        </div>

        <div className="overflow-x-auto">
          <LeadTable 
            leads={filteredLeads}
            loading={loading}
            onEdit={handleEdit}
          />
        </div>
      </div>

      <NewLeadModal 
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSuccess={fetchLeads}
      />

      <EditLeadModal
        isOpen={!!editingLead}
        onClose={() => setEditingLead(null)}
        onSuccess={fetchLeads}
        lead={editingLead}
      />
    </div>
  );
};

export default LeadsPage;