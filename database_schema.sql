-- ============================================================================
-- DATABASE SCHEMA - viitinhcortes
-- PostgreSQL / Supabase
-- ============================================================================

-- ============================================================================
-- TABELA: clients (Clientes)
-- ============================================================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  telefone TEXT UNIQUE NOT NULL,
  email TEXT,
  data_criacao TIMESTAMP DEFAULT NOW(),
  ultimo_agendamento TIMESTAMP,
  total_agendamentos INTEGER DEFAULT 0,
  
  -- Constraints
  CONSTRAINT clients_telefone_check CHECK (LENGTH(telefone) >= 10)
);

-- Índices para performance
CREATE INDEX idx_clients_telefone ON clients(telefone);
CREATE INDEX idx_clients_nome ON clients(nome);

-- ============================================================================
-- TABELA: services (Serviços)
-- ============================================================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  duracao_minutos INTEGER NOT NULL,
  destaque BOOLEAN DEFAULT FALSE,
  ativo BOOLEAN DEFAULT TRUE,
  ordem INTEGER DEFAULT 0,
  data_criacao TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT services_preco_check CHECK (preco > 0),
  CONSTRAINT services_duracao_check CHECK (duracao_minutos > 0)
);

-- Índices
CREATE INDEX idx_services_ativo ON services(ativo);
CREATE INDEX idx_services_destaque ON services(destaque);

-- ============================================================================
-- TABELA: appointments (Agendamentos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  data_hora TIMESTAMP NOT NULL,
  status TEXT CHECK (status IN ('confirmado', 'pendente', 'cancelado', 'concluido', 'nao_compareceu')) DEFAULT 'pendente',
  observacoes TEXT,
  valor_pago DECIMAL(10, 2),
  forma_pagamento TEXT,
  data_criacao TIMESTAMP DEFAULT NOW(),
  data_atualizacao TIMESTAMP DEFAULT NOW(),
  cancelado_por TEXT,
  motivo_cancelamento TEXT,
  
  -- Constraints
  CONSTRAINT appointments_data_futura CHECK (data_hora > NOW() - INTERVAL '1 day'),
  CONSTRAINT appointments_unique_slot UNIQUE(data_hora)
);

-- Índices para performance
CREATE INDEX idx_appointments_data_hora ON appointments(data_hora);
CREATE INDEX idx_appointments_client_id ON appointments(client_id);
CREATE INDEX idx_appointments_service_id ON appointments(service_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_data_criacao ON appointments(data_criacao DESC);

-- ============================================================================
-- TABELA: availability (Disponibilidade)
-- ============================================================================
CREATE TABLE IF NOT EXISTS availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  disponivel BOOLEAN DEFAULT TRUE,
  motivo_bloqueio TEXT,
  data_criacao TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT availability_unique_slot UNIQUE(data, hora_inicio),
  CONSTRAINT availability_horario_valido CHECK (hora_fim > hora_inicio)
);

-- Índices
CREATE INDEX idx_availability_data ON availability(data);
CREATE INDEX idx_availability_disponivel ON availability(disponivel);

-- ============================================================================
-- TABELA: chat_history (Histórico de Conversas)
-- ============================================================================
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  data_criacao TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_chat_history_session ON chat_history(session_id);
CREATE INDEX idx_chat_history_client ON chat_history(client_id);
CREATE INDEX idx_chat_history_data ON chat_history(data_criacao DESC);

-- ============================================================================
-- TABELA: settings (Configurações)
-- ============================================================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chave TEXT UNIQUE NOT NULL,
  valor TEXT NOT NULL,
  tipo TEXT CHECK (tipo IN ('string', 'number', 'boolean', 'json')),
  descricao TEXT,
  data_atualizacao TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- VIEWS (Visualizações)
-- ============================================================================

-- View: Agendamentos com informações completas
CREATE OR REPLACE VIEW vw_appointments_complete AS
SELECT 
  a.id,
  a.data_hora,
  a.status,
  a.observacoes,
  a.valor_pago,
  a.forma_pagamento,
  a.data_criacao,
  c.id AS client_id,
  c.nome AS client_nome,
  c.telefone AS client_telefone,
  c.email AS client_email,
  s.id AS service_id,
  s.nome AS service_nome,
  s.descricao AS service_descricao,
  s.preco AS service_preco,
  s.duracao_minutos AS service_duracao
FROM appointments a
JOIN clients c ON a.client_id = c.id
JOIN services s ON a.service_id = s.id;

