/*
  # Add Client Fields

  1. Changes
    - Add new fields to clients table:
      - document (CPF/CNPJ)
      - document_type (cpf/cnpj)
      - zip_code
      - street
      - number
      - complement
      - neighborhood
      - city
      - state

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns to clients table
ALTER TABLE clients 
  ADD COLUMN IF NOT EXISTS document text,
  ADD COLUMN IF NOT EXISTS document_type text CHECK (document_type IN ('cpf', 'cnpj')),
  ADD COLUMN IF NOT EXISTS zip_code text,
  ADD COLUMN IF NOT EXISTS street text,
  ADD COLUMN IF NOT EXISTS number text,
  ADD COLUMN IF NOT EXISTS complement text,
  ADD COLUMN IF NOT EXISTS neighborhood text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS state text;

-- Create index for document search
CREATE INDEX IF NOT EXISTS clients_document_idx ON clients(document);