'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Trophy, ArrowRightLeft, LayoutDashboard, LogIn, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';

export function NavigationHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

    // Verifica autenticação básica pelo localstorage
    if (typeof window !== 'undefined') {
      setIsAuthenticated(!!localStorage.getItem('auth_token'));
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Explorar', href: '/explore', icon: Compass },
    { name: 'Rankings', href: '/leaderboard', icon: Trophy },
    { name: 'Comparador', href: '/compare', icon: ArrowRightLeft },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
        isScrolled
          ? 'bg-[#050508]/90 backdrop-blur-md border-neutral-900 shadow-lg shadow-black/20'
          : 'bg-[#050508]/60 backdrop-blur-sm border-transparent'
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-extrabold shadow-[0_0_15px_rgba(139,92,246,0.3)] group-hover:scale-105 transition-transform">
            D
          </span>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-[#cbd5e1] bg-clip-text text-transparent">
            DevFolio
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-1.5 text-sm font-medium transition-colors py-2 px-3 rounded-lg border border-transparent',
                  isActive
                    ? 'text-violet-400 bg-violet-500/5 border-violet-500/10'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-semibold text-xs py-2 px-4 rounded-lg transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              Painel
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-neutral-400 hover:text-white transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs py-2 px-4 rounded-lg shadow-[0_4px_20px_rgba(139,92,246,0.25)] transition-all hover:scale-[1.02] cursor-pointer"
              >
                Começar
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-neutral-400 hover:text-white"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#050508] border-b border-neutral-900 px-6 py-6 space-y-4 absolute top-16 left-0 right-0 z-50 animate-in fade-in slide-in-from-top-4 duration-250">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors border border-transparent',
                    isActive
                      ? 'text-violet-400 bg-violet-500/5 border-violet-500/10'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </nav>
          <div className="pt-4 border-t border-neutral-900 flex flex-col gap-3">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white text-sm font-semibold transition-colors"
              >
                <LayoutDashboard className="w-4.5 h-4.5" />
                Acessar Painel
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center py-2.5 px-4 text-sm font-semibold text-neutral-400 hover:text-white transition-colors"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center py-2.5 px-4 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-[0_4px_20px_rgba(139,92,246,0.25)]"
                >
                  Começar Gratuitamente
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
