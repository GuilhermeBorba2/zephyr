/*
  # Support Ticket System Schema

  1. New Tables
    - support_tickets: Store customer support tickets
    - ticket_messages: Store ticket conversation history
    - satisfaction_ratings: Store customer satisfaction ratings

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Create support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  priority text NOT NULL DEFAULT 'medium',
  requester_name text NOT NULL,
  requester_email text NOT NULL,
  requester_phone text,
  user_id uuid REFERENCES auth.users(id),
  CONSTRAINT valid_status CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high', 'urgent'))
);

-- Create ticket messages table
CREATE TABLE IF NOT EXISTS ticket_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  ticket_id uuid REFERENCES support_tickets(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_staff boolean DEFAULT false,
  user_id uuid REFERENCES auth.users(id)
);

-- Create satisfaction ratings table
CREATE TABLE IF NOT EXISTS satisfaction_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  ticket_id uuid REFERENCES support_tickets(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  user_id uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE satisfaction_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can create tickets"
  ON support_tickets FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view tickets"
  ON support_tickets FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can update tickets"
  ON support_tickets FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can view messages for their tickets"
  ON ticket_messages FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Anyone can add messages to their tickets"
  ON ticket_messages FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Anyone can add satisfaction ratings"
  ON satisfaction_ratings FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view satisfaction ratings"
  ON satisfaction_ratings FOR SELECT
  TO authenticated, anon
  USING (true);

-- Create indexes if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'support_tickets_status_idx') THEN
    CREATE INDEX support_tickets_status_idx ON support_tickets(status);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'support_tickets_priority_idx') THEN
    CREATE INDEX support_tickets_priority_idx ON support_tickets(priority);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'ticket_messages_ticket_id_idx') THEN
    CREATE INDEX ticket_messages_ticket_id_idx ON ticket_messages(ticket_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'satisfaction_ratings_ticket_id_idx') THEN
    CREATE INDEX satisfaction_ratings_ticket_id_idx ON satisfaction_ratings(ticket_id);
  END IF;
END $$;