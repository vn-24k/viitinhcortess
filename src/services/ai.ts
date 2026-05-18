// ============================================================================
// AI SERVICE - viitinhcortes
// Integração com OpenAI API para o agente conversacional
// ============================================================================

import { Message, MessageAction, ChatState } from '../types';
import { 
  getServices, 
  getNextAvailableDates, 
  getSuggestedTimeSlots,
  createClient,
  createAppointment,
  getClientByPhone,
} from './database';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// ============================================================================
// SYSTEM PROMPT
// Este prompt será usado quando integrar com OpenAI/Anthropic API
// ============================================================================

export const SYSTEM_PROMPT = `# ROLE
Você é o viitinhcortes AI, o agente digital e estratega de atendimento da barbearia viitinhcortes. Seu único objetivo é guiar o cliente pelo fluxo de agendamento de forma rápida, magnética e sem fricção, garantindo a máxima ocupação da agenda e aumentando o ticket médio.

# TOM DE VOZ E PERSONALIDADE
- Estilo: "Cria Refinado" (Urbano, confiante, de alto nível, respeitoso e extremamente profissional).
- Vocabulário: Direto, focado em estética, autoestima e precisão (use termos como "alinhamento", "na régua", "estilo", "presença").
- Regra de Ouro: Nunca seja prolixo. Respostas curtas, impactantes e sempre terminadas com uma pergunta de ação para direcionar o cliente.

# FLUXO OPERACIONAL OBRIGATÓRIO (PASSO A PASSO)

## PASSO 1: Boas-vindas e Identificação
- Receba o cliente com energia e valide a decisão dele de cuidar do visual.
- Descubra o nome do cliente se ainda não souber.
- Pergunta de Fechamento: "Qual é a boa para hoje? Vai renovar o corte ou dar um tapa completo?"

## PASSO 2: Seleção do Serviço & Upsell Estratégico
- Apresente o cardápio de forma direta:
  1. Combo Viitinh Completo (Corte + Barba + Sobrancelha) -> [Destaque como o mais pedido]
  2. Corte (Degradê, Americano, Social, etc.)
  3. Barba (Alinhamento e Terapia)
- Se o cliente escolher apenas o "Corte", aplique o Upsell IMEDIATAMENTE: "Mudar o corte vai te deixar na régua, mas se incluir a barba/sobrancelha o visual fica completo com desconto no combo. Vamos fechar o Combo Completo?"

## PASSO 3: Seleção de Data e Horário
- Não pergunte "quando você quer". Apresente opções escassas para acelerar a decisão.
- Puxe a lista de horários disponíveis no banco de dados e ofereça apenas 3 opções (Ex: duas na parte da manhã, uma no final da tarde).
- Pergunta de Fechamento: "Para garantir sua vaga na régua, qual desses horários encaixa melhor na sua rotina?"

## PASSO 4: Confirmação e Política Anti-Abandono
- Revise os dados de forma cirúrgica: Serviço, Data, Horário.
- Dispare o gatilho de compromisso: "Fechado, [Nome]. Seu horário está bloqueado no sistema. Como nossa agenda é concorrida e trabalhamos com hora marcada, se precisar mudar o horário, me avise com pelo menos 2 horas de antecedência para não tirar a vaga de outro irmão. Posso confirmar?"

# DIRETRIZES DE SEGURANÇA E RESTRIÇÕES
- Se o cliente tentar conversar sobre assuntos aleatórios (futebol, política, fofoca), use o redirecionamento tático: "O papo tá bom, mas o foco aqui é te deixar pronto pro combate. Vamos escolher o melhor horário para o seu corte?"
- Nunca deixe o cliente sem uma instrução clara do que fazer a seguir.
- Caso o horário solicitado esteja ocupado, ofereça imediatamente a alternativa mais próxima.

# FORMATO DE RESPOSTA
Responda SEMPRE em formato JSON com a seguinte estrutura:
{
  "message": "sua mensagem para o cliente",
  "action": "welcome|ask_service|ask_time|confirm|completed",
  "data": {} // dados relevantes como serviços sugeridos, horários, etc
}`;

// ============================================================================
// MOCK AI RESPONSE (Simula OpenAI - pode ser substituído por API real)
// ============================================================================

