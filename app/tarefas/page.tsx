'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/GlassCard';
import { ClipboardList, CheckCircle, Clock, Calendar } from 'lucide-react';
import { getTasks, updateTaskStatus } from '@/lib/api';
import { useIgreja } from '@/contexts/IgrejaContext';
import toast from 'react-hot-toast';

interface Task {
  id: number;
  title: string;
  description: string;
  due_date: string;
  status: string;
}

export default function Tarefas() {
  const { igrejaSelecionada } = useIgreja();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (igrejaSelecionada) {
      loadTasks();
    }
  }, [igrejaSelecionada]);

  const loadTasks = async () => {
    if (!igrejaSelecionada) return;
    
    try {
      setLoading(true);
      const data = await getTasks(1, igrejaSelecionada.id); // TODO: usar ID do usuário logado
      setTasks(data);
    } catch (error) {
      toast.error('Erro ao carregar tarefas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      toast.success('Status atualizado!');
      loadTasks();
    } catch (error) {
      toast.error('Erro ao atualizar status');
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

  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="min-h-screen p-8 pb-24">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Tarefas
          </h1>
          <p className="text-white/70">Visualize e gerencie suas tarefas atribuídas</p>
        </motion.div>

        <div className="space-y-6">
          {pendingTasks.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Tarefas Pendentes</h2>
              <div className="space-y-4">
                {pendingTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <GlassCard hover>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <ClipboardList className="w-5 h-5 text-white/70" />
                            <h3 className="text-xl font-semibold text-white">{task.title}</h3>
                          </div>
                          <p className="text-white/70 mb-3">{task.description}</p>
                          <div className="flex items-center gap-2 text-white/60 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>Prazo: {new Date(task.due_date).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleStatusChange(task.id, 'completed')}
                          className="glass-strong px-4 py-2 rounded-xl text-green-400 hover:bg-green-400/20 transition-colors flex items-center gap-2 ml-4"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Concluir
                        </motion.button>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {completedTasks.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Tarefas Concluídas</h2>
              <div className="space-y-4">
                {completedTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <GlassCard>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <h3 className="text-xl font-semibold text-white line-through opacity-70">
                              {task.title}
                            </h3>
                          </div>
                          <p className="text-white/60 mb-3 line-through">{task.description}</p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {tasks.length === 0 && (
            <GlassCard>
              <p className="text-white/60 text-center py-8">Nenhuma tarefa encontrada</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}

