import { supabase } from './supabase';
import { useToastStore } from '../stores/toastStore';

export const leadsService = {
  async convertToClient(lead: any) {
    try {
      // Start a transaction
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .insert([{
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          company: lead.company,
          position: lead.position,
          cnpj: lead.cnpj,
          corporate_name: lead.corporate_name,
          corporate_email: lead.corporate_email,
          corporate_phone: lead.corporate_phone,
          corporate_responsible: lead.corporate_responsible,
          service: lead.product_interest,
          value: lead.budget,
          status: 'active',
          user_id: lead.user_id
        }])
        .select()
        .single();

      if (clientError) throw clientError;

      // Update lead status
      const { error: leadError } = await supabase
        .from('leads')
        .update({ status: 'converted' })
        .eq('id', lead.id);

      if (leadError) throw leadError;

      return client;
    } catch (error) {
      console.error('Error converting lead to client:', error);
      throw error;
    }
  }
};