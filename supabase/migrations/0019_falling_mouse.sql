/*
  # Lead Email Notification Schema

  1. New Tables
    - email_templates: Store email templates for different purposes
    - email_logs: Track sent emails

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Create email templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  subject text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create email logs table
CREATE TABLE IF NOT EXISTS email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES email_templates(id),
  recipient_email text NOT NULL,
  recipient_name text,
  subject text NOT NULL,
  content text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  sent_at timestamptz,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'sent', 'failed'))
);

-- Enable RLS
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Staff can manage email templates"
  ON email_templates FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Staff can view email logs"
  ON email_logs FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS email_logs_status_idx ON email_logs(status);
CREATE INDEX IF NOT EXISTS email_logs_recipient_email_idx ON email_logs(recipient_email);

-- Insert default welcome email template
INSERT INTO email_templates (name, subject, content) VALUES (
  'lead_welcome',
  'Bem-vindo à {company_name}',
  E'Olá {lead_name},\n\n' ||
  E'Obrigado por seu interesse em nossos produtos/serviços. É um prazer tê-lo conosco!\n\n' ||
  E'Notamos que você demonstrou interesse em {product_interest}. Gostaríamos de entender melhor suas necessidades para oferecer a melhor solução possível.\n\n' ||
  E'Em breve, um de nossos consultores entrará em contato para uma conversa mais detalhada.\n\n' ||
  E'Se preferir, você pode agendar uma reunião através do link abaixo:\n' ||
  E'{calendar_link}\n\n' ||
  E'Atenciosamente,\n' ||
  E'Equipe {company_name}'
) ON CONFLICT (name) DO NOTHING;

-- Create function to send welcome email
CREATE OR REPLACE FUNCTION send_lead_welcome_email()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO email_logs (
    template_id,
    recipient_email,
    recipient_name,
    subject,
    content,
    status
  )
  SELECT
    t.id,
    NEW.email,
    NEW.name,
    REPLACE(t.subject, '{company_name}', 'Zephyr'),
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            t.content,
            '{lead_name}', NEW.name
          ),
          '{company_name}', 'Zephyr'
        ),
        '{product_interest}', COALESCE(NEW.product_interest, 'nossos produtos/serviços')
      ),
      '{calendar_link}', 'https://calendly.com/zephyr'
    ),
    'pending'
  FROM email_templates t
  WHERE t.name = 'lead_welcome';

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new leads
DROP TRIGGER IF EXISTS lead_welcome_email_trigger ON leads;
CREATE TRIGGER lead_welcome_email_trigger
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION send_lead_welcome_email();