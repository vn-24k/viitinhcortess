# ✅ Checklist de Deploy - viitinhcortes

Use este checklist para garantir um deploy suave e sem problemas.

---

## 📋 Pré-Deploy

### **1. Código e Build**
- [ ] Todos os testes passando (`npm test`)
- [ ] Build de produção sem erros (`npm run build`)
- [ ] Linting sem problemas (`npm run lint`)
- [ ] Não há console.logs ou debuggers esquecidos
- [ ] Versão atualizada no package.json

### **2. Variáveis de Ambiente**
- [ ] Arquivo `.env.production` criado
- [ ] Todas as chaves de API configuradas
- [ ] Variáveis sensíveis NUNCA commitadas
- [ ] `.env.example` atualizado com todas as variáveis necessárias

### **3. Segurança**
- [ ] HTTPS configurado
- [ ] CORS configurado corretamente
- [ ] Rate limiting implementado
- [ ] Validação de input em todos os formulários
- [ ] SQL injection prevention verificado
- [ ] XSS protection ativado

---

## 🗄️ Banco de Dados

### **4. Supabase Setup**
- [ ] Projeto criado no Supabase
- [ ] Schema SQL executado (`database_schema.sql`)
- [ ] Seed data inserido (serviços padrão)
- [ ] RLS (Row Level Security) configurado
- [ ] Políticas de acesso testadas
- [ ] Backup automático ativado

### **5. Migrations**
- [ ] Sistema de migrations configurado
- [ ] Histórico de migrations documentado
- [ ] Rollback plan definido

---

## 🔌 Integrações

### **6. OpenAI / IA**
- [ ] API key configurada
- [ ] Rate limits verificados
- [ ] Fallback para mock implementado
- [ ] Error handling robusto
- [ ] Logs de uso configurados

### **7. Notificações**
- [ ] WhatsApp/Twilio configurado (se aplicável)
- [ ] Templates de mensagem criados
- [ ] Email service configurado (se aplicável)
- [ ] Push notifications setup (se aplicável)

### **8. Analytics**
- [ ] Google Analytics instalado
- [ ] Eventos customizados configurados
- [ ] Goals definidos
- [ ] Privacy policy atualizada

---

## 🚀 Deploy

### **9. Hosting (Vercel/Netlify)**
- [ ] Conta criada
- [ ] Repositório conectado
- [ ] Variáveis de ambiente configuradas
- [ ] Build settings corretos
- [ ] Domínio customizado configurado (se aplicável)
- [ ] SSL certificate ativo

### **10. DNS**
- [ ] Registros DNS configurados
- [ ] Propagação verificada (48h)
- [ ] Redirecionamentos configurados (www → não-www)

### **11. Performance**
- [ ] Lighthouse score > 90
- [ ] Imagens otimizadas
- [ ] Lazy loading implementado
- [ ] Bundle size otimizado (<300KB)
- [ ] CDN configurado (se aplicável)

---

## 🔍 Pós-Deploy

### **12. Testes de Produção**
- [ ] Navegação entre páginas funcionando
- [ ] Formulários enviando corretamente
- [ ] Agendamento end-to-end testado
- [ ] Dashboard carregando dados
- [ ] Chat respondendo adequadamente
- [ ] Responsividade em mobile testada

### **13. Testes de Dispositivos**
- [ ] Chrome Desktop
- [ ] Firefox Desktop
- [ ] Safari Desktop
- [ ] Chrome Mobile (Android)
- [ ] Safari Mobile (iOS)
- [ ] Tablet

### **14. Monitoramento**
- [ ] Error tracking configurado (Sentry)
- [ ] Uptime monitoring ativo (UptimeRobot)
- [ ] Performance monitoring (Vercel Analytics)
- [ ] Database monitoring ativo

### **15. Backup e Recovery**
- [ ] Backup automático do banco configurado
- [ ] Processo de restore testado
- [ ] Disaster recovery plan documentado

---

