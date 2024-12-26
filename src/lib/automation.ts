import { supabase } from './supabase';
import { scoring } from './scoring';
import { ai } from './ai';

export const automation = {
  async processNewInteraction(interaction: any) {
    try {
      // Update lead score
      await scoring.calculateLeadScore(interaction.lead_id);

      // Analyze sentiment if there's text content
      if (interaction.description) {
        const sentimentScore = await ai.analyzeSentiment(interaction.description);
        
        await supabase
          .from('interactions')
          .update({ sentiment_score: sentimentScore })
          .eq('id', interaction.id);
      }

      // Check for qualification triggers
      await checkQualificationTriggers(interaction.lead_id);
    } catch (error) {
      console.error('Error processing interaction:', error);
    }
  },

  async processLeadUpdate(leadId: string) {
    try {
      const score = await scoring.calculateLeadScore(leadId);
      
      // Auto-qualify leads with high scores
      if (score >= 80) {
        await supabase
          .from('leads')
          .update({ status: 'qualified' })
          .eq('id', leadId);
      }
    } catch (error) {
      console.error('Error processing lead update:', error);
    }
  }
};

async function checkQualificationTriggers(leadId: string) {
  const { data: lead } = await supabase
    .from('leads')
    .select(`
      *,
      interactions (
        type,
        created_at
      )
    `)
    .eq('id', leadId)
    .single();

  if (!lead) return;

  const interactions = lead.interactions || [];
  const recentInteractions = interactions.filter(i => {
    const date = new Date(i.created_at);
    const daysSince = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince <= 30;
  });

  // Qualify lead if there are 3+ recent interactions
  if (recentInteractions.length >= 3 && lead.status === 'new') {
    await supabase
      .from('leads')
      .update({ status: 'qualified' })
      .eq('id', leadId);
  }
}