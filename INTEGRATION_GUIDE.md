# 🔌 Guia de Integração - viitinhcortes

Este guia explica como integrar o viitinhcortes com serviços reais de banco de dados e IA.

---

## 📊 **Integração com Supabase**

### **1. Criar Projeto no Supabase**

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Copie a URL e a Anon Key do projeto

### **2. Configurar Variáveis de Ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **3. Criar Tabelas no Supabase**

Execute o seguinte SQL no SQL Editor do Supabase:

```sql
-- TABELA DE CLIENTES
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  telefone TEXT UNIQUE NOT NULL,
  data_criacao TIMESTAMP DEFAULT NOW()
);

-- TABELA DE SERVIÇOS
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  duracao_minutos INTEGER NOT NULL,
  destaque BOOLEAN DEFAULT FALSE
);

-- TABELA DE AGENDAMENTOS
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  data_hora TIMESTAMP NOT NULL,
  status TEXT CHECK (status IN ('confirmado', 'pendente', 'cancelado')) DEFAULT 'pendente',
  data_criacao TIMESTAMP DEFAULT NOW()
);

-- ÍNDICES PARA PERFORMANCE
CREATE INDEX idx_appointments_data_hora ON appointments(data_hora);
CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_appointments_status ON appointments(status);

-- INSERIR SERVIÇOS PADRÃO
INSERT INTO services (nome, descricao, preco, duracao_minutos, destaque) VALUES
  ('Combo Viitinh Completo', 'Corte + Barba + Sobrancelha', 80.00, 90, true),
  ('Corte Premium', 'Degradê, Americano, Social ou personalizado', 45.00, 45, false),
  ('Barba Alinhada', 'Alinhamento e Terapia completa', 40.00, 30, false),
  ('Sobrancelha', 'Design e alinhamento', 20.00, 15, false);
```

### **4. Atualizar Código para usar Supabase Real**

Edite `src/services/database.ts` e substitua as funções mock por queries reais:

```typescript
import { supabase } from '../lib/supabase';

// Exemplo: getServices
export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('preco', { ascending: false });
  
  if (error) throw error;
  return data as Service[];
}

// Exemplo: createAppointment
export async function createAppointment(
  clientId: string,
  serviceId: string,
  dataHora: string,
): Promise<Appointment> {
  const { data, error } = await supabase
    .from('appointments')
    .insert({
      client_id: clientId,
      service_id: serviceId,
      data_hora: dataHora,
      status: 'confirmado',
    })
    .select(`
      *,
      clients:client_id(nome),
      services:service_id(nome, preco)
    `)
    .single();
  
  if (error) throw error;
  return data as Appointment;
}
```

---

## 🤖 **Integração com OpenAI**

### **1. Obter API Key**

1. Acesse [platform.openai.com](https://platform.openai.com)
2. Crie uma API key
3. Adicione ao `.env`:

```env
VITE_OPENAI_API_KEY=sk-proj-...
```

### **2. Atualizar o Serviço de IA**

Edite `src/services/ai.ts`:

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Para desenvolvimento apenas
});

export async function sendMessageToAI(
  messages: Message[],
  chatState: ChatState
): Promise<{ message: string; actions?: MessageAction[] }> {
  
  const chatHistory = messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: msg.content,
  }));

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...chatHistory,
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  const content = response.choices[0].message.content || '';
  
  // Parse response e gera actions dinamicamente
  return parseAIResponse(content, chatState);
}
```

### **3. Implementação Segura (Recomendado)**

Para produção, **nunca** exponha a API key no frontend. Crie um backend:

```typescript
// Backend (Node.js/Express)
app.post('/api/chat', async (req, res) => {
  const { messages, chatState } = req.body;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ],
  });
  
  res.json({ message: response.choices[0].message.content });
});
```

---

## 📱 **Integração com WhatsApp (Twilio)**

### **1. Configurar Twilio**

```typescript
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendWhatsAppConfirmation(
  telefone: string,
  appointment: Appointment
) {
  await client.messages.create({
    from: 'whatsapp:+14155238886',
    to: `whatsapp:+55${telefone}`,
    body: `
🔥 viitinhcortes - Agendamento Confirmado!

📅 ${format(new Date(appointment.data_hora), 'dd/MM/yyyy')}
⏰ ${format(new Date(appointment.data_hora), 'HH:mm')}
💈 ${appointment.service_nome}

Te aguardamos! 💈✨
    `.trim(),
  });
}
```

---

## 🔔 **Sistema de Notificações**

### **1. Notificações Push (Firebase)**

```typescript
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  // ...
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  
  if (permission === 'granted') {
    const token = await getToken(messaging);
    // Salvar token no banco de dados
  }
}
```

---

## 💳 **Integração com Pagamento (Stripe)**

### **1. Configurar Stripe**

```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createPaymentIntent(
  amount: number,
  appointmentId: string
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Centavos
    currency: 'brl',
    metadata: { appointmentId },
  });

  return paymentIntent.client_secret;
}
```

---

## 🔐 **Autenticação (Supabase Auth)**

### **1. Setup**

```typescript
import { supabase } from '../lib/supabase';

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
}

export async function signOut() {
  await supabase.auth.signOut();
}
```

---

## 📊 **Analytics (Google Analytics)**

```typescript
import ReactGA from 'react-ga4';

ReactGA.initialize('G-XXXXXXXXXX');

// Tracking de eventos
export function trackAppointmentCreated(service: string) {
  ReactGA.event({
    category: 'Appointment',
    action: 'Created',
    label: service,
  });
}
```

---

## 🚀 **Deploy**

### **Vercel**

```bash
npm install -g vercel
vercel --prod
```

### **Netlify**

```bash
npm run build
netlify deploy --prod --dir=dist
```

---

## ✅ **Checklist de Produção**

- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados Supabase criado e populado
- [ ] API de IA integrada (backend seguro)
- [ ] Sistema de notificações ativo
- [ ] Analytics configurado
- [ ] SSL/HTTPS habilitado
- [ ] Rate limiting implementado
- [ ] Backup automático do banco
- [ ] Monitoramento de erros (Sentry)
- [ ] Testes E2E executados

---

**viitinhcortes** está pronto para escalar! 🚀
