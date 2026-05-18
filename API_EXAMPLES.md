# 🔧 Exemplos de API - viitinhcortes

Este documento contém exemplos práticos de como usar as funções do sistema.

---

## 📊 Database Service

### **1. Buscar Todos os Serviços**

```typescript
import { getServices } from './services/database';

// Buscar serviços
const services = await getServices();

console.log(services);
// [
//   {
//     id: '1',
//     nome: 'Combo Viitinh Completo',
//     descricao: 'Corte + Barba + Sobrancelha',
//     preco: 80,
//     duracao_minutos: 90,
//     destaque: true
//   },
//   ...
// ]
```

### **2. Buscar Horários Disponíveis**

```typescript
import { getAvailableSlots, getSuggestedTimeSlots } from './services/database';

// Todos os horários disponíveis para uma data
const data = '2024-01-21';
const allSlots = await getAvailableSlots(data);

console.log(allSlots);
// ['09:00', '09:30', '10:00', '10:30', ...]

// Apenas 3 sugestões estratégicas
const suggestions = await getSuggestedTimeSlots(data, 3);

console.log(suggestions);
// ['09:00', '10:30', '16:00']
```

### **3. Criar Cliente**

```typescript
import { createClient, getClientByPhone } from './services/database';

// Verificar se cliente já existe
const existing = await getClientByPhone('11999999999');

if (!existing) {
  // Criar novo cliente
  const newClient = await createClient('João Silva', '11999999999');
  
  console.log(newClient);
  // {
  //   id: 'client_1234567890',
  //   nome: 'João Silva',
  //   telefone: '11999999999',
  //   data_criacao: '2024-01-20T10:00:00.000Z'
  // }
}
```

### **4. Criar Agendamento**

```typescript
import { createAppointment } from './services/database';

const appointment = await createAppointment(
  'client_1234567890',  // ID do cliente
  '1',                  // ID do serviço (Combo Completo)
  '2024-01-21T09:00:00' // Data e hora
);

console.log(appointment);
// {
//   id: 'apt_9876543210',
//   client_id: 'client_1234567890',
//   client_nome: 'João Silva',
//   service_id: '1',
//   service_nome: 'Combo Viitinh Completo',
//   service_preco: 80,
//   data_hora: '2024-01-21T09:00:00',
//   status: 'confirmado',
//   data_criacao: '2024-01-20T10:05:00.000Z'
// }
```

### **5. Buscar Agendamentos do Dia**

```typescript
import { getTodayAppointments, getTodayRevenue } from './services/database';

// Lista de agendamentos
const appointments = await getTodayAppointments();

console.log(appointments);
// [
//   {
//     id: 'apt_1',
//     client_nome: 'João Silva',
//     service_nome: 'Combo Viitinh Completo',
//     data_hora: '2024-01-21T09:00:00',
//     status: 'confirmado',
//     ...
//   },
//   ...
// ]

// Faturamento do dia
const revenue = await getTodayRevenue();

console.log(revenue);
// 240 (soma dos valores confirmados)
```

---

## 🤖 AI Service

### **1. Enviar Mensagem para IA**

```typescript
import { sendMessageToAI } from './services/ai';

const messages = [
  {
    id: '1',
    role: 'user',
    content: 'Olá',
    timestamp: new Date(),
  }
];

const chatState = {};

const response = await sendMessageToAI(messages, chatState);

console.log(response);
// {
//   message: 'E aí, mano! 🔥 Bem-vindo à viitinhcortes...',
//   actions: undefined
// }
```

### **2. Fluxo Completo de Agendamento**

```typescript
import { sendMessageToAI, confirmBooking } from './services/ai';

// Estado do chat
let chatState = {};
let messages = [];

// 1. Mensagem inicial
messages.push({
  id: '1',
  role: 'user',
  content: 'Olá',
  timestamp: new Date(),
});

let response = await sendMessageToAI(messages, chatState);
// AI pede nome

// 2. Cliente informa nome
messages.push({
  id: '2',
  role: 'assistant',
  content: response.message,
  timestamp: new Date(),
});

messages.push({
  id: '3',
  role: 'user',
  content: 'João',
  timestamp: new Date(),
});

chatState.cliente_nome = 'João';
response = await sendMessageToAI(messages, chatState);
// AI pede serviço

// 3. Cliente escolhe serviço
chatState.servico_selecionado = {
  id: '1',
  nome: 'Combo Viitinh Completo',
  preco: 80,
  duracao_minutos: 90,
};

messages.push({
  id: '4',
  role: 'user',
  content: 'Combo completo',
  timestamp: new Date(),
});

response = await sendMessageToAI(messages, chatState);
// AI oferece datas

// 4. Cliente escolhe data e horário
chatState.data_selecionada = '2024-01-21';
chatState.horario_selecionado = '09:00';

response = await sendMessageToAI(messages, chatState);
// AI pede confirmação

// 5. Confirmar agendamento
const result = await confirmBooking(chatState, '11999999999');

console.log(result);
// {
//   success: true,
//   appointmentId: 'apt_9876543210'
// }
```

