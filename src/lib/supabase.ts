// ============================================================================
// SUPABASE CLIENT - viitinhcortes
// Cliente Supabase configurado
// ============================================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase não configurado. Configure as variáveis de ambiente.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// ============================================================================
// DATABASE SCHEMA (SQL para criar as tabelas)
// ============================================================================
/*

-- CLIENTS TABLE
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  telefone TEXT UNIQUE NOT NULL,
  data_criacao TIMESTAMP DEFAULT NOW()
);

-- SERVICES TABLE
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  duracao_minutos INTEGER NOT NULL,
  destaque BOOLEAN DEFAULT FALSE
);

-- APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  data_hora TIMESTAMP NOT NULL,
  status TEXT CHECK (status IN ('confirmado', 'pendente', 'cancelado')) DEFAULT 'pendente',
  data_criacao TIMESTAMP DEFAULT NOW()
);

-- AVAILABILITY TABLE
CREATE TABLE IF NOT EXISTS availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  ocupado BOOLEAN DEFAULT FALSE,
  UNIQUE(data, hora_inicio)
);

-- INDEXES
CREATE INDEX idx_appointments_data_hora ON appointments(data_hora);
CREATE INDEX idx_availability_data ON availability(data);

*/
