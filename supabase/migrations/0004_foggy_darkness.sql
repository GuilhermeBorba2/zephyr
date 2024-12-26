/*
  # Core Schema for Zephyr Pulse CRM

  1. New Tables
    - interactions (expanded)
    - projects (expanded)
    - lead_scores
    - campaigns
    - analytics
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Lead Scoring
CREATE TABLE IF NOT EXISTS lead_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) NOT NULL,
  score integer NOT NULL DEFAULT 0,
  behavior_data jsonb,
  prediction_data jsonb,
  last_updated timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Expanded Projects
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS start_date date,
ADD COLUMN IF NOT EXISTS end_date date,
ADD COLUMN IF NOT EXISTS contract_value numeric(10,2),
ADD COLUMN IF NOT EXISTS payment_terms text,
ADD COLUMN IF NOT EXISTS deliverables jsonb;

-- Expanded Interactions
ALTER TABLE interactions
ADD COLUMN IF NOT EXISTS sentiment_score numeric(3,2),
ADD COLUMN IF NOT EXISTS ai_summary text,
ADD COLUMN IF NOT EXISTS next_actions jsonb;

-- Marketing Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  start_date timestamptz,
  end_date timestamptz,
  budget numeric(10,2),
  roi numeric(5,2),
  metrics jsonb,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  CONSTRAINT valid_status CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  CONSTRAINT valid_type CHECK (type IN ('email', 'social', 'ads', 'event', 'other'))
);

-- Analytics Data
CREATE TABLE IF NOT EXISTS analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  metric_type text NOT NULL,
  metric_value numeric NOT NULL,
  metadata jsonb,
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Enable RLS
ALTER TABLE lead_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their lead scores"
  ON lead_scores FOR ALL TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their campaigns"
  ON campaigns FOR ALL TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their analytics"
  ON analytics FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS lead_scores_lead_id_idx ON lead_scores(lead_id);
CREATE INDEX IF NOT EXISTS campaigns_status_idx ON campaigns(status);
CREATE INDEX IF NOT EXISTS analytics_date_idx ON analytics(date);
CREATE INDEX IF NOT EXISTS analytics_metric_type_idx ON analytics(metric_type);