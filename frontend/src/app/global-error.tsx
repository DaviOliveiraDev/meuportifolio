'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export const dynamic = 'force-dynamic';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Registra o erro no Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#050508] text-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-md text-center space-y-6 bg-neutral-900/30 border border-neutral-850 p-8 rounded-3xl backdrop-blur-md">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/25 rounded-full flex items-center justify-center text-red-500 mx-auto text-2xl font-bold animate-pulse">
            !
          </div>
          <h2 className="text-xl font-bold">Ocorreu um erro crítico</h2>
          <p className="text-xs text-neutral-450 leading-relaxed">
            Pedimos desculpas pelo inconveniente. O erro foi registrado e nossa equipe técnica foi notificada.
          </p>
          <button
            onClick={() => reset()}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-lg shadow-violet-950/20"
          >
            Tentar Novamente
          </button>
        </div>
      </body>
    </html>
  );
}
