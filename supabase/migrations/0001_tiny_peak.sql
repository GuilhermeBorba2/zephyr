/*
  # Initial Schema for Zephyr Pulse CRM

  1. Tables
    - users (managed by Supabase Auth)
    - leads
    - opportunities
    - clients
    - projects
    - interactions

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text,
  phone text,
  company text,
  status text NOT NULL DEFAULT 'new',
  source text NOT NULL DEFAULT 'other',
  notes text,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  CONSTRAINT valid_status CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  CONSTRAINT valid_source CHECK (source IN ('referral', 'campaign', 'organic', 'other'))
);

-- Create opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  potential_value numeric(10,2) NOT NULL DEFAULT 0,
  closing_probability integer NOT NULL DEFAULT 0,
  expected_closing_date date,
  status text NOT NULL DEFAULT 'open',
  lead_id uuid REFERENCES leads(id),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  CONSTRAINT valid_status CHECK (status IN ('open', 'won', 'lost')),
  CONSTRAINT valid_probability CHECK (closing_probability BETWEEN 0 AND 100)
);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text,
  phone text,
  company text,
  address text,
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  description text,
  value numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  client_id uuid REFERENCES clients(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  CONSTRAINT valid_status CHECK (status IN ('active', 'completed', 'cancelled'))
);

-- Create interactions table
CREATE TABLE IF NOT EXISTS interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  type text NOT NULL,
  description text NOT NULL,
  lead_id uuid REFERENCES leads(id),
  client_id uuid REFERENCES clients(id),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  CONSTRAINT valid_type CHECK (type IN ('call', 'email', 'meeting', 'note'))
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own leads"
  ON leads
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own opportunities"
  ON opportunities
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own clients"
  ON clients
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own interactions"
  ON interactions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS leads_user_id_idx ON leads(user_id);
CREATE INDEX IF NOT EXISTS opportunities_user_id_idx ON opportunities(user_id);
CREATE INDEX IF NOT EXISTS clients_user_id_idx ON clients(user_id);
CREATE INDEX IF NOT EXISTS projects_client_id_idx ON projects(client_id);
CREATE INDEX IF NOT EXISTS interactions_lead_id_idx ON interactions(lead_id);
CREATE INDEX IF NOT EXISTS interactions_client_id_idx ON interactions(client_id);