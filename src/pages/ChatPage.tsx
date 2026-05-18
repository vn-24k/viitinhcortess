// ============================================================================
// CHAT PAGE - viitinhcortes
// Página principal do chat com o agente de IA
// ============================================================================

import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../store/chatStore';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { Scissors, Sparkles, MessageCircle } from 'lucide-react';

export function ChatPage() {
  const { messages, isLoading, sendUserMessage, updateChatState } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  // Auto-scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartChat = async () => {
    setHasStarted(true);
    await sendUserMessage('Olá');
  };

  const handleSendMessage = async (content: string) => {
    // Se for a segunda mensagem, captura o nome
    if (messages.length === 2) {
      updateChatState({ cliente_nome: content });
    }
    
    await sendUserMessage(content);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
              <Scissors className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">viitinhcortes</h1>
              <p className="text-sm text-gray-400">Agendamento Premium</p>
            </div>
            <div className="ml-auto flex items-center gap-2 text-amber-400 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>AI Assistant</span>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Welcome Screen - Mostra quando não há mensagens */}
          {messages.length === 0 && !hasStarted && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-amber-500/20 animate-pulse">
                <Scissors className="w-12 h-12 text-black" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Bem-vindo ao viitinhcortes! 💈
              </h2>
              
              <p className="text-lg text-gray-300 mb-8 max-w-2xl">
                Vou te ajudar a agendar seu horário de forma rápida e sem complicação. 
                <br />
                <span className="text-amber-400 font-semibold">Pronto para ficar na régua?</span>
              </p>

              <button
                onClick={handleStartChat}
                className="group px-10 py-5 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 rounded-xl font-bold text-black text-lg transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/30 flex items-center gap-3"
              >
                <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                Iniciar Conversa
                <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>

              <div className="mt-8 flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>IA Conversacional</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Menos de 2 minutos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Confirmação instantânea</span>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-amber-500/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
              <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl px-5 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Container */}
      <footer className="bg-black/50 backdrop-blur-xl border-t border-gray-800/50 sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      </footer>
    </div>
  );
}
