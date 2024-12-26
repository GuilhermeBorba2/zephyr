import { supabase } from './supabase';

export const analytics = {
  async getLeadConversionRate(period: 'week' | 'month' | 'year' = 'month') {
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
  },

  async getAverageOpportunityValue() {
    try {
      const { data: opportunities } = await supabase
        .from('opportunities')
        .select('potential_value')
        .eq('status', 'won');

      if (!opportunities?.length) return 0;

      const total = opportunities.reduce((sum, opp) => 
        sum + (opp.potential_value || 0), 0
      );

      return total / opportunities.length;
    } catch (error) {
      console.error('Error getting average value:', error);
      return 0;
    }
  },

  async getSalesCycle() {
    try {
      const { data: opportunities } = await supabase
        .from('opportunities')
        .select('created_at, expected_closing_date')
        .eq('status', 'won');

      if (!opportunities?.length) return 0;

      const cycles = opportunities.map(opp => {
        const start = new Date(opp.created_at);
        const end = new Date(opp.expected_closing_date);
        return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      });

      return Math.round(cycles.reduce((sum, days) => sum + days, 0) / cycles.length);
    } catch (error) {
      console.error('Error getting sales cycle:', error);
      return 0;
    }
  },

  async getRevenueData() {
    try {
      const { data: opportunities } = await supabase
        .from('opportunities')
        .select('potential_value, expected_closing_date')
        .eq('status', 'won')
        .order('expected_closing_date');

      if (!opportunities?.length) return [];

      return opportunities.map(opp => ({
        date: new Date(opp.expected_closing_date).toLocaleDateString(),
        value: opp.potential_value
      }));
    } catch (error) {
      console.error('Error getting revenue data:', error);
      return [];
    }
  },

  async getConversionData() {
    try {
      const { data: leads } = await supabase
        .from('leads')
        .select('status, created_at');

      if (!leads?.length) return [];

      const monthlyData = leads.reduce((acc: any, lead) => {
        const month = new Date(lead.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        if (!acc[month]) {
          acc[month] = { total: 0, converted: 0 };
        }
        acc[month].total++;
        if (lead.status === 'converted') {
          acc[month].converted++;
        }
        return acc;
      }, {});

      return Object.entries(monthlyData).map(([month, data]: [string, any]) => ({
        month,
        rate: (data.converted / data.total) * 100
      }));
    } catch (error) {
      console.error('Error getting conversion data:', error);
      return [];
    }
  },

  async getPerformanceData() {
    try {
      const { data: opportunities } = await supabase
        .from('opportunities')
        .select('user_id, status, potential_value');

      if (!opportunities?.length) return [];

      const performance = opportunities.reduce((acc: any, opp) => {
        if (!acc[opp.user_id]) {
          acc[opp.user_id] = { total: 0, won: 0, value: 0 };
        }
        acc[opp.user_id].total++;
        if (opp.status === 'won') {
          acc[opp.user_id].won++;
          acc[opp.user_id].value += opp.potential_value || 0;
        }
        return acc;
      }, {});

      return Object.entries(performance).map(([userId, data]: [string, any]) => ({
        userId,
        winRate: (data.won / data.total) * 100,
        value: data.value
      }));
    } catch (error) {
      console.error('Error getting performance data:', error);
      return [];
    }
  }
};