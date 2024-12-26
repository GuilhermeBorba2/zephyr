import { supabase } from '../supabase';

export const metricsService = {
  async getPerformanceMetrics(userId: string) {
    if (!userId) return null;

    try {
      // Get today's metrics first
      const { data: metrics, error } = await supabase
        .from('analytics_metrics')
        .select('*')
        .eq('user_id', userId)
        .eq('date', new Date().toISOString().split('T')[0])
        .maybeSingle(); // Use maybeSingle() instead of single() to handle no rows gracefully

      // If no metrics exist yet, create initial metrics
      if (!metrics) {
        await this.initializeMetrics(userId);
        const { data: initialMetrics } = await supabase
          .from('analytics_metrics')
          .select('*')
          .eq('user_id', userId)
          .eq('date', new Date().toISOString().split('T')[0])
          .maybeSingle();
        
        return initialMetrics || this.getDefaultMetrics();
      }

      return metrics;
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      return this.getDefaultMetrics();
    }
  },

  async initializeMetrics(userId: string) {
    if (!userId) return null;

    try {
      const defaultMetrics = this.getDefaultMetrics();
      const { error } = await supabase
        .from('analytics_metrics')
        .insert([{
          user_id: userId,
          date: new Date().toISOString().split('T')[0],
          ...defaultMetrics
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error initializing metrics:', error);
    }
  },

  getDefaultMetrics() {
    return {
      total_leads: 0,
      total_opportunities: 0,
      won_opportunities: 0,
      conversion_rate: 0
    };
  },

  async updateMetrics(userId: string) {
    if (!userId) return null;

    try {
      // Insert a dummy record to trigger the update_user_metrics() function
      const { error } = await supabase
        .from('analytics_events')
        .insert([{
          user_id: userId,
          event_type: 'metrics_refresh'
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating metrics:', error);
    }
  }
};