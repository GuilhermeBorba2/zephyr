import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search } from 'lucide-react';

interface ClientSelectorProps {
  selectedClients: string[];
  onSelect: (clientIds: string[]) => void;
}

const ClientSelector: React.FC<ClientSelectorProps> = ({ selectedClients, onSelect }) => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const { data } = await supabase
        .from('clients')
        .select('id, name, company')
        .order('name');
      
      setClients(data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter((client: any) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar clientes..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        {loading ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            Carregando clientes...
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            Nenhum cliente encontrado
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredClients.map((client: any) => (
              <label
                key={client.id}
                className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedClients.includes(client.id)}
                  onChange={(e) => {
                    const newSelection = e.target.checked
                      ? [...selectedClients, client.id]
                      : selectedClients.filter(id => id !== client.id);
                    onSelect(newSelection);
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {client.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {client.company}
                  </p>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientSelector;