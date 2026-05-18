// ============================================================================
// TYPES - viitinhcortes
// ============================================================================

export interface Client {
  id: string;
  nome: string;
  telefone: string;
  data_criacao: string;
}

export interface Service {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  duracao_minutos: number;
  destaque?: boolean;
}

export type AppointmentStatus = 'confirmado' | 'pendente' | 'cancelado';

export interface Appointment {
  id: string;
  client_id: string;
  client_nome?: string;
  service_id: string;
  service_nome?: string;
  service_preco?: number;
  data_hora: string;
  status: AppointmentStatus;
  data_criacao: string;
}

export interface Availability {
  id: string;
  data: string;
  hora_inicio: string;
  ocupado: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: MessageAction[];
}

export interface MessageAction {
  type: 'service' | 'time' | 'confirm';
  label: string;
  value: any;
}

export interface ChatState {
  cliente_nome?: string;
  servico_selecionado?: Service;
  horario_selecionado?: string;
  data_selecionada?: string;
}
