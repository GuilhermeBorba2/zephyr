import { supabase } from './supabase';
import type { Campaign } from '../types/database.types';
import { useAuthStore } from '../stores/authStore';

export const marketing = {
  async createCampaign(campaignData: Partial<Campaign>) {
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('campaigns')
        .insert([{ ...campaignData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  },

  async updateCampaign(id: string, campaignData: Partial<Campaign>) {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .update(campaignData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  },

  async updateCampaignStatus(id: string, status: string) {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating campaign status:', error);
      throw new Error('Failed to update campaign status');
    }
  },

  async getCampaigns() {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  }
};