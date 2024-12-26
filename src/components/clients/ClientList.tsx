import React, { useState } from 'react';
import { Mail, Phone, Building2 } from 'lucide-react';
import type { Client } from '../../types/database.types';
import ClientDetailsModal from '../modals/ClientDetailsModal';

interface ClientListProps {
  clients: Client[];
  loading: boolean;
}

const ClientList: React.FC<ClientListProps> = ({ clients, loading }) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  if (loading) {
    return <div className="text-center py-8">Carregando clientes...</div>;
  }

  if (clients.length === 0) {
    return <div className="text-center py-8">Nenhum cliente encontrado</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map(client => (
          <div key={client.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{client.name}</h3>
            
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span>{client.company}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <a href={`mailto:${client.email}`} className="text-blue-600 hover:underline">
                  {client.email}
                </a>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <a href={`tel:${client.phone}`} className="text-blue-600 hover:underline">
                  {client.phone}
                </a>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button 
                onClick={() => setSelectedClient(client)}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Ver detalhes
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedClient && (
        <ClientDetailsModal
          isOpen={!!selectedClient}
          onClose={() => setSelectedClient(null)}
          client={selectedClient}
        />
      )}
    </>
  );
};

export default ClientList;