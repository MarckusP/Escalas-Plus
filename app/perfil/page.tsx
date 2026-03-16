'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/GlassCard';
import { User, Mail, Phone, CheckCircle } from 'lucide-react';
import { getVolunteers } from '@/lib/api';
import { useIgreja } from '@/contexts/IgrejaContext';
import toast from 'react-hot-toast';

interface Volunteer {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  funcoes: string[];
  ativo: boolean;
}

export default function Perfil() {
  const { igrejaSelecionada } = useIgreja();
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (igrejaSelecionada) {
      loadProfile();
    }
  }, [igrejaSelecionada]);

  const loadProfile = async () => {
    if (!igrejaSelecionada) return;
    
    try {
      setLoading(true);
      const volunteers = await getVolunteers(igrejaSelecionada.id);
      // TODO: buscar voluntário específico pelo ID do usuário logado
      const myProfile = volunteers.find((v: Volunteer) => v.id === 1) || volunteers[0];
      setVolunteer(myProfile);
    } catch (error) {
      toast.error('Erro ao carregar perfil');
      console.error(error);
    } finally {
      setLoading(false);
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

  if (!volunteer) {
    return (
      <div className="min-h-screen p-8">
        <GlassCard>
          <p className="text-white/60 text-center py-8">Perfil não encontrado</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 pb-24">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Meu Perfil
          </h1>
          <p className="text-white/70">Visualize e gerencie seus dados</p>
        </motion.div>

        <div className="space-y-6">
          <GlassCard>
            <div className="flex items-center gap-4 mb-6">
              <div className="glass-strong p-4 rounded-xl">
                <User className="w-12 h-12 text-white/90" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">{volunteer.nome}</h2>
                {volunteer.ativo ? (
                  <div className="flex items-center gap-2 mt-2 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Ativo</span>
                  </div>
                ) : (
                  <span className="text-sm text-white/60 mt-2">Inativo</span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-white/70" />
                <span className="text-white/80">{volunteer.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-white/70" />
                <span className="text-white/80">{volunteer.telefone}</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-2xl font-semibold text-white mb-4">Funções que Posso Exercer</h3>
            {volunteer.funcoes && volunteer.funcoes.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {volunteer.funcoes.map((funcao, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-strong px-4 py-2 rounded-xl text-white"
                  >
                    {funcao}
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-white/60">Nenhuma função atribuída</p>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
