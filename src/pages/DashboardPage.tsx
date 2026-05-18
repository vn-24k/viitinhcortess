// ============================================================================
// DASHBOARD PAGE - viitinhcortes
// Painel administrativo para o barbeiro
// ============================================================================

import { useEffect, useState } from 'react';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Clock,
  TrendingUp,
  Scissors,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { 
  getTodayAppointments, 
  getTodayRevenue,
  getAllClients,
  MOCK_SERVICES,
} from '../services/database';
import { Appointment } from '../types';
import { format } from 'date-fns';

export function DashboardPage() {
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [appointments, revenue, clients] = await Promise.all([
      getTodayAppointments(),
      getTodayRevenue(),
      getAllClients(),
    ]);

    setTodayAppointments(appointments);
    setTodayRevenue(revenue);
    setTotalClients(clients.length);
    setLoading(false);
  };

  const confirmedCount = todayAppointments.filter(apt => apt.status === 'confirmado').length;
  const pendingCount = todayAppointments.filter(apt => apt.status === 'pendente').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmado':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'cancelado':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelado':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
              <Scissors className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-sm text-gray-400">Painel Administrativo - viitinhcortes</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Revenue Card */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">Faturamento Hoje</h3>
            <p className="text-3xl font-bold text-white">R$ {todayRevenue.toFixed(2)}</p>
          </div>

          {/* Appointments Card */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">Agendamentos Hoje</h3>
            <p className="text-3xl font-bold text-white">{todayAppointments.length}</p>
            <p className="text-xs text-gray-500 mt-1">{confirmedCount} confirmados</p>
          </div>

          {/* Clients Card */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">Total de Clientes</h3>
            <p className="text-3xl font-bold text-white">{totalClients}</p>
          </div>

          {/* Pending Card */}
          <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">Pendentes</h3>
            <p className="text-3xl font-bold text-white">{pendingCount}</p>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">Agendamentos de Hoje</h2>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="px-6 py-12 text-center text-gray-500">
                Carregando...
              </div>
            ) : todayAppointments.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                Nenhum agendamento para hoje
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Horário</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Serviço</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {todayAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-white">
                            {format(new Date(apt.data_hora), 'HH:mm')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{apt.client_nome}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-300">{apt.service_nome}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-400">
                          R$ {apt.service_preco?.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-xs font-medium ${getStatusColor(apt.status)}`}>
                          {getStatusIcon(apt.status)}
                          <span className="capitalize">{apt.status}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Services Overview */}
        <div className="mt-8 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Serviços Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_SERVICES.map((service) => (
              <div key={service.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-amber-500/30 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-white">{service.nome}</h3>
                    <p className="text-sm text-gray-400">{service.descricao}</p>
                  </div>
                  {service.destaque && (
                    <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-lg border border-amber-500/30">
                      ⭐ Destaque
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                  <span className="text-sm text-gray-400">{service.duracao_minutos} min</span>
                  <span className="text-lg font-bold text-green-400">R$ {service.preco}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
