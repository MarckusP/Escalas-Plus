'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/GlassCard';
import { Calendar, ClipboardList, Bell, CheckCircle, Clock } from 'lucide-react';
import { getSchedule, getTasks } from '@/lib/api';
import { useIgreja } from '@/contexts/IgrejaContext';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface ScheduleItem {
  id: number;
  event_name: string;
  event_date: string;
  event_time: string;
  role_name: string;
  confirmed: boolean;
}

interface Task {
  id: number;
  title: string;
  description: string;
  due_date: string;
  status: string;
}

export default function Dashboard() {
  const { igrejaSelecionada } = useIgreja();
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (igrejaSelecionada) {
      loadData();
    }
  }, [igrejaSelecionada]);

  const loadData = async () => {
    if (!igrejaSelecionada) return;
    
    try {
      setLoading(true);
      const [schedulesData, tasksData] = await Promise.all([
        getSchedule(1, igrejaSelecionada.id), // TODO: usar ID do usuário logado
        getTasks(1, igrejaSelecionada.id),
      ]);
      setSchedules(schedulesData);
      setTasks(tasksData);
    } catch (error) {
      toast.error('Erro ao carregar dados');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingSchedules = schedules
    .filter(s => new Date(s.event_date) >= new Date())
    .slice(0, 5);

  const pendingTasks = tasks.filter(t => t.status !== 'completed').slice(0, 5);

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
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-white/70">Bem-vindo ao Escalas Moria</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-white/90" />
              <h2 className="text-2xl font-semibold text-white">Próximas Escalas</h2>
            </div>
            {upcomingSchedules.length === 0 ? (
              <p className="text-white/60">Nenhuma escala próxima</p>
            ) : (
              <div className="space-y-3">
                {upcomingSchedules.map((schedule) => (
                  <motion.div
                    key={schedule.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass p-4 rounded-xl"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-white">{schedule.event_name}</h3>
                        <p className="text-sm text-white/70">
                          {new Date(schedule.event_date).toLocaleDateString('pt-BR')} às {schedule.event_time}
                        </p>
                        <p className="text-sm text-white/60 mt-1">Função: {schedule.role_name}</p>
                      </div>
                      {schedule.confirmed ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Clock className="w-5 h-5 text-yellow-400" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            <Link href="/escalas" className="block mt-4 text-blue-300 hover:text-blue-200 text-sm">
              Ver todas as escalas →
            </Link>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <ClipboardList className="w-6 h-6 text-white/90" />
              <h2 className="text-2xl font-semibold text-white">Tarefas Pendentes</h2>
            </div>
            {pendingTasks.length === 0 ? (
              <p className="text-white/60">Nenhuma tarefa pendente</p>
            ) : (
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass p-4 rounded-xl"
                  >
                    <h3 className="font-semibold text-white">{task.title}</h3>
                    <p className="text-sm text-white/70 mt-1">{task.description}</p>
                    <p className="text-xs text-white/60 mt-2">
                      Prazo: {new Date(task.due_date).toLocaleDateString('pt-BR')}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
            <Link href="/tarefas" className="block mt-4 text-blue-300 hover:text-blue-200 text-sm">
              Ver todas as tarefas →
            </Link>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
