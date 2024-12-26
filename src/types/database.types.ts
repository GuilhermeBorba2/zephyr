export type Lead = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source: 'referral' | 'campaign' | 'organic' | 'other';
  notes: string;
  user_id: string;
};

export type Opportunity = {
  id: string;
  created_at: string;
  title: string;
  potential_value: number;
  closing_probability: number;
  expected_closing_date: string;
  status: 'open' | 'won' | 'lost';
  lead_id: string;
  user_id: string;
  lead?: {
    name: string;
    company: string;
  };
};

export type Client = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  document: string;
  document_type: 'cpf' | 'cnpj';
  zip_code: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  address: string;
  user_id: string;
};

export type Campaign = {
  id: string;
  created_at: string;
  name: string;
  type: 'email' | 'social' | 'ads' | 'event' | 'other';
  status: 'draft' | 'active' | 'paused' | 'completed';
  start_date: string;
  end_date?: string;
  budget: number;
  content?: string;
  target_audience: any[];
  metrics: {
    impressions?: number;
    clicks?: number;
    conversions?: number;
    revenue?: number;
    roi?: number;
  };
  user_id: string;
};

export type CampaignMetrics = {
  id: string;
  created_at: string;
  campaign_id: string;
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  user_id: string;
};