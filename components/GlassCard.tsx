import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({ children, className = '', hover = false }: GlassCardProps) {
  const baseClasses = 'glass-card';
  const finalClasses = `${baseClasses} ${className}`;

  if (hover) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        className={finalClasses}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={finalClasses}>{children}</div>;
}
