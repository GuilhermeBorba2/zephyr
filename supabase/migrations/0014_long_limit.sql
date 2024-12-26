/*
  # Add Analytics Metrics Tables

  1. New Tables
    - analytics_metrics: Stores aggregated metrics data
    - analytics_events: Stores raw analytics events
  
  2. Security
    - Enable RLS on new tables
    - Add policies for authenticated users
*/

-- Create analytics metrics table
CREATE TABLE IF NOT EXISTS analytics_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  total_leads integer DEFAULT 0,
  total_opportunities integer DEFAULT 0,
  won_opportunities integer DEFAULT 0,
  conversion_rate numeric(5,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE analytics_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own metrics"
  ON analytics_metrics FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own metrics"
  ON analytics_metrics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own metrics"
  ON analytics_metrics FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own events"
  ON analytics_events FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX analytics_metrics_user_date_idx ON analytics_metrics(user_id, date);
CREATE INDEX analytics_events_user_type_idx ON analytics_events(user_id, event_type);

-- Create function to update metrics
CREATE OR REPLACE FUNCTION update_user_metrics()
RETURNS trigger AS $$
BEGIN
  INSERT INTO analytics_metrics (
    user_id,
    date,
    total_leads,
    total_opportunities,
    won_opportunities,
    conversion_rate
  )
  SELECT
    NEW.user_id,
    CURRENT_DATE,
    (SELECT COUNT(*) FROM leads WHERE user_id = NEW.user_id),
    (SELECT COUNT(*) FROM opportunities WHERE user_id = NEW.user_id),
    (SELECT COUNT(*) FROM opportunities WHERE user_id = NEW.user_id AND status = 'won'),
    CASE
      WHEN (SELECT COUNT(*) FROM leads WHERE user_id = NEW.user_id) > 0
      THEN (
        (SELECT COUNT(*) FROM opportunities WHERE user_id = NEW.user_id AND status = 'won')::numeric /
        (SELECT COUNT(*) FROM leads WHERE user_id = NEW.user_id)::numeric * 100
      )
      ELSE 0
    END
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    total_leads = EXCLUDED.total_leads,
    total_opportunities = EXCLUDED.total_opportunities,
    won_opportunities = EXCLUDED.won_opportunities,
    conversion_rate = EXCLUDED.conversion_rate,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update metrics
CREATE TRIGGER update_metrics_on_lead
  AFTER INSERT OR UPDATE OR DELETE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_user_metrics();

CREATE TRIGGER update_metrics_on_opportunity
  AFTER INSERT OR UPDATE OR DELETE ON opportunities
  FOR EACH ROW
  EXECUTE FUNCTION update_user_metrics();