## 📱 Marketing e Comunicação

### **16. Landing Page**
- [ ] SEO meta tags configurados
- [ ] Open Graph tags para redes sociais
- [ ] Favicon configurado
- [ ] robots.txt criado
- [ ] sitemap.xml gerado

### **17. Legal**
- [ ] Termos de Uso escritos
- [ ] Política de Privacidade (LGPD)
- [ ] Cookie consent banner (se aplicável)
- [ ] Links no footer

### **18. Suporte**
- [ ] Email de contato configurado
- [ ] FAQ criado
- [ ] Canal de suporte definido (WhatsApp/Email)

---

## 📊 Métricas e KPIs

### **19. Dashboard de Métricas**
- [ ] Taxa de conversão sendo trackeada
- [ ] Tempo médio de agendamento medido
- [ ] Taxa de abandono monitorada
- [ ] Upsell tracking ativo

### **20. A/B Testing**
- [ ] Variantes de copy definidas
- [ ] Ferramentas de teste configuradas
- [ ] Métricas de sucesso definidas

---

## 🎉 Go Live!

### **Checklist Final**

#### **Dia -1 (Véspera)**
- [ ] Comunicar equipe sobre horário do deploy
- [ ] Preparar rollback plan
- [ ] Verificar todos os itens acima
- [ ] Dormir bem 😴

#### **Dia 0 (Deploy)**
- [ ] Deploy em horário de baixo tráfego
- [ ] Monitorar logs em tempo real
- [ ] Verificar métricas de performance
- [ ] Executar smoke tests
- [ ] Comunicar stakeholders do sucesso

#### **Dia +1 (Pós-Deploy)**
- [ ] Revisar logs de erro
- [ ] Verificar uptime
- [ ] Coletar feedback inicial
- [ ] Ajustar conforme necessário

---

## 🐛 Troubleshooting Common Issues

### **Build Failed**
```bash
# Limpar cache e rebuildar
rm -rf node_modules dist .next
npm install
npm run build
```

### **ENV Variables não carregando**
```bash
# Verificar formato correto (Vite requer VITE_ prefix)
VITE_API_KEY=xxx  # ✅ Correto
API_KEY=xxx       # ❌ Errado para Vite
```

### **Database Connection Failed**
```bash
# Verificar
1. URL do Supabase correto
2. Anon key correto
3. RLS policies permitindo acesso
4. Tabelas criadas
```

### **Chat não respondendo**
```bash
# Verificar
1. AI service funcionando
2. Estado do chat inicializando corretamente
3. Console do navegador para erros
4. Network tab para requisições falhando
```

---

## 📞 Contatos de Emergência

| Serviço | Suporte | Contato |
|---------|---------|---------|
| Vercel | Support | https://vercel.com/support |
| Supabase | Support | https://supabase.com/support |
| OpenAI | Status | https://status.openai.com |

---

## 🎯 Critérios de Sucesso

Deploy é considerado bem-sucedido quando:

✅ Uptime > 99.9% nas primeiras 24h  
✅ Nenhum erro crítico reportado  
✅ Tempo de carregamento < 3s  
✅ Lighthouse score > 90  
✅ Pelo menos 1 agendamento completo testado  

---

## 🚨 Plano de Rollback

Se algo der errado:

1. **Vercel/Netlify**: Reverter para deploy anterior (1 clique)
2. **Database**: Restore do último backup
3. **Comunicar**: Informar usuários do downtime
4. **Debug**: Investigar logs em ambiente de staging
5. **Fix**: Corrigir problema
6. **Re-deploy**: Tentar novamente

---

**Bom deploy! 🚀**

---

## 📝 Registro de Deploys

| Data | Versão | Deploy por | Status | Notas |
|------|--------|------------|--------|-------|
| 2024-01-20 | 1.0.0 | Dev Team | ✅ Success | MVP inicial |
| | | | | |
| | | | | |

---

**viitinhcortes** - Ready for Production! 💈✨
