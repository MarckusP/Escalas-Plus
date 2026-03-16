'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, RefreshCw, CheckCircle, ClipboardList, User } from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: Calendar, label: 'Dashboard' },
  { href: '/escalas', icon: Calendar, label: 'Escalas' },
  { href: '/trocas', icon: RefreshCw, label: 'Trocas' },
  { href: '/disponibilidade', icon: CheckCircle, label: 'Disponibilidade' },
  { href: '/tarefas', icon: ClipboardList, label: 'Tarefas' },
  { href: '/perfil', icon: User, label: 'Perfil' },
];

export default function Navigation() {
  const pathname = usePathname();

  // Não mostrar navegação na página inicial
  if (pathname === '/') {
    return null;
  }

  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="glass-strong px-4 py-3 rounded-2xl flex gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link key={item.href} href={item.href} title={item.label}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-3 rounded-xl transition-colors ${
                  isActive ? 'bg-white/30' : 'hover:bg-white/10'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white/70'}`} />
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
