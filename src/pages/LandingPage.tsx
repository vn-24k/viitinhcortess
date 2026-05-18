// ============================================================================
// LANDING PAGE - viitinhcortes
// Página inicial premium
// ============================================================================

import { Scissors, Sparkles, Clock, Shield, MessageCircle, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function LandingPage() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Top Bar */}
      <div className="absolute top-0 right-0 p-6 z-20">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">Olá, {user.email}</span>
            <button
              onClick={signOut}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-white text-sm transition-colors"
            >
              Sair
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-white text-sm transition-colors flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Entrar
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 rounded-lg text-black text-sm font-semibold transition-all flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Criar Conta
            </Link>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl mb-8 shadow-2xl shadow-amber-500/20 animate-scale-in">
            <Scissors className="w-10 h-10 text-black" />
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-amber-100 to-amber-300 bg-clip-text text-transparent animate-fade-in-up">
            viitinhcortes
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            A <span className="text-amber-400 font-semibold">experiência mais premium</span> em agendamento de cortes
          </p>

          <p className="text-gray-400 mb-12 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Agente de IA conversacional que transforma seu agendamento em uma experiência rápida, inteligente e sem fricção.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link
              to="/chat"
              className="group px-8 py-4 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 rounded-xl font-semibold text-black transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/30 flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Agendar Agora
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </Link>

            <Link
              to="/dashboard"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-amber-500/50 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105 flex items-center gap-2"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard Admin
            </Link>
          </div>

          {/* Trust Badge */}
          <div className="mt-16 inline-flex items-center gap-2 px-6 py-3 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm font-medium">
            <Shield className="w-4 h-4" />
            <span>Agendamento seguro e confirmado instantaneamente</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Por que escolher viitinhcortes?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Tecnologia de ponta combinada com atendimento de alto nível
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-amber-500/30 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Agente de IA Inteligente</h3>
              <p className="text-gray-400 leading-relaxed">
                Conversa natural e direcionada para garantir o melhor agendamento sem perder tempo.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-amber-500/30 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Agendamento Rápido</h3>
              <p className="text-gray-400 leading-relaxed">
                Em menos de 2 minutos você garante seu horário na régua com confirmação instantânea.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-amber-500/30 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Compromisso Garantido</h3>
              <p className="text-gray-400 leading-relaxed">
                Sistema anti-abandono que valoriza seu tempo e garante ocupação máxima da agenda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Nossos Serviços
            </h2>
            <p className="text-gray-400">Pacotes pensados para deixar você sempre na régua</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-2 border-amber-500/50 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded-lg">
                ⭐ POPULAR
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Combo Completo</h3>
              <p className="text-gray-300 text-sm mb-4">Corte + Barba + Sobrancelha</p>
              <div className="text-3xl font-bold text-amber-400 mb-2">R$ 80</div>
              <p className="text-xs text-gray-400">90 minutos</p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-2">Corte Premium</h3>
              <p className="text-gray-300 text-sm mb-4">Degradê, Americano, Social</p>
              <div className="text-3xl font-bold text-amber-400 mb-2">R$ 45</div>
              <p className="text-xs text-gray-400">45 minutos</p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-2">Barba Alinhada</h3>
              <p className="text-gray-300 text-sm mb-4">Alinhamento e Terapia</p>
              <div className="text-3xl font-bold text-amber-400 mb-2">R$ 40</div>
              <p className="text-xs text-gray-400">30 minutos</p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-2">Sobrancelha</h3>
              <p className="text-gray-300 text-sm mb-4">Design e alinhamento</p>
              <div className="text-3xl font-bold text-amber-400 mb-2">R$ 20</div>
              <p className="text-xs text-gray-400">15 minutos</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Pronto para ficar na régua?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Agende agora e transforme seu visual com a melhor experiência do mercado
          </p>
          <Link
            to="/chat"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 rounded-xl font-bold text-black text-lg transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/30"
          >
            <MessageCircle className="w-6 h-6" />
            Começar Agendamento
            <Sparkles className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2024 viitinhcortes. Todos os direitos reservados.</p>
          <p className="mt-2">Desenvolvido com 🔥 e tecnologia de ponta</p>
        </div>
      </footer>
    </div>
  );
}
