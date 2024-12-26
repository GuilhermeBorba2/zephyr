/*
  # Update Leads Schema for Business Clients

  1. Changes
    - Remove personal fields
    - Add business fields
    - Update status values before constraint
    - Add indexes
*/

-- First remove personal-only fields
ALTER TABLE leads
  DROP COLUMN IF EXISTS cpf,
  DROP COLUMN IF EXISTS birth_date;

-- Add new columns initially allowing NULL
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS cnpj text,
  ADD COLUMN IF NOT EXISTS corporate_name text,
  ADD COLUMN IF NOT EXISTS corporate_email text,
  ADD COLUMN IF NOT EXISTS corporate_phone text,
  ADD COLUMN IF NOT EXISTS corporate_responsible text,
  ADD COLUMN IF NOT EXISTS responsible_position text,
  ADD COLUMN IF NOT EXISTS service text,
  ADD COLUMN IF NOT EXISTS value numeric(10,2);

-- Update existing records with default values
UPDATE leads SET
  cnpj = COALESCE(cnpj, '00000000000000'),
  corporate_name = COALESCE(corporate_name, company),
  corporate_email = COALESCE(corporate_email, email),
  corporate_phone = COALESCE(corporate_phone, phone),
  corporate_responsible = COALESCE(corporate_responsible, name),
  responsible_position = COALESCE(responsible_position, 'Diretor'),
  service = COALESCE(service, 'Consultoria'),
  value = COALESCE(value, 0);

-- Update existing status values to match new enum
UPDATE leads SET status = 'new' WHERE status NOT IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost');

-- Drop existing status constraint
ALTER TABLE leads DROP CONSTRAINT IF EXISTS valid_status;

-- Add new status constraint
ALTER TABLE leads ADD CONSTRAINT valid_status CHECK (
  status IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost')
);

-- Now make columns NOT NULL
ALTER TABLE leads
  ALTER COLUMN cnpj SET NOT NULL,
  ALTER COLUMN corporate_name SET NOT NULL,
  ALTER COLUMN corporate_email SET NOT NULL,
  ALTER COLUMN corporate_phone SET NOT NULL,
  ALTER COLUMN corporate_responsible SET NOT NULL,
  ALTER COLUMN responsible_position SET NOT NULL,
  ALTER COLUMN service SET NOT NULL,
  ALTER COLUMN value SET NOT NULL;

-- Add CNPJ validation
ALTER TABLE leads
  ADD CONSTRAINT valid_cnpj CHECK (length(regexp_replace(cnpj, '\D', '', 'g')) = 14);

-- Update indexes for improved search performance
DROP INDEX IF EXISTS leads_cpf_idx;
CREATE INDEX IF NOT EXISTS leads_corporate_name_idx ON leads(corporate_name);
CREATE INDEX IF NOT EXISTS leads_cnpj_idx ON leads(cnpj);
CREATE INDEX IF NOT EXISTS leads_service_idx ON leads(service);