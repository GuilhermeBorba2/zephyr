import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, Phone, Building2 } from 'lucide-react';
import SearchInput from '../common/SearchInput';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data } = await supabase
        .from('clients')
        .select('*')
        .order('name');
      
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter((customer: any) =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Carregando clientes...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Pesquisar clientes..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer: any) => (
          <div key={customer.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {customer.name}
            </h3>

            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>{customer.company}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${customer.email}`} className="hover:text-blue-600">
                  {customer.email}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href={`tel:${customer.phone}`} className="hover:text-blue-600">
                  {customer.phone}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerList;