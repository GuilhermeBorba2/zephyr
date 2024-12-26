import { supabase } from './supabase';

export const scoring = {
  async calculateLeadScore(leadId: string) {
    const weights = {
      interactions: 0.4,
      recentActivity: 0.3,
      profileCompleteness: 0.3
    };

    try {
      // Get lead interactions
      const { data: interactions } = await supabase
        .from('interactions')
        .select('type, created_at')
        .eq('lead_id', leadId);

      // Calculate interaction score
      const interactionScore = calculateInteractionScore(interactions || []);
      
      // Calculate recency score
      const recencyScore = calculateRecencyScore(interactions || []);
      
      // Get lead profile data
      const { data: lead } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();
      
      // Calculate profile completeness
      const completenessScore = calculateProfileCompleteness(lead);

      // Calculate final score
      const finalScore = Math.round(
        interactionScore * weights.interactions +
        recencyScore * weights.recentActivity +
        completenessScore * weights.profileCompleteness
      );

      // Update lead score
      await supabase
        .from('lead_scores')
        .upsert({
          lead_id: leadId,
          score: finalScore,
          behavior_data: {
            interaction_score: interactionScore,
            recency_score: recencyScore,
            completeness_score: completenessScore
          }
        });

      return finalScore;
    } catch (error) {
      console.error('Error calculating lead score:', error);
      return 0;
    }
  }
};

function calculateInteractionScore(interactions: any[]) {
  const weights = {
    meeting: 10,
    call: 7,
    email: 5,
    note: 3
  };

  return interactions.reduce((score, interaction) => {
    return score + (weights[interaction.type as keyof typeof weights] || 0);
  }, 0);
}

function calculateRecencyScore(interactions: any[]) {
  if (!interactions.length) return 0;
  
  const mostRecent = new Date(Math.max(...interactions.map(i => new Date(i.created_at).getTime())));
  const daysSince = Math.floor((Date.now() - mostRecent.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSince <= 7) return 100;
  if (daysSince <= 30) return 75;
  if (daysSince <= 90) return 50;
  if (daysSince <= 180) return 25;
  return 0;
}

function calculateProfileCompleteness(lead: any) {
  if (!lead) return 0;
  
  const requiredFields = ['name', 'email', 'phone', 'company'];
  const optionalFields = ['notes', 'source'];
  
  const requiredScore = requiredFields.reduce((score, field) => {
    return score + (lead[field] ? 1 : 0);
  }, 0) / requiredFields.length * 75;
  
  const optionalScore = optionalFields.reduce((score, field) => {
    return score + (lead[field] ? 1 : 0);
  }, 0) / optionalFields.length * 25;
  
  return Math.round(requiredScore + optionalScore);
}