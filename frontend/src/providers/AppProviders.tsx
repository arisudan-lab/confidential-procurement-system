import type { ReactNode } from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AppProvider } from '../contexts/AppContext';
import { WalletProvider } from '../contexts/WalletContext';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AppProvider>
        <WalletProvider>
          {children}
        </WalletProvider>
      </AppProvider>
    </ThemeProvider>
  );
}
