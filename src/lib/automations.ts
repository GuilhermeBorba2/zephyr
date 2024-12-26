import { supabase } from './supabase';
import { useToastStore } from '../stores/toastStore';

export const automationRules = {
  // Atualiza o status do lead baseado em interações
  async updateLeadStatus(leadId: string) {
    const { data: interactions } = await supabase
      .from('interactions')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (!interactions?.length) return;

    const recentInteractions = interactions.slice(0, 5);
    const highEngagement = recentInteractions.length >= 3;

    if (highEngagement) {
      await supabase
        .from('leads')
        .update({ status: 'qualificado' })
        .eq('id', leadId);
    }
  },

  // Cria uma oportunidade automaticamente quando um lead é qualificado
  async createOpportunityFromLead(leadId: string) {
    const { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (lead?.status === 'qualificado') {
      await supabase.from('opportunities').insert([
        {
          title: `Oportunidade - ${lead.company}`,
          lead_id: leadId,
          potential_value: 0,
          closing_probability: 50,
          expected_closing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'aberta',
          user_id: lead.user_id
        }
      ]);
    }
  }
};