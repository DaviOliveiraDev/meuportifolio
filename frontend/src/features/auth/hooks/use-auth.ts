import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { LoginInput, RegisterInput } from '../schemas/auth-schema';

interface UserProfile {
  id: string;
  email: string;
  is_admin?: boolean;
  profile?: {
    id: string;
    username: string;
    name: string;
    avatar_url: string | null;
    bio: string | null;
    role: string | null;
    location: string | null;
    linkedin_url: string | null;
    github_url: string | null;
    website_url: string | null;
    theme_name: string;
    level?: number;
    xp?: number;
    ovr?: number;
    profile_completeness?: number;
    badges?: any[];
    skills?: any[];
    reputation_score?: any[];
  };
}

/**
 * Inicializa a proteção CSRF do Laravel Sanctum.
 * Deve ser chamado antes de operações POST/PUT/DELETE em endpoints estaduais.
 */
const initCsrf = async () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api/v1';
  let csrfUrl = '/sanctum/csrf-cookie';
  if (apiBaseUrl.startsWith('http')) {
    try {
      csrfUrl = `${new URL(apiBaseUrl).origin}/sanctum/csrf-cookie`;
    } catch (e) {
      // fallback
    }
  }
  await apiClient.get(csrfUrl, {
    baseURL: csrfUrl.startsWith('http') ? '' : undefined
  });
};

export function useAuth() {
  const queryClient = useQueryClient();

  // Query para buscar dados do usuário logado
  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery<UserProfile | null>({
    queryKey: ['auth-user'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/auth/me');
        return response.data.user;
      } catch (error) {
        return null; // Retorna nulo se o usuário não estiver logado
      }
    },
    retry: false, // Não re-tentar se retornar 401
    staleTime: 1000 * 60 * 10, // Dados permanecem em cache por 10 minutos
  });

  // Mutation de Login
  const loginMutation = useMutation({
    mutationFn: async (data: LoginInput) => {
      await initCsrf();
      const response = await apiClient.post('/auth/login', data);
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem('auth_token', token);
      }
      return user;
    },
    onSuccess: (newUser) => {
      queryClient.setQueryData(['auth-user'], newUser);
    },
  });

  // Mutation de Registro
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterInput) => {
      await initCsrf();
      const response = await apiClient.post('/auth/register', data);
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem('auth_token', token);
      }
      return user;
    },
    onSuccess: (newUser) => {
      queryClient.setQueryData(['auth-user'], newUser);
    },
  });

  // Mutation de Logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout');
    },
    onSuccess: () => {
      localStorage.removeItem('auth_token');
      queryClient.setQueryData(['auth-user'], null);
      queryClient.clear(); // Limpa todo o cache de consultas para segurança
    },
  });

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    isError,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
    refetchUser: refetch,
  };
}
