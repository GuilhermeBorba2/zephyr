/*
  # Update leads table structure

  1. New Columns
    - Personal Information:
      - cpf (text)
      - birth_date (date)
      - position (text)
    - Corporate Information:
      - cnpj (text)
      - corporate_name (text)
      - corporate_email (text)
      - corporate_phone (text)
      - corporate_responsible (text)
    - Service Information:
      - service (text)
      - value (numeric)

  2. Security
    - Enable RLS on new columns
*/

-- Add new columns to leads table
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS cpf text,
  ADD COLUMN IF NOT EXISTS birth_date date,
  ADD COLUMN IF NOT EXISTS position text,
  ADD COLUMN IF NOT EXISTS cnpj text,
  ADD COLUMN IF NOT EXISTS corporate_name text,
  ADD COLUMN IF NOT EXISTS corporate_email text,
  ADD COLUMN IF NOT EXISTS corporate_phone text,
  ADD COLUMN IF NOT EXISTS corporate_responsible text,
  ADD COLUMN IF NOT EXISTS service text,
  ADD COLUMN IF NOT EXISTS value numeric(10,2);

-- Create indexes for improved search performance
CREATE INDEX IF NOT EXISTS leads_cpf_idx ON leads(cpf);
CREATE INDEX IF NOT EXISTS leads_cnpj_idx ON leads(cnpj);