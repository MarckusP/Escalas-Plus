'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/GlassCard';
import { Calendar, CheckCircle } from 'lucide-react';
import { getAvailability, updateAvailability } from '@/lib/api';
import { useIgreja } from '@/contexts/IgrejaContext';
import toast from 'react-hot-toast';

const daysOfWeek = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

export default function Disponibilidade() {
  const { igrejaSelecionada } = useIgreja();
  const [availability, setAvailability] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (igrejaSelecionada) {
      loadAvailability();
    }
  }, [igrejaSelecionada]);

  const loadAvailability = async () => {
    try {
      setLoading(true);
      const data = await getAvailability(1); // TODO: usar ID do usuário logado
      const availabilityMap: Record<number, boolean> = {};
      data.forEach((item: any) => {
        availabilityMap[item.day_of_week] = item.available;
      });
      setAvailability(availabilityMap);
    } catch (error) {
      toast.error('Erro ao carregar disponibilidade');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day: number) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const availabilityData = Object.entries(availability).map(([day, available]) => ({
        day_of_week: Number(day),
        available,
      }));
      await updateAvailability(1, { availability: availabilityData }); // TODO: usar ID do usuário logado
      toast.success('Disponibilidade salva!');
    } catch (error) {
      toast.error('Erro ao salvar disponibilidade');
      console.error(error);
    } finally {
      setSaving(false);
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
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Disponibilidade
          </h1>
          <p className="text-white/70">Marque os dias da semana em que você está disponível</p>
        </motion.div>

        <GlassCard>
          <div className="space-y-4">
            {daysOfWeek.map((day, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                onClick={() => toggleDay(index)}
                className={`glass p-4 rounded-xl cursor-pointer transition-all ${
                  availability[index] ? 'bg-white/20 border-white/40' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-white">{day}</span>
                  {availability[index] ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-white/40" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={saving}
            className="mt-6 w-full glass-strong px-6 py-3 rounded-xl text-white hover:bg-white/30 transition-colors disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar Disponibilidade'}
          </motion.button>
        </GlassCard>
      </div>
    </div>
  );
}
