'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/GlassCard';
import { RefreshCw, CheckCircle, X, User } from 'lucide-react';
import { getSwapRequests, createSwapRequest, acceptSwapRequest, rejectSwapRequest, getSchedule, getVolunteers } from '@/lib/api';
import { useIgreja } from '@/contexts/IgrejaContext';
import toast from 'react-hot-toast';

interface SwapRequest {
  id: number;
  schedule_id: number;
  event_name: string;
  event_date: string;
  from_volunteer_name: string;
  to_volunteer_name: string;
  status: string;
  message?: string;
}

interface ScheduleItem {
  id: number;
  event_name: string;
  event_date: string;
  role_name: string;
  event_id?: number;
  permite_escalas_entre_igrejas?: boolean;
}

interface Volunteer {
  id: number;
  nome: string;
  igreja_id?: number;
  igreja_nome?: string;
}

export default function Trocas() {
  const { igrejaSelecionada } = useIgreja();
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [mySchedules, setMySchedules] = useState<ScheduleItem[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (igrejaSelecionada) {
      loadData();
    }
  }, [igrejaSelecionada]);

  const loadData = async () => {
    if (!igrejaSelecionada) return;
    
    try {
      setLoading(true);
      const [requests, schedules, vols] = await Promise.all([
        getSwapRequests(1), // TODO: usar ID do usuário logado
        getSchedule(1, igrejaSelecionada.id),
        getVolunteers(igrejaSelecionada.id),
      ]);
      setSwapRequests(requests);
      setMySchedules(schedules);
      setVolunteers(vols);
    } catch (error) {
      toast.error('Erro ao carregar dados');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSwap = async () => {
    if (!selectedSchedule || !selectedVolunteer) {
      toast.error('Selecione uma escala e um voluntário');
      return;
    }

    try {
      await createSwapRequest({
        scheduleId: selectedSchedule.id,
        fromVolunteerId: 1, // TODO: usar ID do usuário logado
        toVolunteerId: selectedVolunteer,
        message,
      });
      toast.success('Solicitação de troca criada!');
      setShowCreateModal(false);
      setSelectedSchedule(null);
      setSelectedVolunteer(null);
      setMessage('');
      loadData();
    } catch (error) {
      toast.error('Erro ao criar solicitação');
      console.error(error);
    }
  };

  // Carregar voluntários quando uma escala for selecionada
  useEffect(() => {
    if (selectedSchedule && selectedSchedule.event_id) {
      loadVolunteersForEvent(selectedSchedule.event_id, selectedSchedule.permite_escalas_entre_igrejas);
    }
  }, [selectedSchedule]);

  const loadVolunteersForEvent = async (eventId: number, permiteEntreIgrejas?: boolean) => {
    try {
      const volunteers = await getVolunteers(
        permiteEntreIgrejas ? undefined : igrejaSelecionada?.id,
        eventId
      );
      setVolunteers(volunteers);
    } catch (error) {
      toast.error('Erro ao carregar voluntários');
      console.error(error);
    }
  };

  const handleAccept = async (swapRequestId: number) => {
    try {
      await acceptSwapRequest(swapRequestId);
      toast.success('Troca aceita!');
      loadData();
    } catch (error) {
      toast.error('Erro ao aceitar troca');
      console.error(error);
    }
  };

  const handleReject = async (swapRequestId: number) => {
    try {
      await rejectSwapRequest(swapRequestId);
      toast.success('Troca rejeitada');
      loadData();
    } catch (error) {
      toast.error('Erro ao rejeitar troca');
      console.error(error);
    }
  };

  if (!igrejaSelecionada) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <GlassCard>
          <p className="text-white/60 text-center">Por favor, selecione uma igreja</p>
        </GlassCard>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full"
        />
      </div>
    );
  }

  const pendingRequests = swapRequests.filter(r => r.status === 'pending');
  const myRequests = swapRequests.filter(r => r.from_volunteer_name.includes('Você') || r.to_volunteer_name.includes('Você'));

  return (
    <div className="min-h-screen p-8 pb-24">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Trocas
            </h1>
            <p className="text-white/70">Gerencie solicitações de troca</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="glass-strong px-6 py-3 rounded-xl text-white hover:bg-white/30 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Solicitar Troca
          </motion.button>
        </motion.div>

        <div className="space-y-6">
          {pendingRequests.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Solicitações Pendentes</h2>
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <GlassCard hover>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">
                            {request.event_name}
                          </h3>
                          <p className="text-white/70 mb-1">
                            {new Date(request.event_date).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-white/60 text-sm">
                            De: {request.from_volunteer_name} → Para: {request.to_volunteer_name}
                          </p>
                          {request.message && (
                            <p className="text-white/70 mt-2 text-sm">{request.message}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAccept(request.id)}
                            className="glass-strong px-4 py-2 rounded-lg text-green-400 hover:bg-green-400/20 transition-colors"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleReject(request.id)}
                            className="glass-strong px-4 py-2 rounded-lg text-red-400 hover:bg-red-400/20 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">Minhas Solicitações</h2>
            {myRequests.length === 0 ? (
              <GlassCard>
                <p className="text-white/60 text-center py-8">Nenhuma solicitação encontrada</p>
              </GlassCard>
            ) : (
              <div className="space-y-4">
                {myRequests.map((request) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <GlassCard hover>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">
                            {request.event_name}
                          </h3>
                          <p className="text-white/70 mb-1">
                            {new Date(request.event_date).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-white/60 text-sm">
                            Status: <span className="capitalize">{request.status}</span>
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-strong p-6 rounded-2xl max-w-md w-full"
            >
              <h2 className="text-2xl font-semibold text-white mb-4">Solicitar Troca</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 mb-2">Escala</label>
                  <select
                    value={selectedSchedule?.id || ''}
                    onChange={(e) => {
                      const schedule = mySchedules.find(s => s.id === Number(e.target.value));
                      setSelectedSchedule(schedule || null);
                    }}
                    className="w-full glass p-3 rounded-xl text-white bg-white/10 border border-white/20"
                  >
                    <option value="">Selecione uma escala</option>
                    {mySchedules.map((schedule) => (
                      <option key={schedule.id} value={schedule.id}>
                        {schedule.event_name} - {new Date(schedule.event_date).toLocaleDateString('pt-BR')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white/80 mb-2">Trocar com</label>
                  <select
                    value={selectedVolunteer || ''}
                    onChange={(e) => setSelectedVolunteer(Number(e.target.value))}
                    className="w-full glass p-3 rounded-xl text-white bg-white/10 border border-white/20"
                  >
                    <option value="">Selecione um voluntário</option>
                    {volunteers.map((vol) => (
                      <option key={vol.id} value={vol.id}>
                        {vol.nome}
                        {vol.igreja_nome && vol.igreja_id !== igrejaSelecionada?.id && (
                          ` (${vol.igreja_nome})`
                        )}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white/80 mb-2">Mensagem (opcional)</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full glass p-3 rounded-xl text-white bg-white/10 border border-white/20 min-h-[100px]"
                    placeholder="Adicione uma mensagem..."
                  />
                </div>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateSwap}
                    className="flex-1 glass-strong px-4 py-3 rounded-xl text-white hover:bg-white/30 transition-colors"
                  >
                    Enviar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 glass px-4 py-3 rounded-xl text-white/80 hover:bg-white/20 transition-colors"
                  >
                    Cancelar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
