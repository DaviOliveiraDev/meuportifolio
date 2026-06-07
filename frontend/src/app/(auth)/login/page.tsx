import { Suspense } from 'react';
import { LoginForm } from '@/features/auth/components/login-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Entrar | DevFolio',
  description: 'Faça login na sua conta DevFolio para gerenciar seu portfólio profissional.',
};

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-neutral-950 overflow-hidden">
      {/* Círculos de gradiente de fundo decorativos (Premium Design) */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Conteúdo principal */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-6">
        {/* Logo / Header Branding */}
        <div className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white text-lg shadow-md shadow-violet-600/20">
            D
          </span>
          <span className="text-xl font-bold tracking-tight text-white">
            Dev<span className="text-violet-400">Folio</span>
          </span>
        </div>

        <Suspense fallback={
          <div className="flex flex-col items-center justify-center p-8 bg-neutral-900/60 border border-neutral-800 rounded-2xl w-full text-neutral-450 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            <span className="text-sm font-medium">Carregando portal de login...</span>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

// Pequeno import helper necessário para o Loader no fallback do Suspense
import { Loader2 } from 'lucide-react';
