import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api/v1',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // Força o Laravel a retornar JSON sob erros
  },
  withCredentials: false,
});

// Interceptor de Request: Lê o token de API ou o cookie CSRF e injeta no header
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // 1. Lê e injeta o Token de API do localStorage se existir (Autenticação baseada em Token)
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // 2. Lê e injeta o Cookie CSRF se existir (Autenticação baseada em Cookie/Sessão)
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return undefined;
    };

    const xsrfToken = getCookie('XSRF-TOKEN');
    if (xsrfToken) {
      // O Laravel encripta/codifica o token no cookie, precisamos decodificá-lo antes de enviar
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
    }
  }
  return config;
});

// Adiciona um interceptor para lidar com erros comuns globalmente (ex: 401 não autorizado)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o backend retornar 401 e não for uma tentativa de login, podemos limpar as sessões locais
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      // Opcional: Redirecionar para o login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
