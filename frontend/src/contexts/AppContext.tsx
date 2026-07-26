import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface AppState {
  isLoading: boolean;
  activeTenderId: string | null;
}

interface AppContextType {
  state: AppState;
  setLoading: (isLoading: boolean) => void;
  setActiveTender: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    isLoading: false,
    activeTenderId: null,
  });

  const setLoading = (isLoading: boolean) => setState(s => ({ ...s, isLoading }));
  const setActiveTender = (id: string | null) => setState(s => ({ ...s, activeTenderId: id }));

  return (
    <AppContext.Provider value={{ state, setLoading, setActiveTender }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
