import { supabase } from '../supabase';
import type { Campaign } from '../../types/database.types';
import { useAuthStore } from '../../stores/authStore';

export const campaignApi = {
  async create(campaignData: Partial<Campaign>) {
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('campaigns')
      .insert([{ ...campaignData, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, campaignData: Partial<Campaign>) {
    const { data, error } = await supabase
      .from('campaigns')
      .update(campaignData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('campaigns')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};