/*
  # Create tickets and related tables

  1. New Tables
    - tickets: Armazena os chamados de suporte
    - ticket_messages: Mensagens de cada chamado
    - satisfaction_ratings: Avaliações de satisfação

  2. Security
    - RLS habilitado em todas as tabelas
    - Políticas para usuários autenticados
*/

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'open',
  priority text NOT NULL DEFAULT 'medium',
  client_id uuid REFERENCES clients(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  CONSTRAINT valid_status CHECK (status IN ('open', 'in_progress', 'closed')),
  CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high', 'urgent'))
);

-- Create ticket messages table
CREATE TABLE IF NOT EXISTS ticket_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid REFERENCES tickets(id) ON DELETE CASCADE,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Create satisfaction ratings table
CREATE TABLE IF NOT EXISTS satisfaction_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid REFERENCES tickets(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE satisfaction_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies for tickets
CREATE POLICY "Users can view tickets"
  ON tickets FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert tickets"
  ON tickets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tickets"
  ON tickets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for messages
CREATE POLICY "Users can view messages"
  ON ticket_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert messages"
  ON ticket_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policies for ratings
CREATE POLICY "Users can view ratings"
  ON satisfaction_ratings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert ratings"
  ON satisfaction_ratings FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes
CREATE INDEX tickets_client_id_idx ON tickets(client_id);
CREATE INDEX tickets_status_idx ON tickets(status);
CREATE INDEX ticket_messages_ticket_id_idx ON ticket_messages(ticket_id);
CREATE INDEX satisfaction_ratings_ticket_id_idx ON satisfaction_ratings(ticket_id);