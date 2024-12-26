import React, { useState, useEffect } from 'react';
import { MessageSquare, Clock, User, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import SearchInput from '../common/SearchInput';
import SatisfactionRatingModal from './SatisfactionRatingModal';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data } = await supabase
        .from('tickets')
        .select(`
          *,
          client:clients(name),
          satisfaction_ratings(rating)
        `)
        .order('created_at', { ascending: false });
      
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter((ticket: any) =>
    ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.client?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Carregando tickets...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Pesquisar tickets..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTickets.map((ticket: any) => (
          <div key={ticket.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {ticket.title}
              </h3>
              <span className={`
                px-2 py-1 text-xs font-medium rounded-full
                ${ticket.status === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : ''}
                ${ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' : ''}
                ${ticket.status === 'closed' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300' : ''}
              `}>
                {ticket.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{ticket.client?.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>{ticket.description}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {ticket.status === 'closed' && !ticket.satisfaction_ratings?.length && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setSelectedTicket(ticket)}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Star className="w-4 h-4" />
                  Avaliar Atendimento
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedTicket && (
        <SatisfactionRatingModal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onSuccess={fetchTickets}
          ticketId={selectedTicket.id}
        />
      )}
    </div>
  );
};

export default TicketList;