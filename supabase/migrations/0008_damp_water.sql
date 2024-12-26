/*
  # Marketing ROI Enhancement
  
  1. Changes
    - Add ROI tracking columns to campaigns table
    - Add ROI calculation trigger
    
  2. Security
    - Maintain existing RLS policies
*/

-- Add ROI columns to campaigns
ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS revenue numeric(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS roi numeric(5,2) GENERATED ALWAYS AS (
  CASE 
    WHEN budget > 0 THEN ((revenue - budget) / budget) * 100
    ELSE 0
  END
) STORED;

-- Create function to update campaign ROI
CREATE OR REPLACE FUNCTION update_campaign_roi()
RETURNS TRIGGER AS $$
BEGIN
  -- Update campaign revenue based on metrics
  UPDATE campaigns
  SET revenue = (
    SELECT COALESCE(SUM(revenue), 0)
    FROM campaign_metrics
    WHERE campaign_id = NEW.campaign_id
  )
  WHERE id = NEW.campaign_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update ROI
CREATE TRIGGER campaign_metrics_roi_trigger
AFTER INSERT OR UPDATE ON campaign_metrics
FOR EACH ROW
EXECUTE FUNCTION update_campaign_roi();