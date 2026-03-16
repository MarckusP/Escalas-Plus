import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Auth
export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

// Igrejas
export const getIgrejas = async () => {
  const response = await api.get('/igrejas');
  return response.data;
};

export const getIgreja = async (id: number) => {
  const response = await api.get(`/igrejas/${id}`);
  return response.data;
};

// Volunteers
export const getVolunteers = async (igrejaId?: number, eventId?: number, allIgrejas?: boolean) => {
  const params = new URLSearchParams();
  if (igrejaId) params.append('igrejaId', igrejaId.toString());
  if (eventId) params.append('eventId', eventId.toString());
  if (allIgrejas) params.append('allIgrejas', 'true');
  const url = params.toString() ? `/volunteers?${params.toString()}` : '/volunteers';
  const response = await api.get(url);
  return response.data;
};

// Events
export const getEvents = async (igrejaId?: number) => {
  const url = igrejaId ? `/events?igrejaId=${igrejaId}` : '/events';
  const response = await api.get(url);
  return response.data;
};

// Schedule
export const getSchedule = async (volunteerId?: number, igrejaId?: number) => {
  const params = new URLSearchParams();
  if (volunteerId) params.append('volunteerId', volunteerId.toString());
  if (igrejaId) params.append('igrejaId', igrejaId.toString());
  const url = params.toString() ? `/schedule?${params.toString()}` : '/schedule';
  const response = await api.get(url);
  return response.data;
};

export const confirmPresence = async (scheduleId: number) => {
  const response = await api.post(`/schedule/${scheduleId}/confirm`);
  return response.data;
};

// Availability
export const getAvailability = async (volunteerId: number) => {
  const response = await api.get(`/availability?volunteerId=${volunteerId}`);
  return response.data;
};

export const updateAvailability = async (volunteerId: number, availability: any) => {
  const response = await api.post('/availability', { volunteerId, ...availability });
  return response.data;
};

// Swap Requests
export const getSwapRequests = async (volunteerId?: number) => {
  const url = volunteerId ? `/swap-request?volunteerId=${volunteerId}` : '/swap-request';
  const response = await api.get(url);
  return response.data;
};

export const createSwapRequest = async (data: {
  scheduleId: number;
  fromVolunteerId: number;
  toVolunteerId: number;
  message?: string;
}) => {
  const response = await api.post('/swap-request', data);
  return response.data;
};

export const acceptSwapRequest = async (swapRequestId: number) => {
  const response = await api.post(`/swap-request/${swapRequestId}/accept`);
  return response.data;
};

export const rejectSwapRequest = async (swapRequestId: number) => {
  const response = await api.post(`/swap-request/${swapRequestId}/reject`);
  return response.data;
};

// Tasks
export const getTasks = async (volunteerId?: number, igrejaId?: number) => {
  const params = new URLSearchParams();
  if (volunteerId) params.append('volunteerId', volunteerId.toString());
  if (igrejaId) params.append('igrejaId', igrejaId.toString());
  const url = params.toString() ? `/tasks?${params.toString()}` : '/tasks';
  const response = await api.get(url);
  return response.data;
};

export const updateTaskStatus = async (taskId: number, status: string) => {
  const response = await api.patch(`/tasks/${taskId}`, { status });
  return response.data;
};

// WhatsApp
export const solicitarValidacaoWhatsApp = async (volunteerId: number, ddd: string, numero: string) => {
  const response = await api.post('/whatsapp/validar/solicitar', { volunteerId, ddd, numero });
  return response.data;
};

export const confirmarValidacaoWhatsApp = async (volunteerId: number, ddd: string, numero: string, codigo: string) => {
  const response = await api.post('/whatsapp/validar/confirmar', { volunteerId, ddd, numero, codigo });
  return response.data;
};

export const getGruposWhatsApp = async (igrejaId?: number) => {
  const url = igrejaId ? `/whatsapp/grupos?igrejaId=${igrejaId}` : '/whatsapp/grupos';
  const response = await api.get(url);
  return response.data;
};

export const criarGrupoWhatsApp = async (data: { nome: string; grupoId: string; igrejaId: number; liderId: number }) => {
  const response = await api.post('/whatsapp/grupos', data);
  return response.data;
};

export const getConfiguracaoNotificacoes = async (igrejaId: number) => {
  const response = await api.get(`/whatsapp/configuracao?igrejaId=${igrejaId}`);
  return response.data;
};

export const salvarConfiguracaoNotificacoes = async (data: {
  igrejaId: number;
  tipoNotificacao: string;
  diasAntes: number;
  horasAntes: number;
  ativo: boolean;
}) => {
  const response = await api.post('/whatsapp/configuracao', data);
  return response.data;
};

export const getQRCodeWhatsApp = async (instanceId: string) => {
  const response = await api.get(`/whatsapp/qrcode?instanceId=${instanceId}`);
  return response.data;
};

export const getStatusWhatsApp = async (instanceId: string) => {
  const response = await api.get(`/whatsapp/status?instanceId=${instanceId}`);
  return response.data;
};

export const enviarEscalaGrupo = async (eventId: number, grupoId: number) => {
  const response = await api.post('/whatsapp/notificar/escala-grupo', { eventId, grupoId });
  return response.data;
};
