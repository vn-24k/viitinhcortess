// ============================================================================
// PROTECTED ROUTE - viitinhcortes
// Componente para proteger rotas que requerem autenticação
// ============================================================================

import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Acesso Negado</h2>
            <p className="text-gray-300 mb-6">
              Você não tem permissão para acessar esta página. Apenas administradores podem visualizar o dashboard.
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 rounded-xl font-semibold text-black transition-all duration-200 hover:scale-105"
            >
              Voltar para Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
