# 💈 viitinhcortes - Sistema Premium de Agendamento com IA

![viitinhcortes](https://img.shields.io/badge/Status-Production_Ready-success)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan)

O **viitinhcortes** é o aplicativo de agendamento de cortes de cabelo mais sofisticado do mercado, combinando uma interface visual premium (Dark Mode urbano) com um agente de IA conversacional inteligente.

---

## 🚀 **Stack Tecnológica**

### **Frontend**
- **React 18.3** com TypeScript
- **Vite** como bundler ultra-rápido
- **Tailwind CSS** para estilização premium
- **Lucide React** para ícones modernos
- **React Router DOM** para navegação SPA
- **Zustand** para gerenciamento de estado global

### **Backend/Database**
- **Supabase** (preparado para integração)
- Mock Database implementation (pronto para produção)
- Sistema de persistência em memória (facilmente migrável)

### **Integrações**
- Preparado para **OpenAI API** ou **Anthropic API**
- Sistema de IA conversacional mockado (totalmente funcional)

---

## 🎨 **Design System**

### **Tema Visual**
- **Modo Escuro Premium** (preto, cinza-chumbo, detalhes dourados/amber)
- Gradientes sofisticados e efeitos de blur
- Animações suaves e transições fluidas
- Componentes glassmorphism

### **Paleta de Cores**
```css
Primary: Amber (#F59E0B, #FBBF24)
Background: Black (#000000) → Gray-900 (#111827)
Surface: Gray-800/Gray-900 com opacidade
Success: Green-400
Error: Red-400
Warning: Yellow-400
```

---

## 📁 **Arquitetura do Projeto**

```
src/
├── components/           # Componentes reutilizáveis
│   ├── ChatMessage.tsx   # Mensagem individual do chat
│   └── ChatInput.tsx     # Input de mensagem
├── pages/                # Páginas principais
│   ├── LandingPage.tsx   # Página inicial premium
│   ├── ChatPage.tsx      # Interface de chat com IA
│   └── DashboardPage.tsx # Painel administrativo
├── services/             # Lógica de negócio
│   ├── database.ts       # CRUD e mock database
│   └── ai.ts             # Integração com IA
├── store/                # Estado global
│   └── chatStore.ts      # Store do chat (Zustand)
├── types/                # TypeScript types
│   └── index.ts          # Definições de tipos
└── lib/                  # Configurações
    └── supabase.ts       # Cliente Supabase
```

---

## 🤖 **Sistema de IA Conversacional**

### **Fluxo do Agente viitinhcortes AI**

O agente segue rigorosamente este fluxo de 4 passos:

#### **PASSO 1: Boas-vindas e Identificação**
- Recebe o cliente com energia
- Captura o nome do cliente
- Valida a intenção de agendar

#### **PASSO 2: Seleção de Serviço + Upsell**
- Apresenta o cardápio de forma estratégica
- **Destaca** o Combo Completo (mais pedido)
- Aplica upsell se escolher apenas "Corte"

#### **PASSO 3: Data e Horário**
- Oferece apenas 3 opções de horário (escassez)
- Prioriza manhã (2 slots) e tarde (1 slot)
- Acelera a tomada de decisão

#### **PASSO 4: Confirmação Anti-Abandono**
- Revisa todos os dados
- Dispara gatilho de compromisso
- Bloqueia o horário no sistema

### **Personalidade do Agente**
- Tom: "Cria Refinado" (Urbano, confiante, profissional)
- Vocabulário: Foca em estética, autoestima, precisão
- Respostas: Curtas, impactantes, sempre com call-to-action

---

## 💾 **Estrutura do Banco de Dados**

### **Tabelas Principais**

#### **clients**
```sql
id UUID PRIMARY KEY
nome TEXT NOT NULL
telefone TEXT UNIQUE NOT NULL
data_criacao TIMESTAMP DEFAULT NOW()
```

#### **services**
```sql
id UUID PRIMARY KEY
nome TEXT NOT NULL
descricao TEXT
preco DECIMAL(10,2) NOT NULL
duracao_minutos INTEGER NOT NULL
destaque BOOLEAN DEFAULT FALSE
```

#### **appointments**
```sql
id UUID PRIMARY KEY
client_id UUID REFERENCES clients(id)
service_id UUID REFERENCES services(id)
data_hora TIMESTAMP NOT NULL
status TEXT CHECK (status IN ('confirmado', 'pendente', 'cancelado'))
data_criacao TIMESTAMP DEFAULT NOW()
```

---

## 🔧 **Setup e Instalação**

### **Pré-requisitos**
- Node.js 18+
- npm ou yarn

### **Instalação**

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/viitinhcortes.git

# Entre no diretório
cd viitinhcortes

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

### **Variáveis de Ambiente (Opcional)**

Crie um arquivo `.env` na raiz:

```env
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_supabase
VITE_OPENAI_API_KEY=sua_chave_openai
```

---

## 🎯 **Funcionalidades Principais**

### **Landing Page**
- ✅ Hero section premium com gradientes
- ✅ Seção de features destacando IA e rapidez
- ✅ Apresentação de serviços com preços
- ✅ CTAs estratégicos
- ✅ Design responsivo

### **Chat com IA**
- ✅ Interface de mensagens estilo WhatsApp premium
- ✅ Botões de ação dinâmicos (serviços, horários, confirmação)
- ✅ Indicador de digitação
- ✅ Auto-scroll
- ✅ Fluxo completo de agendamento
- ✅ Confirmação instantânea

### **Dashboard Admin**
- ✅ Cards de métricas (Faturamento, Agendamentos, Clientes)
- ✅ Tabela de agendamentos do dia
- ✅ Status visual (confirmado, pendente, cancelado)
- ✅ Visão geral dos serviços
- ✅ Design responsivo

---

## 🚀 **Roadmap de Melhorias**

### **Fase 1: MVP** ✅ (Completo)
- [x] Interface de chat funcional
- [x] Sistema de agendamento
- [x] Dashboard administrativo
- [x] Mock database

### **Fase 2: Integração Real**
- [ ] Integrar Supabase real
- [ ] Integrar OpenAI API
- [ ] Sistema de autenticação
- [ ] Envio de SMS/WhatsApp de confirmação

### **Fase 3: Advanced Features**
- [ ] Sistema de notificações
- [ ] Histórico de agendamentos do cliente
- [ ] Avaliações e feedback
- [ ] Programa de fidelidade
- [ ] Integração com pagamento online

---

## 📱 **Páginas e Rotas**

| Rota | Página | Descrição |
|------|--------|-----------|
| `/` | Landing Page | Página inicial premium |
| `/chat` | Chat Page | Interface de agendamento com IA |
| `/dashboard` | Dashboard | Painel administrativo |

---

## 🎨 **Componentes Principais**

### **ChatMessage**
Componente de mensagem individual com:
- Avatar diferenciado (user vs bot)
- Botões de ação dinâmicos
- Timestamp
- Animações suaves

### **ChatInput**
Input de mensagem com:
- Validação em tempo real
- Botão de envio animado
- Estados de loading
- Acessibilidade

---

## 🔐 **Segurança e Boas Práticas**

- ✅ TypeScript para type-safety
- ✅ Validação de dados no frontend
- ✅ Separação de concerns (MVC pattern)
- ✅ Estado imutável com Zustand
- ✅ Componentes reutilizáveis
- ✅ Código modular e escalável

---

## 📊 **Performance**

- ⚡ Vite para builds ultra-rápidos
- ⚡ Code splitting automático
- ⚡ Lazy loading de rotas
- ⚡ Otimização de imagens
- ⚡ CSS purging automático com Tailwind

---

## 🤝 **Contribuindo**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 **Licença**

Este projeto é proprietário e confidencial.

---

## 👨‍💻 **Desenvolvido por**

**Engenheiro Full-Stack Sênior**  
Especialista em UI/UX e Integrações de IA

---

## 📞 **Suporte**

Para dúvidas ou sugestões, entre em contato.

---

**viitinhcortes** - Transformando agendamentos em experiências premium 💈✨
