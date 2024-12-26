/*
  # Update Leads and Clients Schema

  1. New Fields for Leads
    - Added product_interest
    - Added needs
    - Added budget
    - Added campaign
    - Updated status options
    - Added source tracking

  2. New Fields for Clients
    - Added birth_date
    - Added position
    - Added service
    - Added value
    - Added status

  3. Security
    - Maintain existing RLS policies
    - Add constraints for new fields
*/

-- Update leads table with new fields
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS product_interest text,
  ADD COLUMN IF NOT EXISTS needs text,
  ADD COLUMN IF NOT EXISTS budget numeric(10,2),
  ADD COLUMN IF NOT EXISTS campaign text,
  DROP CONSTRAINT IF EXISTS valid_status,
  ADD CONSTRAINT valid_status CHECK (
    status IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost', 'converted')
  );

-- Update clients table with new fields
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS birth_date date,
  ADD COLUMN IF NOT EXISTS position text,
  ADD COLUMN IF NOT EXISTS service text,
  ADD COLUMN IF NOT EXISTS value numeric(10,2),
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'active',
  ADD CONSTRAINT valid_client_status CHECK (
    status IN ('active', 'inactive', 'blocked')
  );

-- Create indexes for improved performance
CREATE INDEX IF NOT EXISTS leads_product_interest_idx ON leads(product_interest);
CREATE INDEX IF NOT EXISTS leads_budget_idx ON leads(budget);
CREATE INDEX IF NOT EXISTS clients_service_idx ON clients(service);
CREATE INDEX IF NOT EXISTS clients_status_idx ON clients(status);

-- Update existing leads with default values
UPDATE leads SET
  product_interest = COALESCE(product_interest, ''),
  needs = COALESCE(needs, ''),
  budget = COALESCE(budget, 0),
  campaign = COALESCE(campaign, '');

-- Update existing clients with default values
UPDATE clients SET
  service = COALESCE(service, ''),
  value = COALESCE(value, 0),
  status = COALESCE(status, 'active');