---

## 🎯 Chat Store (Zustand)

### **1. Usar Store no Componente**

```typescript
import { useChatStore } from './store/chatStore';

function MyComponent() {
  const { 
    messages, 
    isLoading, 
    sendUserMessage,
    updateChatState,
    confirmAppointment,
  } = useChatStore();

  // Enviar mensagem
  const handleSend = async () => {
    await sendUserMessage('Quero agendar');
  };

  // Atualizar estado
  const selectService = (service) => {
    updateChatState({ servico_selecionado: service });
  };

  // Confirmar agendamento
  const handleConfirm = async () => {
    const success = await confirmAppointment();
    
    if (success) {
      console.log('Agendamento confirmado!');
    }
  };

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      
      {isLoading && <div>Carregando...</div>}
    </div>
  );
}
```

### **2. Acessar Estado Fora de Componente**

```typescript
import { useChatStore } from './store/chatStore';

// Função utilitária
function getCurrentChatState() {
  return useChatStore.getState().chatState;
}

// Resetar chat
function resetChatSession() {
  useChatStore.getState().resetChat();
}
```

---

## 🔌 Integração com Supabase Real

### **1. Setup do Cliente**

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://seu-projeto.supabase.co',
  'sua-chave-anonima'
);
```

### **2. Buscar Serviços**

```typescript
import { supabase } from '../lib/supabase';

async function getServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('ativo', true)
    .order('ordem', { ascending: true });

  if (error) throw error;
  return data;
}
```

### **3. Criar Agendamento**

```typescript
import { supabase } from '../lib/supabase';

async function createAppointment(clientId, serviceId, dataHora) {
  // 1. Inserir agendamento
  const { data: appointment, error: aptError } = await supabase
    .from('appointments')
    .insert({
      client_id: clientId,
      service_id: serviceId,
      data_hora: dataHora,
      status: 'confirmado',
    })
    .select()
    .single();

  if (aptError) throw aptError;

  // 2. Buscar dados completos com JOIN
  const { data: complete, error: completeError } = await supabase
    .from('vw_appointments_complete')
    .select('*')
    .eq('id', appointment.id)
    .single();

  if (completeError) throw completeError;

  return complete;
}
```

### **4. Buscar Agendamentos em Tempo Real**

```typescript
import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';

function useRealtimeAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Buscar inicial
    loadAppointments();

    // Subscribe a mudanças
    const subscription = supabase
      .channel('appointments_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'appointments',
        },
        (payload) => {
          console.log('Change received!', payload);
          loadAppointments(); // Recarregar
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function loadAppointments() {
    const { data } = await supabase
      .from('vw_appointments_complete')
      .select('*')
      .gte('data_hora', new Date().toISOString())
      .order('data_hora', { ascending: true });

    setAppointments(data || []);
  }

  return appointments;
}
```

---

## 🎨 Componentes React

### **1. Listar Serviços com ServiceCard**

```typescript
import { useEffect, useState } from 'react';
import { getServices } from './services/database';
import { ServiceCard } from './components/ServiceCard';

function ServicesPage() {
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    const data = await getServices();
    setServices(data);
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {services.map(service => (
        <ServiceCard
          key={service.id}
          service={service}
          selected={selected?.id === service.id}
          onClick={setSelected}
        />
      ))}
    </div>
  );
}
```

### **2. Dashboard com StatsCards**

```typescript
import { useEffect, useState } from 'react';
import { getTodayRevenue, getTodayAppointments } from './services/database';
import { StatsCard } from './components/StatsCard';
import { DollarSign, Calendar } from 'lucide-react';

function DashboardStats() {
  const [revenue, setRevenue] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const [rev, apts] = await Promise.all([
      getTodayRevenue(),
      getTodayAppointments(),
    ]);

    setRevenue(rev);
    setCount(apts.length);
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <StatsCard
        title="Faturamento Hoje"
        value={`R$ ${revenue.toFixed(2)}`}
        icon={DollarSign}
        iconColor="text-green-400"
        iconBgColor="bg-green-500/20"
      />

      <StatsCard
        title="Agendamentos"
        value={count}
        icon={Calendar}
        iconColor="text-blue-400"
        iconBgColor="bg-blue-500/20"
      />
    </div>
  );
}
```

---

## 🚀 Deploy e Produção

### **1. Variáveis de Ambiente**

```bash
# .env.production
VITE_SUPABASE_URL=https://prod.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_OPENAI_API_KEY=sk-proj-...
```

### **2. Build para Produção**

```bash
# Build
npm run build

# Preview local
npm run preview

# Deploy Vercel
vercel --prod

# Deploy Netlify
netlify deploy --prod --dir=dist
```

---

**viitinhcortes** - Exemplos prontos para uso! 🚀
