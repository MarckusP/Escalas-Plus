'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Igreja {
  id: number;
  nome: string;
}

interface IgrejaContextType {
  igrejaSelecionada: Igreja | null;
  setIgrejaSelecionada: (igreja: Igreja | null) => void;
}

const IgrejaContext = createContext<IgrejaContextType | undefined>(undefined);

export function IgrejaProvider({ children }: { children: ReactNode }) {
  const [igrejaSelecionada, setIgrejaSelecionada] = useState<Igreja | null>(null);

  useEffect(() => {
    // Carregar igreja selecionada do localStorage
    const saved = localStorage.getItem('igrejaSelecionada');
    if (saved) {
      try {
        setIgrejaSelecionada(JSON.parse(saved));
      } catch (e) {
        console.error('Erro ao carregar igreja do localStorage', e);
      }
    }
  }, []);

  useEffect(() => {
    // Salvar igreja selecionada no localStorage
    if (igrejaSelecionada) {
      localStorage.setItem('igrejaSelecionada', JSON.stringify(igrejaSelecionada));
    } else {
      localStorage.removeItem('igrejaSelecionada');
    }
  }, [igrejaSelecionada]);

  return (
    <IgrejaContext.Provider value={{ igrejaSelecionada, setIgrejaSelecionada }}>
      {children}
    </IgrejaContext.Provider>
  );
}

export function useIgreja() {
  const context = useContext(IgrejaContext);
  if (context === undefined) {
    throw new Error('useIgreja deve ser usado dentro de um IgrejaProvider');
  }
  return context;
}
