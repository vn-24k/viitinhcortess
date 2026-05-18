// ============================================================================
// CHAT INPUT COMPONENT - viitinhcortes
// ============================================================================

import { useState, FormEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={disabled}
        placeholder="Digite sua mensagem..."
        className="w-full px-5 py-4 pr-14 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      />
      
      <button
        type="submit"
        disabled={!input.trim() || disabled}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:from-gray-700 disabled:to-gray-800 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
      >
        <Send className="w-5 h-5 text-black" />
      </button>
    </form>
  );
}
