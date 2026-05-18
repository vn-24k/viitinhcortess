// ============================================================================
// SUPABASE REAL CLIENT - viitinhcortes
// Cliente Supabase configurado para produção
// ============================================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase não configurado. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// ============================================================================
// SCHEMA SQL COMPLETO - Execute no Supabase SQL Editor
// ============================================================================

export const COMPLETE_SCHEMA = `
-- ============================================================================
-- PROFILES (Usuários do sistema)
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('client', 'admin')) DEFAULT 'client',
  phone TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles são visíveis por todos usuários autenticados"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- ============================================================================
-- SERVICES (Serviços da barbearia)
-- ============================================================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed de serviços
INSERT INTO services (name, description, price, duration_minutes, featured) VALUES
  ('Combo Viitinh Completo', 'Corte + Barba + Sobrancelha', 80.00, 90, true),
  ('Corte Premium', 'Degradê, Americano, Social', 45.00, 45, false),
  ('Barba Alinhada', 'Alinhamento e Terapia', 40.00, 30, false),
  ('Sobrancelha', 'Design profissional', 20.00, 15, false)
ON CONFLICT DO NOTHING;

-- RLS Services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Serviços são públicos"
  ON services FOR SELECT
  TO authenticated, anon
  USING (active = true);

-- ============================================================================
-- APPOINTMENTS (Agendamentos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE RESTRICT,
  date_time TIMESTAMP NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')) DEFAULT 'pending',
  notes TEXT,
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'refunded')) DEFAULT 'pending',
  payment_method TEXT,
  payment_id TEXT,
  amount DECIMAL(10, 2),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  before_photo_url TEXT,
  after_photo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_appointments_date ON appointments(date_time);
CREATE INDEX idx_appointments_status ON appointments(status);

-- RLS Appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clientes veem seus próprios agendamentos"
  ON appointments FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

CREATE POLICY "Admins veem todos agendamentos"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Clientes podem criar agendamentos"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Admins podem atualizar agendamentos"
  ON appointments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- PAYMENTS (Histórico de pagamentos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  method TEXT CHECK (method IN ('pix', 'card', 'cash')) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  pix_qr_code TEXT,
  pix_code TEXT,
  external_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS Payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clientes veem seus próprios pagamentos"
  ON payments FOR SELECT
  TO authenticated
  USING (
    appointment_id IN (
      SELECT id FROM appointments WHERE client_id = auth.uid()
    )
  );

-- ============================================================================
-- NOTIFICATIONS (Notificações)
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('appointment', 'payment', 'reminder', 'promo')) NOT NULL,
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem suas próprias notificações"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- SETTINGS (Configurações do sistema)
-- ============================================================================
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  type TEXT CHECK (type IN ('string', 'number', 'boolean', 'json')),
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Seed de configurações
INSERT INTO settings (key, value, type, description) VALUES
  ('business_hours_start', '09:00', 'string', 'Horário de abertura'),
  ('business_hours_end', '20:00', 'string', 'Horário de fechamento'),
  ('slot_duration', '30', 'number', 'Duração do slot em minutos'),
  ('advance_booking_days', '30', 'number', 'Dias de antecedência para agendamento'),
  ('cancellation_hours', '2', 'number', 'Horas de antecedência para cancelamento'),
  ('whatsapp_number', '5511999999999', 'string', 'Número WhatsApp'),
  ('pix_key', '', 'string', 'Chave PIX'),
  ('mercadopago_token', '', 'string', 'Token Mercado Pago')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- FUNCTIONS E TRIGGERS
-- ============================================================================

-- Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Criar perfil automaticamente ao criar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View completa de agendamentos
CREATE OR REPLACE VIEW appointments_complete AS
SELECT 
  a.id,
  a.date_time,
  a.status,
  a.payment_status,
  a.amount,
  a.rating,
  a.review,
  p.id AS client_id,
  p.full_name AS client_name,
  p.phone AS client_phone,
  p.email AS client_email,
  s.id AS service_id,
  s.name AS service_name,
  s.duration_minutes AS service_duration,
  s.price AS service_price
FROM appointments a
JOIN profiles p ON a.client_id = p.id
JOIN services s ON a.service_id = s.id;

-- Estatísticas do dashboard
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
  COUNT(*) FILTER (WHERE date_time >= CURRENT_DATE) AS today_appointments,
  COUNT(*) FILTER (WHERE status = 'confirmed') AS confirmed_appointments,
  SUM(amount) FILTER (WHERE payment_status = 'paid' AND date_time >= CURRENT_DATE) AS today_revenue,
  COUNT(DISTINCT client_id) AS total_clients,
  AVG(rating) FILTER (WHERE rating IS NOT NULL) AS avg_rating
FROM appointments;
`;
