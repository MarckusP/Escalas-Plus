'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useIgreja } from '@/contexts/IgrejaContext';
import { getIgrejas } from '@/lib/api';
import { Church } from 'lucide-react';
import toast from 'react-hot-toast';

interface Igreja {
  id: number;
  nome: string;
}

export default function IgrejaSelector() {
  const { igrejaSelecionada, setIgrejaSelecionada } = useIgreja();
  const [igrejas, setIgrejas] = useState<Igreja[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadIgrejas();
  }, []);

  const loadIgrejas = async () => {
    try {
      setLoading(true);
      const data = await getIgrejas();
      setIgrejas(data);
      
      // Se não há igreja selecionada e há igrejas disponíveis, selecionar a primeira
      if (!igrejaSelecionada && data.length > 0) {
        setIgrejaSelecionada(data[0]);
      }
    } catch (error) {
      toast.error('Erro ao carregar igrejas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (igreja: Igreja) => {
    setIgrejaSelecionada(igreja);
    setShowDropdown(false);
    toast.success(`Igreja ${igreja.nome} selecionada`);
  };

  if (loading) {
    return (
      <div className="glass-card p-4">
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full"></div>
          <div className="h-4 bg-white/20 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowDropdown(!showDropdown)}
        className="glass-card p-4 flex items-center gap-3 cursor-pointer w-full"
      >
        <Church className="w-5 h-5 text-white/90" />
        <span className="text-white font-medium flex-1 text-left">
          {igrejaSelecionada ? igrejaSelecionada.nome : 'Selecione uma igreja'}
        </span>
        <motion.div
          animate={{ rotate: showDropdown ? 180 : 0 }}
          className="text-white/70"
        >
          ?
        </motion.div>
      </motion.button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 mt-2 glass-card z-20 max-h-60 overflow-y-auto"
          >
            {igrejas.length === 0 ? (
              <div className="p-4 text-white/60 text-center">
                Nenhuma igreja encontrada
              </div>
            ) : (
              igrejas.map((igreja) => (
                <motion.button
                  key={igreja.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(igreja)}
                  className={`w-full p-4 text-left transition-colors ${
                    igrejaSelecionada?.id === igreja.id
                      ? 'bg-white/30'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Church className="w-4 h-4 text-white/70" />
                    <span className="text-white">{igreja.nome}</span>
                    {igrejaSelecionada?.id === igreja.id && (
                      <span className="ml-auto text-white/70 text-sm">?</span>
                    )}
                  </div>
                </motion.button>
              ))
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}
