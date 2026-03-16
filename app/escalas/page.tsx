'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/GlassCard';
import { Calendar, CheckCircle, Clock, X, Globe } from 'lucide-react';
import { getSchedule, confirmPresence } from '@/lib/api';
import { useIgreja } from '@/contexts/IgrejaContext';
import toast from 'react-hot-toast';

interface ScheduleItem {
  id: number;
  event_name: string;
  event_date: string;
  event_time: string;
  role_name: string;
  confirmed: boolean;
  escala_entre_igrejas?: boolean;
  igreja_nome?: string;
  volunteer_igreja_nome?: string;
}

export default function Escalas() {
  const { igrejaSelecionada } = useIgreja();
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (igrejaSelecionada) {
      loadSchedules();
    }
  }, [igrejaSelecionada]);

  const loadSchedules = async () => {
    if (!igrejaSelecionada) return;
    
    try {
      setLoading(true);
      const data = await getSchedule(1, igrejaSelecionada.id); // TODO: usar ID do usuário logado
      setSchedules(data);
    } catch (error) {
      toast.error('Erro ao carregar escalas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (scheduleId: number) => {
    try {
      await confirmPresence(scheduleId);
      toast.success('Presença confirmada!');
      loadSchedules();
    } catch (error) {
      toast.error('Erro ao confirmar presença');
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

  return (
    <div className="min-h-screen p-8 pb-24">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Minhas Escalas
          </h1>
          <p className="text-white/70">Visualize e confirme suas escalas</p>
        </motion.div>

        <div className="space-y-4">
          {schedules.length === 0 ? (
            <GlassCard>
              <p className="text-white/60 text-center py-8">Nenhuma escala encontrada</p>
            </GlassCard>
          ) : (
            schedules.map((schedule) => (
              <motion.div
                key={schedule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassCard hover>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="glass-strong p-4 rounded-xl">
                        <Calendar className="w-8 h-8 text-white/90" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-semibold text-white">
                            {schedule.event_name}
                          </h3>
                          {schedule.escala_entre_igrejas && (
                            <div className="flex items-center gap-1 glass px-2 py-1 rounded-lg">
                              <Globe className="w-4 h-4 text-blue-300" />
                              <span className="text-xs text-blue-300">Entre Igrejas</span>
                            </div>
                          )}
                        </div>
                        <p className="text-white/70">
                          {new Date(schedule.event_date).toLocaleDateString('pt-BR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-white/60 text-sm mt-1">
                          Horário: {schedule.event_time} | Função: {schedule.role_name}
                        </p>
                        {schedule.escala_entre_igrejas && schedule.igreja_nome && (
                          <p className="text-blue-300 text-xs mt-1">
                            Evento da: {schedule.igreja_nome}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {schedule.confirmed ? (
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm">Confirmado</span>
                        </div>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleConfirm(schedule.id)}
                          className="glass-strong px-6 py-2 rounded-xl text-white hover:bg-white/30 transition-colors flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Confirmar Presença
                        </motion.button>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
