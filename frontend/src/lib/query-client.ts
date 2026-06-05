import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Evita disparar requisições extras ao mudar de aba
      retry: 1, // Tenta no máximo 1 vez extra antes de falhar
      staleTime: 1000 * 60 * 5, // 5 minutos de dados em cache como padrão
    },
  },
});
