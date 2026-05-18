# 🚀 Quick Start - viitinhcortes

## Início Rápido em 3 Passos

### 1️⃣ Instalar Dependências
```bash
npm install
```

### 2️⃣ Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```

### 3️⃣ Acessar a Aplicação
Abra o navegador em: **http://localhost:5173**

---

## 📱 Navegação do Aplicativo

### **Página Inicial** (`/`)
- Landing page premium com apresentação dos serviços
- Botão "Agendar Agora" → Leva para o chat
- Botão "Dashboard Admin" → Leva para o painel administrativo

### **Chat de Agendamento** (`/chat`)
- Interface conversacional com IA
- Fluxo guiado de agendamento:
  1. Boas-vindas e captura de nome
  2. Seleção de serviço (com upsell automático)
  3. Escolha de data e horário
  4. Confirmação do agendamento

### **Dashboard Administrativo** (`/dashboard`)
- Visão geral de métricas (faturamento, agendamentos, clientes)
- Lista de agendamentos do dia
- Catálogo de serviços disponíveis

---

## 🎯 Testando o Fluxo Completo

1. **Acesse** `/chat`
2. **Digite** seu nome quando solicitado (ex: "João")
3. **Escolha** um serviço clicando nos botões ou digitando
4. **Selecione** uma data clicando em uma das opções
5. **Escolha** um horário disponível
6. **Confirme** o agendamento

✅ Pronto! Seu agendamento foi criado.

7. **Acesse** `/dashboard` para ver o agendamento confirmado

---

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Linting
npm run lint
```

---

## 🎨 Personalização Rápida

### Alterar Cores Principais
Edite `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#F59E0B',  // Cor primária (amber-500)
      secondary: '#1F2937', // Cor secundária (gray-800)
    }
  }
}
```

### Alterar Serviços
Edite `src/services/database.ts` → `MOCK_SERVICES`:

```typescript
export const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    nome: 'Seu Serviço',
    descricao: 'Descrição do serviço',
    preco: 50,
    duracao_minutos: 60,
    destaque: true,
  },
  // ...
];
```

### Alterar Horários Disponíveis
Edite `src/services/database.ts` → `HORARIOS_DISPONIVEIS`

---

## 🔥 Dicas Pro

### Para Desenvolvimento
- Use **React DevTools** para debugar componentes
- Use **Redux DevTools** para inspecionar o estado (Zustand tem suporte)
- Hot reload está ativado automaticamente

### Para Produção
- Execute `npm run build` antes do deploy
- Teste o build localmente com `npm run preview`
- Configure variáveis de ambiente no seu host

---

## 🐛 Resolução de Problemas

### Porta já em uso
```bash
# Altere a porta no vite.config.ts ou mate o processo:
npx kill-port 5173
```

### Erro de dependências
```bash
# Limpe e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Build falhando
```bash
# Limpe o cache do Vite
rm -rf dist .vite
npm run build
```

---

## 📚 Próximos Passos

1. ✅ **Teste o aplicativo localmente**
2. 📖 Leia o `README.md` para entender a arquitetura completa
3. 🔌 Veja `INTEGRATION_GUIDE.md` para integrar com APIs reais
4. 🚀 Faça deploy na Vercel/Netlify

---

## 💬 Perguntas Frequentes

**P: O chat funciona de verdade?**  
R: Sim! Usa um sistema de IA simulado inteligente. Para usar IA real (OpenAI), veja o guia de integração.

**P: Os dados são salvos?**  
R: Atualmente em memória (reseta ao recarregar). Para persistência real, integre com Supabase.

**P: Posso customizar o design?**  
R: 100%! Todos os componentes usam Tailwind CSS. Personalize à vontade.

**P: Funciona no mobile?**  
R: Sim! Totalmente responsivo.

---

**viitinhcortes** - Pronto para uso! 💈✨
