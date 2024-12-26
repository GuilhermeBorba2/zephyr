/*
  # Marketing Automation Schema Update

  1. New Tables
    - nurturing_sequences
    - campaign_variants
    - webhooks
  
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Nurturing Sequences
CREATE TABLE IF NOT EXISTS nurturing_sequences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) NOT NULL,
  steps jsonb NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  CONSTRAINT valid_status CHECK (status IN ('active', 'paused', 'completed'))
);

-- Campaign Variants
CREATE TABLE IF NOT EXISTS campaign_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) NOT NULL,
  name text NOT NULL,
  content jsonb NOT NULL,
  impressions integer DEFAULT 0,
  conversions integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Webhooks
CREATE TABLE IF NOT EXISTS webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint text NOT NULL,
  events text[] NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  last_triggered_at timestamptz,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  CONSTRAINT valid_status CHECK (status IN ('active', 'inactive'))
);

-- Enable RLS
ALTER TABLE nurturing_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their nurturing sequences"
  ON nurturing_sequences FOR ALL TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their campaign variants"
  ON campaign_variants FOR ALL TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their webhooks"
  ON webhooks FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS nurturing_sequences_lead_id_idx ON nurturing_sequences(lead_id);
CREATE INDEX IF NOT EXISTS campaign_variants_campaign_id_idx ON campaign_variants(campaign_id);
CREATE INDEX IF NOT EXISTS webhooks_status_idx ON webhooks(status);