export async function sendMessageToAI(
  messages: Message[],
  chatState: ChatState
): Promise<{ message: string; actions?: MessageAction[] }> {
  
  const lastUserMessage = messages[messages.length - 1];
  const userText = lastUserMessage.content.toLowerCase();

  // PASSO 1: Boas-vindas e captura de nome
  if (!chatState.cliente_nome) {
    if (messages.length === 1) {
      return {
        message: "E aí, meu mano! 🔥 Bem-vindo à viitinhcortes. Você tá a um clique de elevar o visual ao próximo nível. Qual é o seu nome?",
      };
    } else {
      // Extrai nome da mensagem
      const nome = extractNameFromMessage(userText);
      return {
        message: `Prazer, ${nome}! 💈 Qual é a boa para hoje? Vai renovar o corte ou dar um tapa completo no visual?`,
      };
    }
  }

  // PASSO 2: Seleção de serviço
  if (!chatState.servico_selecionado) {
    const services = await getServices();
    
    // Se usuário mencionou serviço específico
    if (userText.includes('combo') || userText.includes('completo')) {
      return {
        message: `Fechou! O Combo Viitinh Completo é a escolha dos crias que não deixam nada passar. Agora vamos marcar seu horário. Qual desses encaixa na sua agenda?`,
        actions: await generateTimeSlotActions(),
      };
    } else if (userText.includes('corte')) {
      // UPSELL
      return {
        message: `Mudar o corte vai te deixar na régua, mas se incluir a barba/sobrancelha o visual fica completo com desconto no combo. Vamos fechar o Combo Completo ou segue só no corte mesmo?`,
        actions: [
          { type: 'service', label: '🔥 Combo Completo (R$ 80)', value: services.find(s => s.destaque) },
          { type: 'service', label: 'Só o Corte (R$ 45)', value: services.find(s => s.nome.includes('Corte')) },
        ],
      };
    } else {
      // Apresenta opções
      return {
        message: `Veja o cardápio dos crias alinhados:`,
        actions: services.map(s => ({
          type: 'service' as const,
          label: `${s.destaque ? '⭐ ' : ''}${s.nome} - R$ ${s.preco}`,
          value: s,
        })),
      };
    }
  }

  // PASSO 3: Seleção de horário
  if (!chatState.data_selecionada || !chatState.horario_selecionado) {
    if (!chatState.data_selecionada) {
      const dates = await getNextAvailableDates(5);
      return {
        message: `Massa! Para garantir sua vaga na régua, escolhe um desses dias:`,
        actions: dates.map(date => ({
          type: 'time' as const,
          label: formatDateBR(date),
          value: date,
        })),
      };
    } else {
      // Mostra horários disponíveis
      const slots = await getSuggestedTimeSlots(chatState.data_selecionada, 3);
      return {
        message: `Qual desses horários encaixa melhor na sua rotina?`,
        actions: slots.map(slot => ({
          type: 'time' as const,
          label: slot,
          value: slot,
        })),
      };
    }
  }

  // PASSO 4: Confirmação
  return {
    message: `Fechado, ${chatState.cliente_nome}! Seu horário está bloqueado:
    
📅 ${formatDateBR(chatState.data_selecionada!)}
⏰ ${chatState.horario_selecionado}
💈 ${chatState.servico_selecionado!.nome}
💰 R$ ${chatState.servico_selecionado!.preco}

Como nossa agenda é concorrida e trabalhamos com hora marcada, se precisar mudar, me avise com pelo menos 2 horas de antecedência. Confirma?`,
    actions: [
      { type: 'confirm' as const, label: '✅ Confirmar Agendamento', value: true },
      { type: 'confirm' as const, label: '❌ Cancelar', value: false },
    ],
  };
}

// ============================================================================
// BOOKING CONFIRMATION
// ============================================================================

export async function confirmBooking(
  chatState: ChatState,
  telefone: string = '11999999999' // Mock
): Promise<{ success: boolean; appointmentId?: string; error?: string }> {
  
  if (!chatState.cliente_nome || !chatState.servico_selecionado || 
      !chatState.data_selecionada || !chatState.horario_selecionado) {
    return { success: false, error: 'Dados incompletos' };
  }

  try {
    // Cria ou busca cliente
    let client = await getClientByPhone(telefone);
    if (!client) {
      client = await createClient(chatState.cliente_nome, telefone);
    }

    // Cria agendamento
    const dataHora = `${chatState.data_selecionada}T${chatState.horario_selecionado}:00`;
    const appointment = await createAppointment(
      client.id,
      chatState.servico_selecionado.id,
      dataHora
    );

    return { success: true, appointmentId: appointment.id };
  } catch (error) {
    return { success: false, error: 'Erro ao criar agendamento' };
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function extractNameFromMessage(text: string): string {
  // Lógica simples de extração de nome
  const cleaned = text.replace(/[^a-záéíóúàâêôãõçA-ZÁÉÍÓÚÀÂÊÔÃÕÇ\s]/g, '');
  const words = cleaned.split(' ').filter(w => w.length > 0);
  
  if (words.length > 0) {
    return words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
  }
  
  return 'Mano';
}

function formatDateBR(date: string): string {
  const parsed = new Date(date + 'T00:00:00');
  return format(parsed, "EEE, dd 'de' MMM", { locale: ptBR });
}

async function generateTimeSlotActions(): Promise<MessageAction[]> {
  const dates = await getNextAvailableDates(3);
  return dates.map(date => ({
    type: 'time' as const,
    label: formatDateBR(date),
    value: date,
  }));
}
