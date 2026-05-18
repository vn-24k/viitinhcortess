## 🚀 Setup Completo do Supabase - viitinhcortes v2.0

Este guia mostra como configurar o Supabase completamente para o viitinhcortes.

---

## 📋 Pré-requisitos

1. Conta no [Supabase](https://supabase.com)
2. Conta no [Google Cloud Console](https://console.cloud.google.com) (para OAuth)
3. Conta no [Mercado Pago](https://mercadopago.com.br) (para pagamentos)

---

## 🗄️ PASSO 1: Criar Projeto no Supabase

### 1.1 Criar Novo Projeto

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Preencha:
   - **Nome:** viitinhcortes
   - **Senha do Banco:** Crie uma senha forte
   - **Região:** São Paulo (sa-east-1)
4. Clique em "Create new project"
5. Aguarde 2-3 minutos até o projeto estar pronto

### 1.2 Copiar Credenciais

1. No dashboard, vá em **Settings** → **API**
2. Copie:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **Anon/Public Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 1.3 Configurar Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_MERCADOPAGO_TOKEN=APP_USR-xxxxx (opcional por enquanto)
```

---

## 🏗️ PASSO 2: Executar Schema SQL

### 2.1 Acessar SQL Editor

1. No Supabase, vá em **SQL Editor**
2. Clique em "New query"

### 2.2 Executar Script Completo

Copie e execute este SQL:

\`\`\`sql
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

DROP POLICY IF EXISTS "Profiles são visíveis por usuários autenticados" ON profiles;
CREATE POLICY "Profiles são visíveis por usuários autenticados"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON profiles;
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

DROP POLICY IF EXISTS "Serviços são públicos" ON services;
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
CREATE INDEX IF NOT EXISTS idx_appointments_client ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- RLS Appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clientes veem seus próprios agendamentos" ON appointments;
CREATE POLICY "Clientes veem seus próprios agendamentos"
  ON appointments FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "Admins veem todos agendamentos" ON appointments;
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

DROP POLICY IF EXISTS "Clientes podem criar agendamentos" ON appointments;
CREATE POLICY "Clientes podem criar agendamentos"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = client_id);

DROP POLICY IF EXISTS "Admins podem atualizar agendamentos" ON appointments;
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

DROP POLICY IF EXISTS "Clientes veem seus próprios pagamentos" ON payments;
CREATE POLICY "Clientes veem seus próprios pagamentos"
  ON payments FOR SELECT
  TO authenticated
  USING (
    appointment_id IN (
      SELECT id FROM appointments WHERE client_id = auth.uid()
    )
  );

-- ============================================================================
-- TRIGGER: Criar perfil automaticamente
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- FUNÇÃO: Criar primeiro admin
-- ============================================================================
CREATE OR REPLACE FUNCTION create_admin_user(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET role = 'admin'
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute para tornar seu usuário admin:
-- SELECT create_admin_user('seu@email.com');
\`\`\`

### 2.3 Criar Primeiro Admin

Após criar sua conta, execute:

\`\`\`sql
SELECT create_admin_user('seu@email.com');
\`\`\`

---

## 🔐 PASSO 3: Configurar Google OAuth

### 3.1 Google Cloud Console

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Crie novo projeto ou selecione existente
3. Vá em **APIs & Services** → **Credentials**
4. Clique em **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure:
   - **Application type:** Web application
   - **Name:** viitinhcortes
   - **Authorized redirect URIs:**
     - `https://xxxxx.supabase.co/auth/v1/callback`
     - `http://localhost:5173/auth/callback` (para dev)

6. Copie:
   - **Client ID:** `xxxxx.apps.googleusercontent.com`
   - **Client Secret:** `GOCSPX-xxxxx`

### 3.2 Configurar no Supabase

1. No Supabase, vá em **Authentication** → **Providers**
2. Encontre **Google** e clique em "Enable"
3. Cole:
   - **Client ID**
   - **Client Secret**
4. Salve

---

## 💰 PASSO 4: Configurar Mercado Pago (Opcional)

### 4.1 Criar Conta

1. Acesse [mercadopago.com.br](https://www.mercadopago.com.br)
2. Crie conta ou faça login
3. Vá em **Seu Negócio** → **Configurações** → **Credenciais**

### 4.2 Obter Access Token

1. Copie o **Access Token de Produção**
2. Adicione ao `.env`:

\`\`\`env
VITE_MERCADOPAGO_TOKEN=APP_USR-xxxxxxxxxxxxx
\`\`\`

---

## ✅ PASSO 5: Testar Configuração

### 5.1 Testar Autenticação

\`\`\`bash
# Rodar projeto
npm run dev

# Acessar
http://localhost:5173

# Testar:
1. Criar conta (signup)
2. Fazer login
3. Login com Google
\`\`\`

### 5.2 Verificar no Supabase

1. Vá em **Authentication** → **Users**
2. Deve ver seu usuário
3. Vá em **Table Editor** → **profiles**
4. Deve ver seu perfil

### 5.3 Tornar-se Admin

\`\`\`sql
-- No SQL Editor
SELECT create_admin_user('seu@email.com');
\`\`\`

Agora você pode acessar `/dashboard`!

---

## 🔧 Solução de Problemas

### Erro: "Invalid API key"

**Causa:** Variáveis de ambiente não configuradas

**Solução:**
\`\`\`bash
# Verificar .env
cat .env

# Reiniciar servidor
npm run dev
\`\`\`

### Erro: "Email not confirmed"

**Causa:** Email não verificado

**Solução:**
1. Verifique seu email
2. Ou desabilite verificação (dev apenas):
   - Supabase → **Authentication** → **Providers** → **Email**
   - Desmarque "Confirm email"

### Google OAuth não funciona

**Causa:** Redirect URI incorreto

**Solução:**
1. Copie exato do Supabase: **Settings** → **API** → **URL**
2. Cole no Google Cloud Console com `/auth/v1/callback`

---

## 📊 Queries Úteis

\`\`\`sql
-- Ver todos usuários
SELECT * FROM profiles;

-- Ver agendamentos de hoje
SELECT * FROM appointments
WHERE DATE(date_time) = CURRENT_DATE;

-- Ver faturamento do mês
SELECT SUM(amount) FROM appointments
WHERE EXTRACT(MONTH FROM date_time) = EXTRACT(MONTH FROM CURRENT_DATE)
AND payment_status = 'paid';

-- Tornar usuário admin
UPDATE profiles SET role = 'admin' WHERE email = 'email@exemplo.com';
\`\`\`

---

## 🎉 Pronto!

Seu Supabase está configurado! Agora você pode:

✅ Fazer login/signup  
✅ Criar agendamentos  
✅ Processar pagamentos  
✅ Acessar dashboard (como admin)  

**Próximo passo:** Configure o Mercado Pago para pagamentos PIX reais!

---

**viitinhcortes v2.0** - Powered by Supabase 🚀
