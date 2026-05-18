// ============================================================================
// DATABASE SERVICE - viitinhcortes
// Mock implementation (pode ser substituído por Supabase real)
// ============================================================================

import { Service, Appointment, Client } from '../types';
import { format, addDays } from 'date-fns';

// ============================================================================
// MOCK DATA
// ============================================================================

export const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    nome: 'Combo Viitinh Completo',
    descricao: 'Corte + Barba + Sobrancelha',
    preco: 80,
    duracao_minutos: 90,
    destaque: true,
  },
  {
    id: '2',
    nome: 'Corte Premium',
    descricao: 'Degradê, Americano, Social ou personalizado',
    preco: 45,
    duracao_minutos: 45,
  },
  {
    id: '3',
    nome: 'Barba Alinhada',
    descricao: 'Alinhamento e Terapia completa',
    preco: 40,
    duracao_minutos: 30,
  },
  {
    id: '4',
    nome: 'Sobrancelha',
    descricao: 'Design e alinhamento',
    preco: 20,
    duracao_minutos: 15,
  },
];

// Horários de funcionamento
const HORARIOS_DISPONIVEIS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
];

// Storage local (simulando banco de dados)
let mockClients: Client[] = [];
let mockAppointments: Appointment[] = [];

// ============================================================================
// SERVICES CRUD
// ============================================================================

export async function getServices(): Promise<Service[]> {
  return MOCK_SERVICES;
}

export async function getServiceById(id: string): Promise<Service | null> {
  return MOCK_SERVICES.find(s => s.id === id) || null;
}

// ============================================================================
// AVAILABILITY
// ============================================================================

export async function getAvailableSlots(date: string): Promise<string[]> {
  // Pega todos os agendamentos confirmados para a data
  const appointmentsOnDate = mockAppointments.filter(apt => {
    const aptDate = format(new Date(apt.data_hora), 'yyyy-MM-dd');
    return aptDate === date && apt.status === 'confirmado';
  });

  // Extrai os horários ocupados
  const occupiedSlots = appointmentsOnDate.map(apt => 
    format(new Date(apt.data_hora), 'HH:mm')
  );

  // Retorna apenas horários disponíveis
  return HORARIOS_DISPONIVEIS.filter(slot => !occupiedSlots.includes(slot));
}

export async function getNextAvailableDates(count: number = 7): Promise<string[]> {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 0; i < count; i++) {
    const date = addDays(today, i);
    // Pula domingos (0) e segundas (1)
    if (date.getDay() !== 0 && date.getDay() !== 1) {
      dates.push(format(date, 'yyyy-MM-dd'));
    }
  }
  
  return dates;
}

export async function getSuggestedTimeSlots(date: string, limit: number = 3): Promise<string[]> {
  const available = await getAvailableSlots(date);
  
  // Retorna até 3 sugestões estratégicas
  const suggestions: string[] = [];
  
  // Prioriza manhã (2 slots) e tarde (1 slot)
  const morning = available.filter(s => parseInt(s.split(':')[0]) < 12);
  const afternoon = available.filter(s => parseInt(s.split(':')[0]) >= 14);
  
  if (morning.length > 0) suggestions.push(morning[0]);
  if (morning.length > 1) suggestions.push(morning[Math.floor(morning.length / 2)]);
  if (afternoon.length > 0) suggestions.push(afternoon[Math.floor(afternoon.length / 2)]);
  
  return suggestions.slice(0, limit);
}

// ============================================================================
// CLIENTS CRUD
// ============================================================================

export async function getClientByPhone(telefone: string): Promise<Client | null> {
  return mockClients.find(c => c.telefone === telefone) || null;
}

export async function createClient(nome: string, telefone: string): Promise<Client> {
  const newClient: Client = {
    id: `client_${Date.now()}`,
    nome,
    telefone,
    data_criacao: new Date().toISOString(),
  };
  
  mockClients.push(newClient);
  return newClient;
}

export async function getAllClients(): Promise<Client[]> {
  return mockClients;
}

// ============================================================================
// APPOINTMENTS CRUD
// ============================================================================

export async function createAppointment(
  clientId: string,
  serviceId: string,
  dataHora: string,
): Promise<Appointment> {
  const client = mockClients.find(c => c.id === clientId);
  const service = MOCK_SERVICES.find(s => s.id === serviceId);
  
  const newAppointment: Appointment = {
    id: `apt_${Date.now()}`,
    client_id: clientId,
    client_nome: client?.nome,
    service_id: serviceId,
    service_nome: service?.nome,
    service_preco: service?.preco,
    data_hora: dataHora,
    status: 'confirmado',
    data_criacao: new Date().toISOString(),
  };
  
  mockAppointments.push(newAppointment);
  return newAppointment;
}

export async function getAppointmentsByDate(date: string): Promise<Appointment[]> {
  return mockAppointments
    .filter(apt => {
      const aptDate = format(new Date(apt.data_hora), 'yyyy-MM-dd');
      return aptDate === date;
    })
    .sort((a, b) => new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime());
}

export async function getAllAppointments(): Promise<Appointment[]> {
  return mockAppointments.sort(
    (a, b) => new Date(b.data_hora).getTime() - new Date(a.data_hora).getTime()
  );
}

export async function updateAppointmentStatus(
  id: string,
  status: 'confirmado' | 'pendente' | 'cancelado'
): Promise<void> {
  const appointment = mockAppointments.find(apt => apt.id === id);
  if (appointment) {
    appointment.status = status;
  }
}

export async function getTodayAppointments(): Promise<Appointment[]> {
  const today = format(new Date(), 'yyyy-MM-dd');
  return getAppointmentsByDate(today);
}

export async function getRevenueByDate(date: string): Promise<number> {
  const appointments = await getAppointmentsByDate(date);
  return appointments
    .filter(apt => apt.status === 'confirmado')
    .reduce((sum, apt) => sum + (apt.service_preco || 0), 0);
}

export async function getTodayRevenue(): Promise<number> {
  const today = format(new Date(), 'yyyy-MM-dd');
  return getRevenueByDate(today);
}
