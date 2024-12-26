import { supabase } from '../supabase';

export const revenueAnalytics = {
  async getData() {
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
  }
};