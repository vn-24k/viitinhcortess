// ============================================================================
// CHAT MESSAGE COMPONENT - viitinhcortes
// ============================================================================

import { Message } from '../types';
import { User, Bot } from 'lucide-react';
import { format } from 'date-fns';
import { useChatStore } from '../store/chatStore';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { updateChatState, sendUserMessage, confirmAppointment } = useChatStore();
  const isUser = message.role === 'user';

  const handleActionClick = async (action: any) => {
    if (action.type === 'service') {
      updateChatState({ servico_selecionado: action.value });
      await sendUserMessage(action.value.nome);
    } else if (action.type === 'time') {
      // Se for data
      if (action.value.includes('-')) {
        updateChatState({ data_selecionada: action.value });
        await sendUserMessage(action.label);
      } else {
        // Se for horário
        updateChatState({ horario_selecionado: action.value });
        await sendUserMessage(action.value);
      }
    } else if (action.type === 'confirm') {
      if (action.value === true) {
        await confirmAppointment();
      } else {
        await sendUserMessage('Não, quero mudar');
      }
    }
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-6`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-gradient-to-br from-amber-400 to-amber-600' 
          : 'bg-gradient-to-br from-gray-700 to-gray-900 border border-amber-500/30'
      }`}>
        {isUser ? (
          <User className="w-5 h-5 text-black" />
        ) : (
          <Bot className="w-5 h-5 text-amber-400" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col gap-2 max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl px-5 py-3 ${
          isUser
            ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-black'
            : 'bg-gray-800/80 backdrop-blur-sm text-gray-100 border border-gray-700/50'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-line">
            {message.content}
          </p>
        </div>

        {/* Action Buttons */}
        {message.actions && message.actions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.actions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleActionClick(action)}
                className="px-4 py-2 bg-gray-800 hover:bg-amber-600 border border-gray-700 hover:border-amber-500 rounded-xl text-sm font-medium text-gray-100 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/20"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-xs text-gray-500 px-1">
          {format(message.timestamp, 'HH:mm')}
        </span>
      </div>
    </div>
  );
}
