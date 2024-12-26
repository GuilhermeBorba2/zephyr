import { OpenAI } from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.warn('OpenAI API key is missing. Some AI features may not work properly.');
}

const openai = new OpenAI({
  apiKey: apiKey || 'dummy-key',
  dangerouslyAllowBrowser: true
});

export const ai = {
  async analyzeSentiment(text: string) {
    if (!apiKey) return 0;
    
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Analyze the sentiment of the following text and return a score between -1 and 1'
          },
          { role: 'user', content: text }
        ],
        model: 'gpt-3.5-turbo'
      });

      const score = parseFloat(completion.choices[0].message.content || '0');
      return Math.max(-1, Math.min(1, score));
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return 0;
    }
  },

  async generatePersonalizedContent(lead: any) {
    if (!apiKey) return null;

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Generate personalized email content for a lead based on their profile'
          },
          { role: 'user', content: JSON.stringify(lead) }
        ],
        model: 'gpt-3.5-turbo'
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error generating personalized content:', error);
      return null;
    }
  }
};