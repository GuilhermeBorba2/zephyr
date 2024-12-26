import { supabase } from '../supabase';

export const consultantAnalytics = {
  async getPerformance(userId: string) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const [leadsData, opportunitiesData] = await Promise.all([
        supabase
          .from('leads')
          .select('id, status')
          .eq('user_id', userId),
        supabase
          .from('opportunities')
          .select('id, status, potential_value')
          .eq('user_id', userId)
      ]);

      if (leadsData.error) throw leadsData.error;
      if (opportunitiesData.error) throw opportunitiesData.error;

      const leads = leadsData.data || [];
      const opportunities = opportunitiesData.data || [];

      return {
        totalLeads: leads.length,
        totalOpportunities: opportunities.length,
        wonOpportunities: opportunities.filter(opp => opp.status === 'won').length,
        conversionRate: leads.length > 0 
          ? (leads.filter(lead => lead.status === 'converted').length / leads.length) * 100 
          : 0
      };
    } catch (error) {
      console.error('Error getting consultant performance:', error);
      return {
        totalLeads: 0,
        totalOpportunities: 0,
        wonOpportunities: 0,
        conversionRate: 0
      };
    }
  }
};