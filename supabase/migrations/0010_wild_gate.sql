/*
  # Fix Campaigns RLS Policies

  1. Changes
    - Drop existing RLS policies for campaigns table
    - Create new comprehensive RLS policies for campaigns
    - Ensure proper user_id handling
*/

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can manage their campaigns" ON campaigns;

-- Enable RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Users can view their own campaigns"
  ON campaigns
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own campaigns"
  ON campaigns
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns"
  ON campaigns
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaigns"
  ON campaigns
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);