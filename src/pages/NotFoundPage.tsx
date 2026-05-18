// ============================================================================
// 404 PAGE - viitinhcortes
// ============================================================================

import { Link } from 'react-router-dom';
import { Home, MessageCircle, AlertTriangle } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-2xl mb-8 border border-amber-500/30">
          <AlertTriangle className="w-12 h-12 text-amber-400" />
        </div>

        {/* Title */}
        <h1 className="text-9xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
          404
        </h1>

        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Página não encontrada
        </h2>

        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          Parece que você tentou acessar uma página que não existe. 
          Vamos te levar de volta pra régua!
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 rounded-xl font-semibold text-black transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/30"
          >
            <Home className="w-5 h-5" />
            Voltar ao Início
          </Link>

          <Link
            to="/chat"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-amber-500/50 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105"
          >
            <MessageCircle className="w-5 h-5" />
            Fazer Agendamento
          </Link>
        </div>

        {/* Fun Message */}
        <div className="mt-12 p-4 bg-gray-800/50 border border-gray-700 rounded-xl inline-block">
          <p className="text-sm text-gray-400">
            💈 <span className="text-amber-400 font-semibold">Dica:</span> 
            {' '}Enquanto isso, que tal agendar um corte?
          </p>
        </div>
      </div>
    </div>
  );
}
