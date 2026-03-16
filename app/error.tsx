'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/GlassCard';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen p-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <GlassCard>
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Algo deu errado!</h2>
            <p className="text-white/70 mb-6">{error.message}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={reset}
              className="glass-strong px-6 py-3 rounded-xl text-white hover:bg-white/30 transition-colors"
            >
              Tentar novamente
            </motion.button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