-- View: Estatísticas do dia
CREATE OR REPLACE VIEW vw_stats_today AS
SELECT 
  COUNT(*) AS total_agendamentos,
  COUNT(*) FILTER (WHERE status = 'confirmado') AS confirmados,
  COUNT(*) FILTER (WHERE status = 'pendente') AS pendentes,
  COUNT(*) FILTER (WHERE status = 'cancelado') AS cancelados,
  COUNT(*) FILTER (WHERE status = 'concluido') AS concluidos,
  SUM(CASE WHEN status IN ('confirmado', 'concluido') THEN valor_pago ELSE 0 END) AS faturamento_confirmado,
  SUM(CASE WHEN status = 'concluido' THEN valor_pago ELSE 0 END) AS faturamento_realizado
FROM appointments
WHERE DATE(data_hora) = CURRENT_DATE;

-- ============================================================================
-- FUNCTIONS (Funções)
-- ============================================================================

-- Função: Atualizar timestamp de atualização
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.data_atualizacao = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para appointments
CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Função: Atualizar estatísticas do cliente
CREATE OR REPLACE FUNCTION update_client_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE clients
  SET 
    ultimo_agendamento = NEW.data_hora,
    total_agendamentos = (
      SELECT COUNT(*) 
      FROM appointments 
      WHERE client_id = NEW.client_id 
        AND status IN ('confirmado', 'concluido')
    )
  WHERE id = NEW.client_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar stats do cliente
CREATE TRIGGER update_client_stats_trigger
AFTER INSERT OR UPDATE ON appointments
FOR EACH ROW
WHEN (NEW.status IN ('confirmado', 'concluido'))
EXECUTE FUNCTION update_client_stats();

-- ============================================================================
-- SEED DATA (Dados Iniciais)
-- ============================================================================

-- Inserir serviços padrão
INSERT INTO services (nome, descricao, preco, duracao_minutos, destaque, ordem) VALUES
  ('Combo Viitinh Completo', 'Corte + Barba + Sobrancelha - O mais pedido', 80.00, 90, true, 1),
  ('Corte Premium', 'Degradê, Americano, Social ou personalizado', 45.00, 45, false, 2),
  ('Barba Alinhada', 'Alinhamento e Terapia completa', 40.00, 30, false, 3),
  ('Sobrancelha', 'Design e alinhamento profissional', 20.00, 15, false, 4)
ON CONFLICT DO NOTHING;

-- Inserir configurações padrão
INSERT INTO settings (chave, valor, tipo, descricao) VALUES
  ('horario_abertura', '09:00', 'string', 'Horário de abertura'),
  ('horario_fechamento', '20:00', 'string', 'Horário de fechamento'),
  ('dias_funcionamento', '["2","3","4","5","6"]', 'json', 'Dias da semana (0=Dom, 6=Sáb)'),
  ('intervalo_agendamento', '30', 'number', 'Intervalo entre agendamentos (minutos)'),
  ('antecedencia_minima', '2', 'number', 'Antecedência mínima para agendamento (horas)'),
  ('cancelamento_antecedencia', '2', 'number', 'Antecedência mínima para cancelamento (horas)'),
  ('whatsapp_notificacoes', 'true', 'boolean', 'Enviar notificações WhatsApp'),
  ('email_notificacoes', 'true', 'boolean', 'Enviar notificações Email')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- POLÍTICAS RLS (Row Level Security) - Para Supabase
-- ============================================================================

-- Habilitar RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Políticas para clients (apenas leitura pública)
CREATE POLICY "Clients são visíveis publicamente"
  ON clients FOR SELECT
  TO anon
  USING (true);

-- Políticas para services (leitura pública de serviços ativos)
CREATE POLICY "Services ativos são visíveis publicamente"
  ON services FOR SELECT
  TO anon
  USING (ativo = true);

-- Políticas para appointments (clientes podem ver seus próprios)
CREATE POLICY "Clientes podem ver seus próprios agendamentos"
  ON appointments FOR SELECT
  TO anon
  USING (true); -- Ajustar com autenticação real

-- Políticas para availability (leitura pública)
CREATE POLICY "Availability é visível publicamente"
  ON availability FOR SELECT
  TO anon
  USING (true);

-- ============================================================================
-- COMENTÁRIOS
-- ============================================================================

COMMENT ON TABLE clients IS 'Cadastro de clientes da barbearia';
COMMENT ON TABLE services IS 'Serviços oferecidos (corte, barba, etc)';
COMMENT ON TABLE appointments IS 'Agendamentos realizados';
COMMENT ON TABLE availability IS 'Horários disponíveis/bloqueados';
COMMENT ON TABLE chat_history IS 'Histórico de conversas com o bot';
COMMENT ON TABLE settings IS 'Configurações do sistema';

-- ============================================================================
-- FIM DO SCHEMA
-- ============================================================================
