'use client';

import Echo from 'laravel-echo';

declare global {
  interface Window {
    Pusher: any;
    Echo: Echo<any> | undefined;
  }
}

/**
 * Inicializa a instância do Laravel Echo com Reverb.
 * (Desativado conforme plano de migração off-AWS).
 */
export function initEcho(): Echo<any> | null {
  return null;
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
  return null;
}
