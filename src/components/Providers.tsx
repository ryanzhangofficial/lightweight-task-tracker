'use client';

import { AppProvider } from '@/store/AppContext';
import { ThemeProvider } from '@/store/ThemeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AppProvider>{children}</AppProvider>
    </ThemeProvider>
  );
}
