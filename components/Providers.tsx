'use client';

import { IgrejaProvider } from '@/contexts/IgrejaContext';
import IgrejaSelector from './IgrejaSelector';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <IgrejaProvider>
      <div className="fixed top-4 right-4 z-40 w-64">
        <IgrejaSelector />
      </div>
      {children}
    </IgrejaProvider>
  );
}
