'use client';

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: any;
    Echo: Echo<any> | undefined;
  }
}

/**
 * Inicializa a instância do Laravel Echo com Reverb.
 * Lê o token atual do localStorage para fins de autenticação de canais privados.
 */
export function initEcho(): Echo<any> | null {
  if (typeof window === 'undefined') return null;

  // Vincula Pusher no escopo global para que o Laravel Echo o localize
  window.Pusher = Pusher;

  // Evita múltiplas conexões ativas duplicadas
  if (window.Echo) {
    window.Echo.disconnect();
  }

  const token = localStorage.getItem('auth_token');
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  
  // O endpoint de autorização do Laravel para canais privados
  const authEndpoint = `${apiBaseUrl.replace(/\/api\/v1$/, '')}/broadcasting/auth`;

  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const host = process.env.NEXT_PUBLIC_REVERB_HOST || 'localhost';
  const port = process.env.NEXT_PUBLIC_REVERB_PORT || '8080';
  const key = process.env.NEXT_PUBLIC_REVERB_APP_KEY || 'rgd6wmzwwmo8oo5rvjc4';
  const scheme = process.env.NEXT_PUBLIC_REVERB_SCHEME || 'http';

  window.Echo = new Echo({
    broadcaster: 'reverb',
    key: key,
    wsHost: host,
    wsPort: parseInt(port, 10),
    wssPort: parseInt(port, 10),
    forceTLS: scheme === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: authEndpoint,
    auth: {
      headers: headers,
    },
  });

  return window.Echo;
}

/**
 * Desconecta a instância do Laravel Echo se estiver ativa.
 */
export function disconnectEcho(): void {
  if (typeof window !== 'undefined' && window.Echo) {
    window.Echo.disconnect();
    window.Echo = undefined;
  }
}

/**
 * Retorna a instância global ativa do Laravel Echo.
 */
export function getEcho(): Echo<any> | null {
  if (typeof window === 'undefined') return null;
  return window.Echo || null;
}
