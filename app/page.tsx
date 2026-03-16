'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Users, RefreshCw, CheckCircle, User, ClipboardList } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Escalas Moria
          </h1>
          <p className="text-xl text-white/80">Gestão de Voluntários</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NavCard
            href="/dashboard"
            icon={Calendar}
            title="Dashboard"
            description="Visualize suas próximas escalas e tarefas"
          />
          <NavCard
            href="/escalas"
            icon={Users}
            title="Escalas"
            description="Veja e confirme suas escalas"
          />
          <NavCard
            href="/trocas"
            icon={RefreshCw}
            title="Trocas"
            description="Solicite ou aceite trocas"
          />
          <NavCard
            href="/disponibilidade"
            icon={CheckCircle}
            title="Disponibilidade"
            description="Marque seus dias disponíveis"
          />
          <NavCard
            href="/tarefas"
            icon={ClipboardList}
            title="Tarefas"
            description="Visualize suas tarefas atribuídas"
          />
          <NavCard
            href="/perfil"
            icon={User}
            title="Perfil"
            description="Gerencie seus dados"
          />
        </div>
      </motion.div>
    </div>
  );
}

function NavCard({ href, icon: Icon, title, description }: {
  href: string;
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        className="glass-card cursor-pointer h-full"
      >
        <Icon className="w-12 h-12 mb-4 text-white/90" />
        <h2 className="text-2xl font-semibold mb-2 text-white">{title}</h2>
        <p className="text-white/70">{description}</p>
      </motion.div>
    </Link>
  );
}
