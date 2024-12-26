/*
  # Sample Data Migration
  
  This migration adds sample data for testing and demonstration purposes.
  It creates a test user and related sample data for leads, clients, opportunities, and interactions.
*/

-- Create a test user in auth.users
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'test@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Test User"}',
  'authenticated',
  'authenticated'
);

-- Insert leads
INSERT INTO leads (name, email, phone, company, status, source, notes, user_id)
VALUES
  ('João Silva', 'joao.silva@empresa.com', '11999887766', 'Tech Solutions', 'new', 'referral', 'Interessado em automação', '00000000-0000-0000-0000-000000000000'),
  ('Maria Santos', 'maria@consultoria.com', '11998765432', 'Consultoria XYZ', 'contacted', 'campaign', 'Campanha de email marketing', '00000000-0000-0000-0000-000000000000'),
  ('Pedro Oliveira', 'pedro@startup.com', '11987654321', 'Startup ABC', 'qualified', 'organic', 'Encontrou pelo Google', '00000000-0000-0000-0000-000000000000'),
  ('Ana Costa', 'ana@industria.com', '11976543210', 'Indústria Beta', 'converted', 'referral', 'Indicação do cliente Tech Solutions', '00000000-0000-0000-0000-000000000000');

-- Insert clients
INSERT INTO clients (name, email, phone, company, address, user_id)
VALUES
  ('Carlos Mendes', 'carlos@empresa.com', '11999887755', 'Empresa Alpha', 'Rua A, 123 - São Paulo', '00000000-0000-0000-0000-000000000000'),
  ('Fernanda Lima', 'fernanda@consultoria.com', '11998877665', 'Consultoria Beta', 'Av B, 456 - Rio de Janeiro', '00000000-0000-0000-0000-000000000000'),
  ('Ricardo Santos', 'ricardo@tech.com', '11987766554', 'Tech Corp', 'Rua C, 789 - Curitiba', '00000000-0000-0000-0000-000000000000');

-- Insert opportunities
WITH new_leads AS (
  SELECT id, name
  FROM leads
  WHERE user_id = '00000000-0000-0000-0000-000000000000'
)
INSERT INTO opportunities (title, potential_value, closing_probability, expected_closing_date, status, lead_id, user_id)
SELECT
  title,
  potential_value,
  closing_probability,
  expected_closing_date,
  status,
  (SELECT id FROM new_leads WHERE name = lead_name),
  '00000000-0000-0000-0000-000000000000'
FROM (
  VALUES
    ('Projeto de Automação', 50000.00, 70, '2024-05-15'::date, 'open', 'João Silva'),
    ('Consultoria Estratégica', 75000.00, 90, '2024-04-30'::date, 'won', 'Maria Santos'),
    ('Desenvolvimento Software', 100000.00, 60, '2024-06-30'::date, 'open', 'Pedro Oliveira'),
    ('Projeto Industrial', 150000.00, 85, '2024-05-30'::date, 'won', 'Ana Costa')
) AS t (title, potential_value, closing_probability, expected_closing_date, status, lead_name);

-- Insert interactions
WITH new_leads AS (
  SELECT id, name
  FROM leads
  WHERE user_id = '00000000-0000-0000-0000-000000000000'
)
INSERT INTO interactions (type, description, lead_id, user_id)
SELECT
  type,
  description,
  (SELECT id FROM new_leads WHERE name = lead_name),
  '00000000-0000-0000-0000-000000000000'
FROM (
  VALUES
    ('email', 'Primeiro contato por email', 'João Silva'),
    ('call', 'Apresentação inicial', 'Maria Santos'),
    ('meeting', 'Reunião de proposta', 'Pedro Oliveira'),
    ('note', 'Follow-up pós reunião', 'Ana Costa')
) AS t (type, description, lead_name);