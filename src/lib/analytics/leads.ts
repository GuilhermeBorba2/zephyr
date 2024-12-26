import { supabase } from '../supabase';

export const leadAnalytics = {
  async getConversionRate(period: 'week' | 'month' | 'year' = 'month') {
    try {
      const { data: leads } = await supabase
        .from('leads')
        .select('status, created_at');

      if (!leads?.length) return 0;

      const periodStart = new Date();
      switch (period) {
        case 'week':
          periodStart.setDate(periodStart.getDate() - 7);
          break;
        case 'month':
          periodStart.setMonth(periodStart.getMonth() - 1);
          break;
        case 'year':
          periodStart.setFullYear(periodStart.getFullYear() - 1);
          break;
      }

      const periodLeads = leads.filter(lead => 
        new Date(lead.created_at) >= periodStart
      );

      const converted = periodLeads.filter(lead => 
        lead.status === 'converted'
      ).length;

      return (converted / periodLeads.length) * 100;
    } catch (error) {
      console.error('Error getting conversion rate:', error);
      return 0;
    }
  }
};