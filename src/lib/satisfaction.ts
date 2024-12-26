import { supabase } from './supabase';

export const satisfactionService = {
  async getSatisfactionMetrics(period: 'week' | 'month' | 'year' = 'month') {
    try {
      const { data: ratings } = await supabase
        .from('satisfaction_ratings')
        .select(`
          rating,
          comment,
          created_at,
          ticket:tickets(
            title,
            status
          )
        `)
        .gte('created_at', getPeriodStart(period));

      if (!ratings?.length) return {
        averageSatisfaction: 0,
        totalResponses: 0,
        nps: 0
      };

      const totalRatings = ratings.length;
      const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;
      
      // Calculate NPS
      const promoters = ratings.filter(r => r.rating >= 9).length;
      const detractors = ratings.filter(r => r.rating <= 6).length;
      const nps = ((promoters - detractors) / totalRatings) * 100;

      return {
        averageSatisfaction: averageRating,
        totalResponses: totalRatings,
        nps: Math.round(nps)
      };
    } catch (error) {
      console.error('Error fetching satisfaction metrics:', error);
      return {
        averageSatisfaction: 0,
        totalResponses: 0,
        nps: 0
      };
    }
  },

  async getHistoricalData(period: 'week' | 'month' | 'year' = 'month') {
    try {
      const { data: ratings } = await supabase
        .from('satisfaction_ratings')
        .select('rating, created_at')
        .gte('created_at', getPeriodStart(period))
        .order('created_at');

      if (!ratings?.length) return [];

      // Group by month
      const monthlyData = ratings.reduce((acc: any, rating) => {
        const month = new Date(rating.created_at).toLocaleDateString('pt-BR', { 
          month: 'short',
          year: 'numeric'
        });
        
        if (!acc[month]) {
          acc[month] = {
            satisfaction: 0,
            responses: 0
          };
        }
        
        acc[month].satisfaction += rating.rating;
        acc[month].responses += 1;
        return acc;
      }, {});

      return Object.entries(monthlyData).map(([month, data]: [string, any]) => ({
        month,
        satisfaction: data.satisfaction / data.responses,
        responses: data.responses
      }));
    } catch (error) {
      console.error('Error fetching historical data:', error);
      return [];
    }
  }
};

function getPeriodStart(period: 'week' | 'month' | 'year'): string {
  const date = new Date();
  switch (period) {
    case 'week':
      date.setDate(date.getDate() - 7);
      break;
    case 'month':
      date.setMonth(date.getMonth() - 1);
      break;
    case 'year':
      date.setFullYear(date.getFullYear() - 1);
      break;
  }
  return date.toISOString();
}