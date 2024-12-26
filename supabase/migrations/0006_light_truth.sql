/*
  # Add Campaign Columns

  1. Changes
    - Add missing columns to campaigns table
    - Add campaign_metrics table for tracking performance
    - Add campaign_audiences table for targeting

  2. Security
    - Enable RLS on new tables
    - Add policies for authenticated users
*/

-- Add missing columns to campaigns table
ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS subject text,
ADD COLUMN IF NOT EXISTS content text,
ADD COLUMN IF NOT EXISTS audience jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS schedule jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS variants jsonb DEFAULT '[]'::jsonb;

-- Create campaign metrics table
CREATE TABLE IF NOT EXISTS campaign_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) NOT NULL,
  date date NOT NULL,
  impressions integer DEFAULT 0,
  clicks integer DEFAULT 0,
  conversions integer DEFAULT 0,
  revenue numeric(10,2) DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Create campaign audiences table
CREATE TABLE IF NOT EXISTS campaign_audiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  criteria jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Enable RLS
ALTER TABLE campaign_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_audiences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their campaign metrics"
  ON campaign_metrics FOR ALL TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their campaign audiences"
  ON campaign_audiences FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS campaign_metrics_campaign_id_idx ON campaign_metrics(campaign_id);
CREATE INDEX IF NOT EXISTS campaign_metrics_date_idx ON campaign_metrics(date);