/*
  # Marketing System Schema Update
  
  1. New Tables
    - `campaigns`
      - Core campaign information
      - Status tracking
      - Budget and metrics
    - `campaign_metrics`
      - Daily performance tracking
      - ROI calculations
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create campaigns table if not exists
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  start_date timestamptz,
  end_date timestamptz,
  budget numeric(10,2) DEFAULT 0,
  content text,
  target_audience jsonb DEFAULT '[]'::jsonb,
  metrics jsonb DEFAULT '{}'::jsonb,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  CONSTRAINT valid_status CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  CONSTRAINT valid_type CHECK (type IN ('email', 'social', 'ads', 'event', 'other'))
);

-- Create campaign_metrics table if not exists
CREATE TABLE IF NOT EXISTS campaign_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  campaign_id uuid REFERENCES campaigns(id) NOT NULL,
  date date NOT NULL,
  impressions integer DEFAULT 0,
  clicks integer DEFAULT 0,
  conversions integer DEFAULT 0,
  revenue numeric(10,2) DEFAULT 0,
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own campaigns"
  ON campaigns FOR ALL TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own campaign metrics"
  ON campaign_metrics FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS campaigns_user_id_idx ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS campaigns_status_idx ON campaigns(status);
CREATE INDEX IF NOT EXISTS campaign_metrics_campaign_id_idx ON campaign_metrics(campaign_id);
CREATE INDEX IF NOT EXISTS campaign_metrics_date_idx ON campaign_metrics(date);