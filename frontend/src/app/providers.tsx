'use client';

import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { ThemeProvider } from 'next-themes';
import { GamificationListener } from '@/features/gamification/components/GamificationListener';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>
        {children}
        <GamificationListener />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
