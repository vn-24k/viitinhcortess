// ============================================================================
// CHAT STORE - viitinhcortes
// Gerenciamento de estado do chat com Zustand
// ============================================================================

import { create } from 'zustand';
import { Message, ChatState } from '../types';
import { sendMessageToAI, confirmBooking } from '../services/ai';

interface ChatStore {
  messages: Message[];
  chatState: ChatState;
  isLoading: boolean;
  
  // Actions
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  sendUserMessage: (content: string) => Promise<void>;
  updateChatState: (updates: Partial<ChatState>) => void;
  confirmAppointment: () => Promise<boolean>;
  resetChat: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  chatState: {},
  isLoading: false,

  addMessage: (content, role) => {
    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random()}`,
      role,
      content,
      timestamp: new Date(),
    };
    
    set(state => ({
      messages: [...state.messages, newMessage],
    }));
  },

  sendUserMessage: async (content: string) => {
    const { addMessage, chatState } = get();
    
    // Adiciona mensagem do usuário
    addMessage(content, 'user');
    set({ isLoading: true });

    try {
      // Envia para IA
      const allMessages = [...get().messages];
      const response = await sendMessageToAI(allMessages, chatState);

      // Adiciona resposta da IA
      const aiMessage: Message = {
        id: `msg_${Date.now()}_${Math.random()}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        actions: response.actions,
      };

      set(state => ({
        messages: [...state.messages, aiMessage],
        isLoading: false,
      }));

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      set({ isLoading: false });
    }
  },

  updateChatState: (updates) => {
    set(state => ({
      chatState: { ...state.chatState, ...updates },
    }));
  },

  confirmAppointment: async () => {
    const { chatState, addMessage } = get();
    set({ isLoading: true });

    try {
      const result = await confirmBooking(chatState);
      
      if (result.success) {
        addMessage(
          `🎉 AGENDAMENTO CONFIRMADO!

Tá na régua, ${chatState.cliente_nome}! Seu horário está garantido no sistema.

📅 Data: ${chatState.data_selecionada}
⏰ Horário: ${chatState.horario_selecionado}
💈 Serviço: ${chatState.servico_selecionado?.nome}
💰 Valor: R$ ${chatState.servico_selecionado?.preco}

Vem preparado pra sair de cara nova! Te vejo lá. 💈✨`,
          'assistant'
        );
        set({ isLoading: false });
        return true;
      } else {
        addMessage(
          'Ops, tive um problema ao confirmar. Tenta de novo ou chama no WhatsApp.',
          'assistant'
        );
        set({ isLoading: false });
        return false;
      }
    } catch (error) {
      addMessage(
        'Erro ao processar agendamento. Por favor, tente novamente.',
        'assistant'
      );
      set({ isLoading: false });
      return false;
    }
  },

  resetChat: () => {
    set({
      messages: [],
      chatState: {},
      isLoading: false,
    });
  },
}));
