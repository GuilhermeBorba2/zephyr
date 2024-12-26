import { supabase } from './supabase';

export const webhooks = {
  async registerWebhook(endpoint: string, events: string[]) {
    try {
      const { data, error } = await supabase
        .from('webhooks')
        .insert([{
          endpoint,
          events,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error registering webhook:', error);
      throw error;
    }
  },

  async triggerWebhooks(event: string, payload: any) {
    try {
      const { data: webhooks } = await supabase
        .from('webhooks')
        .select('*')
        .contains('events', [event])
        .eq('status', 'active');

      if (!webhooks?.length) return;

      // Trigger webhooks in parallel
      await Promise.all(
        webhooks.map(webhook =>
          fetch(webhook.endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              event,
              payload,
              timestamp: new Date().toISOString()
            })
          })
        )
      );
    } catch (error) {
      console.error('Error triggering webhooks:', error);
    }
  }
};