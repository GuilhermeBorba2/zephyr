/*
  # Fix Campaign Tables Structure

  1. Changes
    - Drop and recreate campaigns table with correct structure
    - Add proper constraints and indexes
    
  2. Security
    - Maintain existing RLS policies
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS campaign_metrics CASCADE;
DROP TABLE IF EXISTS campaigns CASCADE;

-- Create campaigns table
CREATE TABLE campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  start_date timestamptz,
  end_date timestamptz,
  budget numeric(10,2) DEFAULT 0,
  revenue numeric(10,2) DEFAULT 0,
  content text,
  target_audience jsonb DEFAULT '[]'::jsonb,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  CONSTRAINT valid_status CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  CONSTRAINT valid_type CHECK (type IN ('email', 'social', 'ads', 'event', 'other'))
);

-- Create campaign metrics table
CREATE TABLE campaign_metrics (
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

-- Add ROI column
ALTER TABLE campaigns ADD COLUMN roi numeric(5,2) GENERATED ALWAYS AS (
  CASE 
    WHEN budget > 0 THEN ((revenue - budget) / budget) * 100
    ELSE 0
  END
) STORED;

-- Enable RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their campaigns"
  ON campaigns FOR ALL TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their campaign metrics"
  ON campaign_metrics FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX campaigns_user_id_idx ON campaigns(user_id);
CREATE INDEX campaigns_status_idx ON campaigns(status);
CREATE INDEX campaign_metrics_campaign_id_idx ON campaign_metrics(campaign_id);
CREATE INDEX campaign_metrics_date_idx ON campaign_metrics(date);