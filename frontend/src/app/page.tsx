'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FolderGit2,
  ExternalLink,
  Star,
  Layout,
  User,
  FileText,
  LineChart,
  Palette,
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
  ChevronDown,
  Globe,
  Sparkles,
  Layers,
  MapPin,
  Briefcase,
  Terminal,
  Printer,
  ChevronRight
} from 'lucide-react';

// Custom inline SVGs to avoid package version discrepancies
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeShowcaseTheme, setActiveShowcaseTheme] = useState<'minimalist' | 'modern' | 'dark' | 'light'>('modern');

  // FAQ mock data
  const faqs = [
    {
      question: "O DevFolio é gratuito?",
      answer: "Sim! O DevFolio oferece um plano gratuito completo que permite que você crie seu perfil, adicione projetos, experiências, formação acadêmica, habilidades e conecte seu GitHub. Oferecemos também um plano Pro opcional com recursos como domínio personalizado e templates exclusivos."
    },
    {
      question: "Posso usar meu próprio domínio?",
      answer: "Com certeza! No plano Pro do DevFolio, você pode configurar seu próprio domínio personalizado (ex: seunome.com.br ou dev.seunome.com) para apontar diretamente para a sua página de portfólio."
    },
    {
      question: "Como funciona a sincronização com o GitHub?",
      answer: "É extremamente simples. Você só precisa fornecer a URL do seu GitHub no painel administrativo e, com um único clique, nosso sistema em background importa seus repositórios públicos, mapeando o título, descrição, link do código e link de demonstração automaticamente."
    },
    {
      question: "Como funciona a geração de currículo em PDF?",
      answer: "Nossa plataforma gera automaticamente um currículo estruturado e otimizado para sistemas de triagem de currículos (ATS) em formato PDF. Sempre que você atualiza suas informações no painel, seu currículo em PDF é sincronizado imediatamente, pronto para download."
    }
  ];

  return (
    <div className="bg-[#050508] text-[#f1f5f9] min-h-screen relative overflow-x-hidden font-sans antialiasedSelection">
      
      {/* Background glow blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-violet-600/10 rounded-full blur-[100px] sm:blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-[800px] right-1/4 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-indigo-500/5 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[400px] left-10 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />

      {/* Header / Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#050508]/85 backdrop-blur-md border-b border-neutral-900 transition-all">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-extrabold shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              D
            </span>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-[#cbd5e1] bg-clip-text text-transparent">
              DevFolio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-450">
            <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
            <a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a>
            <a href="#showcase" className="hover:text-white transition-colors">Showcase</a>
            <a href="#faq" className="hover:text-white transition-colors">Perguntas Frequentes</a>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-neutral-400 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link 
              href="/register" 
              className="bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs py-2.5 px-4 rounded-lg shadow-[0_4px_20px_rgba(139,92,246,0.25)] transition-all hover:scale-[1.02] cursor-pointer"
            >
              Começar Gratuitamente
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 text-neutral-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#050508] border-b border-neutral-900 px-6 py-6 space-y-4 absolute top-16 left-0 right-0 z-50 animate-in fade-in slide-in-from-top-4 duration-250">
            <nav className="flex flex-col gap-4 text-sm font-medium text-neutral-400">
              <a href="#recursos" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1 transition-colors">Recursos</a>
              <a href="#como-funciona" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1 transition-colors">Como Funciona</a>
              <a href="#showcase" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1 transition-colors">Showcase</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1 transition-colors">Perguntas Frequentes</a>
            </nav>
            <div className="h-[1px] bg-neutral-900 my-4" />
            <div className="flex flex-col gap-3">
              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)} 
                className="text-sm font-semibold text-neutral-400 hover:text-white py-2 text-center"
              >
                Entrar
              </Link>
              <Link 
                href="/register" 
                onClick={() => setMobileMenuOpen(false)} 
                className="bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm py-3 px-4 rounded-lg shadow-[0_4px_20px_rgba(139,92,246,0.2)] text-center cursor-pointer"
              >
                Começar Gratuitamente
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto px-6 pt-28 sm:pt-36 pb-16 text-center space-y-8 z-10">
        
        {/* Glow pill badge */}
        <div className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-full border border-violet-500/30 bg-violet-950/15 backdrop-blur-sm shadow-[0_0_15px_rgba(139,92,246,0.1)] animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-[10px] sm:text-xs font-bold text-violet-300 tracking-wider uppercase">
            Plataforma Automatizada para Portfólios
          </span>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] bg-gradient-to-b from-white via-white to-[#94a3b8] bg-clip-text text-transparent">
            Seu currículo, portfólio e presença profissional <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">em um único lugar.</span>
          </h1>
          <p className="text-sm sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed font-light">
            Crie uma página profissional moderna, destaque seus melhores projetos, conecte seu GitHub em um clique e gere currículos elegantes prontos para contratação.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            href="/register" 
            className="w-full sm:w-auto bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm py-3.5 px-8 rounded-xl shadow-[0_8px_30px_rgba(139,92,246,0.35)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Começar gratuitamente
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a 
            href="#showcase" 
            className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-200 font-semibold text-sm py-3.5 px-8 rounded-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
          >
            Ver demonstração
          </a>
        </div>

        {/* Realistic Dashboard Mockup */}
        <div className="pt-16 max-w-5xl mx-auto relative group">
          {/* Border light glow effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/10 to-cyan-500/10 rounded-2xl blur-xl opacity-70 group-hover:opacity-90 transition-opacity pointer-events-none" />
          
          <div className="bg-neutral-950/80 border-2 border-neutral-850 rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.8)] backdrop-blur-md relative z-10 transition-colors group-hover:border-violet-500/20">
            {/* Window buttons */}
            <div className="h-10 border-b border-neutral-900 bg-[#0c0d15]/50 px-4 flex items-center justify-between">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/30" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/30" />
                <span className="w-3 h-3 rounded-full bg-green-500/30" />
              </div>
              <span className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase">
                DEVFOLIO::ADMIN_PANEL
              </span>
              <div className="w-12" />
            </div>

            {/* Dashboard Mockup Content */}
            <div className="grid grid-cols-1 md:grid-cols-4 min-h-[350px] text-left">
              {/* Sidebar Mock */}
              <div className="md:col-span-1 border-r border-neutral-900 p-4 bg-[#07080e]/40 space-y-6 hidden md:block">
                <div className="flex items-center gap-2.5 px-2 py-1 bg-white/5 border border-white/5 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-violet-600/25 flex items-center justify-center font-bold text-violet-400 text-xs">
                    DS
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-200">Davi Silva</p>
                    <p className="text-[9px] text-neutral-500">devfolio.com/davi</p>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="text-[9px] font-mono text-neutral-500 px-2 uppercase tracking-wider block mb-2">Painel</span>
                  <div className="flex items-center gap-2 px-3 py-2 bg-violet-600/10 text-violet-400 border-l-2 border-violet-500 font-semibold rounded-r">
                    <Layout className="w-3.5 h-3.5" />
                    <span>Visão Geral</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 text-neutral-400 hover:text-neutral-200 hover:bg-white/5 rounded">
                    <User className="w-3.5 h-3.5" />
                    <span>Editar Perfil</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 text-neutral-400 hover:text-neutral-200 hover:bg-white/5 rounded">
                    <FolderGit2 className="w-3.5 h-3.5" />
                    <span>Projetos</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 text-neutral-400 hover:text-neutral-200 hover:bg-white/5 rounded">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Currículo PDF</span>
                  </div>
                </div>
              </div>

              {/* Main Content Mock */}
              <div className="md:col-span-3 p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-900">
                  <div>
                    <h2 className="text-lg font-bold text-neutral-200">Olá, Davi!</h2>
                    <p className="text-xs text-neutral-500">Seu portfólio está publicado e recebendo visitas.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Live: devfolio.com/davi
                    </span>
                  </div>
                </div>

                {/* KPI metrics row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-[#090a12]/70 border border-neutral-900 space-y-1">
                    <p className="text-[10px] font-bold font-mono text-neutral-550 uppercase tracking-wider flex items-center gap-1">
                      <LineChart className="w-3 h-3 text-cyan-400" />
                      Visualizações
                    </p>
                    <p className="text-xl font-bold text-white">1,420</p>
                    <p className="text-[9px] text-emerald-400">+12% este mês</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#090a12]/70 border border-neutral-900 space-y-1">
                    <p className="text-[10px] font-bold font-mono text-neutral-550 uppercase tracking-wider flex items-center gap-1">
                      <FolderGit2 className="w-3 h-3 text-violet-400" />
                      Projetos Ativos
                    </p>
                    <p className="text-xl font-bold text-white">14</p>
                    <p className="text-[9px] text-neutral-500">Sincronizado c/ GitHub</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#090a12]/70 border border-neutral-900 space-y-1">
                    <p className="text-[10px] font-bold font-mono text-neutral-550 uppercase tracking-wider flex items-center gap-1">
                      <Printer className="w-3 h-3 text-pink-400" />
                      Downloads PDF
                    </p>
                    <p className="text-xl font-bold text-white">352</p>
                    <p className="text-[9px] text-violet-400">Currículo Atualizado</p>
                  </div>
                </div>

                {/* Sub layout simulation */}
                <div className="p-4 rounded-xl bg-[#090a12]/40 border border-neutral-900 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-neutral-300">Sincronização de Repositórios</p>
                    <span className="text-[9px] font-mono text-violet-400">Verificado há 10 min</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded bg-neutral-950 border border-neutral-900 text-xs">
                      <span className="font-semibold text-neutral-200">my-ecommerce-api</span>
                      <span className="text-[10px] bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded">Ativo no portfólio</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-neutral-950 border border-neutral-900 text-xs">
                      <span className="font-semibold text-neutral-200">next-auth-boilerplate</span>
                      <span className="text-[10px] bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded">Ativo no portfólio</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="recursos" className="max-w-6xl mx-auto px-6 py-20 sm:py-28 space-y-16 relative z-10 scroll-mt-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-violet-400">Benefícios Incríveis</h2>
          <p className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Tudo o que você precisa para se destacar no mercado.
          </p>
          <p className="text-neutral-450 text-sm leading-relaxed font-light">
            Esqueça arquivos Word bagunçados e portfólios feitos do zero. Nós automatizamos seu fluxo e criamos uma página marcante para recrutadores.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-[#090a12]/50 border border-neutral-850 hover:border-violet-500/20 rounded-2xl p-6 space-y-4 hover:shadow-[0_10px_30px_rgba(139,92,246,0.05)] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:bg-violet-600/10 transition-colors">
              <User className="w-5 h-5" />
            </div>
            <h3 className="text-md font-bold text-neutral-200">Perfil Profissional</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Uma URL personalizada (ex: `devfolio.com/davi`) que funciona como seu cartão de visitas digital interativo e de alto nível.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#090a12]/50 border border-neutral-850 hover:border-cyan-500/20 rounded-2xl p-6 space-y-4 hover:shadow-[0_10px_30px_rgba(6,182,212,0.05)] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-600/10 transition-colors">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <h3 className="text-md font-bold text-neutral-200">Showcase de Projetos</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Adicione fotos de capa, descrições, tags de tecnologias e links de demonstração direta para organizar seus projetos de maior orgulho.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#090a12]/50 border border-neutral-850 hover:border-violet-500/20 rounded-2xl p-6 space-y-4 hover:shadow-[0_10px_30px_rgba(139,92,246,0.05)] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:bg-violet-600/10 transition-colors">
              <GithubIcon className="w-5 h-5" />
            </div>
            <h3 className="text-md font-bold text-neutral-200">Integração GitHub</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Importe repositórios de forma assíncrona. Nossa fila lê a API do GitHub e cria projetos estruturados no seu portfólio instantaneamente.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-[#090a12]/50 border border-neutral-850 hover:border-pink-500/20 rounded-2xl p-6 space-y-4 hover:shadow-[0_10px_30px_rgba(236,72,153,0.05)] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:bg-pink-600/10 transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-md font-bold text-neutral-200">Currículo PDF Automatizado</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Gere um currículo estruturado e moderno a partir dos dados do seu portfólio em um clique, com design 100% otimizado para sistemas ATS.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-[#090a12]/50 border border-neutral-850 hover:border-cyan-500/20 rounded-2xl p-6 space-y-4 hover:shadow-[0_10px_30px_rgba(6,182,212,0.05)] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-600/10 transition-colors">
              <LineChart className="w-5 h-5" />
            </div>
            <h3 className="text-md font-bold text-neutral-200">Analytics Integrado</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Monitore visualizações de perfil e cliques em links em tempo real com buffering no Redis para performance robusta de gravação.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-[#090a12]/50 border border-neutral-850 hover:border-violet-500/20 rounded-2xl p-6 space-y-4 hover:shadow-[0_10px_30px_rgba(139,92,246,0.05)] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:bg-violet-600/10 transition-colors">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-md font-bold text-neutral-200">Temas Premium</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Alterne instantaneamente entre os temas Minimalista, Modern Glassmorphism, Cyberpunk e Neobrutalista para expressar seu estilo.
            </p>
          </div>

        </div>
      </section>

      {/* Como Funciona Section */}
      <section id="como-funciona" className="max-w-6xl mx-auto px-6 py-20 sm:py-28 space-y-16 relative z-10 scroll-mt-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-cyan-400">Fluxo Simples</h2>
          <p className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Seu portfólio no ar em 4 passos rápidos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {/* Arrow decor for desktop */}
          <div className="hidden lg:block absolute top-[44px] left-[15%] right-[15%] h-[1px] border-t border-dashed border-neutral-800 pointer-events-none z-0" />

          {/* Passo 1 */}
          <div className="text-center space-y-3 relative z-10 group">
            <div className="w-14 h-14 rounded-full bg-[#090a12] border-2 border-neutral-850 text-neutral-100 font-bold flex items-center justify-center text-lg mx-auto shadow-md group-hover:border-violet-500 transition-all duration-300">
              01
            </div>
            <h3 className="text-md font-bold text-neutral-200">Crie sua conta</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light max-w-xs mx-auto">
              Registre-se com e-mail e senha ou use o login social do GitHub para acelerar seu cadastro.
            </p>
          </div>

          {/* Passo 2 */}
          <div className="text-center space-y-3 relative z-10 group">
            <div className="w-14 h-14 rounded-full bg-[#090a12] border-2 border-neutral-850 text-neutral-100 font-bold flex items-center justify-center text-lg mx-auto shadow-md group-hover:border-cyan-500 transition-all duration-300">
              02
            </div>
            <h3 className="text-md font-bold text-neutral-200">Monte seu perfil</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light max-w-xs mx-auto">
              Adicione suas experiências, formação e competências em nosso formulário simples e direto.
            </p>
          </div>

          {/* Passo 3 */}
          <div className="text-center space-y-3 relative z-10 group">
            <div className="w-14 h-14 rounded-full bg-[#090a12] border-2 border-neutral-850 text-neutral-100 font-bold flex items-center justify-center text-lg mx-auto shadow-md group-hover:border-violet-500 transition-all duration-300">
              03
            </div>
            <h3 className="text-md font-bold text-neutral-200">Adicione seus projetos</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light max-w-xs mx-auto">
              Cadastre seus projetos ou puxe seus repositórios do GitHub automaticamente em segundos.
            </p>
          </div>

          {/* Passo 4 */}
          <div className="text-center space-y-3 relative z-10 group">
            <div className="w-14 h-14 rounded-full bg-[#090a12] border-2 border-neutral-850 text-neutral-100 font-bold flex items-center justify-center text-lg mx-auto shadow-md group-hover:border-pink-500 transition-all duration-300">
              04
            </div>
            <h3 className="text-md font-bold text-neutral-200">Compartilhe seu link</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light max-w-xs mx-auto">
              Pronto! Divulgue sua URL personalizada no LinkedIn, currículo e apresentações profissionais.
            </p>
          </div>

        </div>
      </section>

      {/* Showcase Section */}
      <section id="showcase" className="max-w-6xl mx-auto px-6 py-20 sm:py-28 space-y-16 relative z-10 scroll-mt-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-violet-400">Temas em Ação</h2>
          <p className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Escolha o visual que melhor representa você.
          </p>
          <p className="text-neutral-450 text-sm leading-relaxed font-light">
            Alterne o tema instantaneamente para combinar com seu perfil de atuação (Corporativo, Criativo, Tecnológico ou Editorial).
          </p>
        </div>

        {/* Theme selectors */}
        <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto bg-neutral-950 p-1.5 rounded-xl border border-neutral-900">
          <button 
            onClick={() => setActiveShowcaseTheme('modern')}
            className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeShowcaseTheme === 'modern' ? 'bg-violet-600 text-white shadow-md' : 'text-neutral-400 hover:text-neutral-200'}`}
          >
            Moderno
          </button>
          <button 
            onClick={() => setActiveShowcaseTheme('minimalist')}
            className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeShowcaseTheme === 'minimalist' ? 'bg-violet-600 text-white shadow-md' : 'text-neutral-400 hover:text-neutral-200'}`}
          >
            Minimalista
          </button>
          <button 
            onClick={() => setActiveShowcaseTheme('dark')}
            className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeShowcaseTheme === 'dark' ? 'bg-violet-600 text-white shadow-md' : 'text-neutral-400 hover:text-neutral-200'}`}
          >
            Cyberpunk
          </button>
          <button 
            onClick={() => setActiveShowcaseTheme('light')}
            className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeShowcaseTheme === 'light' ? 'bg-violet-600 text-white shadow-md' : 'text-neutral-400 hover:text-neutral-200'}`}
          >
            Neobrutalista
          </button>
        </div>

        {/* Live Theme Preview simulation */}
        <div className="max-w-3xl mx-auto border border-neutral-850 rounded-2xl overflow-hidden shadow-2xl relative">
          
          {/* Header preview decor */}
          <div className="h-9 bg-neutral-950 border-b border-neutral-900 px-4 flex items-center justify-between text-xs text-neutral-500">
            <span>PREVIA_TEMA_ATIVO::{activeShowcaseTheme.toUpperCase()}</span>
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
            </div>
          </div>

          <div className="relative">
            {activeShowcaseTheme === 'minimalist' && (
              <div className="bg-[#fafaf7] text-[#1c1c1c] p-8 space-y-6 text-left font-serif min-h-[300px]">
                <div className="space-y-2">
                  <h3 className="text-2xl font-light font-serif">Ana Beatriz</h3>
                  <p className="text-xs uppercase tracking-wider text-neutral-500 font-sans font-semibold">Designer UX/UI & Frontend</p>
                </div>
                <p className="text-sm leading-relaxed text-neutral-600 max-w-xl font-sans font-light">
                  Desenho experiências digitais interativas focadas em simplicidade e usabilidade. Combino conceitos clássicos de design editorial com código limpo.
                </p>
                <div className="border-t border-neutral-200 pt-4 flex gap-2">
                  <span className="text-[10px] bg-neutral-200/50 px-2.5 py-1 text-neutral-650 font-sans">Figma</span>
                  <span className="text-[10px] bg-neutral-200/50 px-2.5 py-1 text-neutral-650 font-sans">TailwindCSS</span>
                  <span className="text-[10px] bg-neutral-200/50 px-2.5 py-1 text-neutral-650 font-sans">React</span>
                </div>
              </div>
            )}

            {activeShowcaseTheme === 'modern' && (
              <div className="bg-[#030616] text-[#e2e8f0] p-8 space-y-6 text-left min-h-[300px] relative overflow-hidden">
                <div className="absolute top-10 right-10 w-48 h-48 bg-violet-600/10 rounded-full blur-[40px] pointer-events-none" />
                <div className="space-y-1 relative z-10">
                  <h3 className="text-2xl font-extrabold bg-gradient-to-r from-white to-[#cbd5e1] bg-clip-text text-transparent">Davi Silva</h3>
                  <p className="text-xs font-semibold text-violet-400 tracking-wider">Desenvolvedor Full Stack</p>
                </div>
                <p className="text-sm leading-relaxed text-neutral-400 max-w-xl relative z-10 font-light">
                  Desenvolvedor focado no ecossistema do JavaScript e PHP. Especialista em construir aplicações escaláveis com alto desempenho e código limpo.
                </p>
                <div className="flex gap-2 relative z-10">
                  <span className="text-[10px] bg-white/5 border border-white/10 text-neutral-200 px-3 py-1 rounded-full">Next.js</span>
                  <span className="text-[10px] bg-white/5 border border-white/10 text-neutral-200 px-3 py-1 rounded-full">Laravel</span>
                  <span className="text-[10px] bg-white/5 border border-white/10 text-neutral-200 px-3 py-1 rounded-full">PostgreSQL</span>
                </div>
              </div>
            )}

            {activeShowcaseTheme === 'dark' && (
              <div className="bg-[#030303] text-[#cbd5e1] p-8 space-y-6 text-left min-h-[300px] font-mono relative">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d405_1px,transparent_1px),linear-gradient(to_bottom,#06b6d405_1px,transparent_1px)] bg-[size:20px_20px]" />
                <div className="space-y-1 relative z-10">
                  <h3 className="text-2xl font-bold text-white uppercase tracking-tight">João Santos</h3>
                  <p className="text-xs text-cyan-400 font-semibold">// DEVOPS & INFRASTRUCTURE</p>
                </div>
                <p className="text-xs leading-relaxed text-neutral-400 max-w-xl relative z-10 font-light">
                  Automatizando e escalando infraestruturas de nuvem. Apaixonado por CI/CD e cultura DevOps. Docker, Kubernetes e Terraform em ação no terminal.
                </p>
                <div className="flex gap-2 relative z-10 font-mono">
                  <span className="text-[10px] border border-cyan-500/20 text-cyan-400 bg-cyan-950/10 px-2 py-0.5">AWS</span>
                  <span className="text-[10px] border border-cyan-500/20 text-cyan-400 bg-cyan-950/10 px-2 py-0.5">TERRAFORM</span>
                  <span className="text-[10px] border border-cyan-500/20 text-cyan-400 bg-cyan-950/10 px-2 py-0.5">DOCKER</span>
                </div>
              </div>
            )}

            {activeShowcaseTheme === 'light' && (
              <div className="bg-[#fffdf5] text-[#1c1c1c] p-8 space-y-6 text-left min-h-[300px] font-sans">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight leading-none">Ana Costa</h3>
                  <span className="text-xs font-bold bg-[#fef08a] border border-neutral-950 px-2.5 py-0.5 rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] inline-block">Product Manager</span>
                </div>
                <p className="text-sm leading-relaxed text-neutral-700 max-w-xl font-medium">
                  Liderando equipes multidisciplinares para projetar, construir e lançar produtos SaaS excepcionais. Foco em métricas de negócios e UX refinada.
                </p>
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold border-2 border-neutral-950 bg-[#c084fc] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] px-3 py-1 rounded">Agile</span>
                  <span className="text-[10px] font-bold border-2 border-neutral-950 bg-[#4ade80] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] px-3 py-1 rounded">Analytics</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </section>

      {/* GitHub Sync Feature Detail */}
      <section className="max-w-6xl mx-auto px-6 py-20 sm:py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full border border-emerald-500/30 bg-emerald-950/15 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] sm:text-xs font-bold text-emerald-300 uppercase font-mono">
                GITHUB_SYNC_OK
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight">
              Conexão nativa com o ecossistema GitHub.
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed font-light">
              Importe seus repositórios em segundos. Nossa plataforma lê automaticamente suas descrições e links de homepage, mantendo seu portfólio sempre atualizado sem esforço de digitação redundante.
            </p>
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center gap-2.5 text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Importação em segundo plano usando filas do Redis.</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Filtro inteligente para selecionar quais projetos quer destacar.</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Sincronização imediata respeitando as diretrizes de rate-limit.</span>
              </div>
            </div>
          </div>

          {/* Right GitHub Mockup Visual */}
          <div className="lg:col-span-7 bg-black/40 border border-neutral-850 p-6 rounded-2xl relative shadow-lg">
            
            {/* Cyberpunk corner brackets */}
            <div className="absolute top-[-1px] left-[-1px] w-3 h-3 border-t border-l border-emerald-500/50" />
            <div className="absolute bottom-[-1px] right-[-1px] w-3 h-3 border-b border-r border-emerald-500/50" />
            
            <div className="space-y-6 text-left">
              {/* Profile Card Mock */}
              <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-neutral-900 flex items-center justify-center text-emerald-400 border border-neutral-850">
                    <GithubIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-250">Conectar conta do GitHub</p>
                    <p className="text-[10px] text-neutral-500 font-mono">api.github.com/users/davi/repos</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 font-mono rounded">
                  CONECTADO
                </span>
              </div>

              {/* Languages bar mockup */}
              <div className="space-y-2">
                <p className="text-[10px] font-mono text-neutral-500 uppercase">Linguagens mais utilizadas</p>
                <div className="h-2.5 rounded-full overflow-hidden flex bg-neutral-900 border border-neutral-850">
                  <span className="bg-violet-500 h-full w-[45%]" title="TypeScript" />
                  <span className="bg-[#4f5d95] h-full w-[30%]" title="PHP" />
                  <span className="bg-[#f1e05a] h-full w-[15%]" title="JavaScript" />
                  <span className="bg-[#e34c26] h-full w-[10%]" title="HTML/CSS" />
                </div>
                <div className="flex flex-wrap gap-4 text-[10px] font-mono text-neutral-400 pt-1">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-violet-500" />TypeScript (45%)</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#4f5d95]" />PHP (30%)</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#f1e05a]" />JavaScript (15%)</span>
                </div>
              </div>

              {/* GitHub contribution calendar mock grid */}
              <div className="space-y-2">
                <p className="text-[10px] font-mono text-neutral-550 uppercase">Calendário de Contribuições (Mock)</p>
                <div className="grid grid-cols-12 sm:grid-cols-24 gap-1 select-none">
                  {Array.from({ length: 48 }).map((_, idx) => {
                    const intensities = ['bg-neutral-900', 'bg-emerald-950/60', 'bg-emerald-900/80', 'bg-emerald-600', 'bg-emerald-500'];
                    const bgClass = intensities[Math.floor(Math.random() * intensities.length)];
                    return (
                      <div key={idx} className={`w-3.5 h-3.5 rounded-sm border border-neutral-950 ${bgClass}`} />
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* PDF Resume Feature Detail */}
      <section className="max-w-6xl mx-auto px-6 py-20 sm:py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Mockup Resume Visual */}
          <div className="lg:col-span-7 bg-[#0c0d14]/75 border border-neutral-850 p-6 sm:p-8 rounded-2xl shadow-xl order-2 lg:order-1 text-left">
            <div className="bg-white text-neutral-900 p-6 sm:p-8 shadow-inner border border-neutral-200 relative min-h-[360px] flex flex-col justify-between font-serif">
              {/* ATS Resume simulation */}
              <div>
                {/* Header */}
                <div className="border-b-2 border-neutral-900 pb-3 text-center space-y-1">
                  <h3 className="text-xl font-bold tracking-tight font-serif uppercase">Davi Silva</h3>
                  <p className="text-xs font-sans text-neutral-600">São Paulo, SP | devfolio.com/davi | davi@example.com</p>
                </div>
                
                {/* Sections */}
                <div className="pt-4 space-y-4">
                  <div className="space-y-1.5">
                    <h4 className="text-[11px] font-bold font-sans uppercase tracking-wider text-neutral-700 border-b border-neutral-200 pb-0.5">Experiência Profissional</h4>
                    <div className="text-[10px] font-sans space-y-1">
                      <p className="font-bold flex justify-between"><span>Desenvolvedor Full Stack Sênior @ Stripe</span> <span className="font-normal text-neutral-500">2024 - Atual</span></p>
                      <p className="text-neutral-600 leading-relaxed font-light">Responsável pelo desenvolvimento de APIs de pagamento de alto volume e otimização de consultas de banco de dados.</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-[11px] font-bold font-sans uppercase tracking-wider text-neutral-700 border-b border-neutral-200 pb-0.5">Educação</h4>
                    <div className="text-[10px] font-sans flex justify-between">
                      <p className="font-bold"><span>Bacharelado em Engenharia de Software @ USP</span></p>
                      <span className="text-neutral-500">2020 - 2024</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-[11px] font-bold font-sans uppercase tracking-wider text-neutral-700 border-b border-neutral-200 pb-0.5">Competências Principais</h4>
                    <p className="text-[10px] font-sans text-neutral-600">TypeScript, React, Next.js, Laravel, PHP, Node.js, PostgreSQL, Docker, Redis.</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-neutral-200 pt-3 flex items-center justify-between text-[9px] font-sans text-neutral-400">
                <span>Gerado automaticamente via devfolio.com</span>
                <span>Página 1 de 1</span>
              </div>
            </div>
          </div>

          {/* Right Text */}
          <div className="lg:col-span-5 space-y-6 text-left order-1 lg:order-2">
            <div className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full border border-pink-500/30 bg-pink-950/15 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
              <span className="text-[10px] sm:text-xs font-bold text-pink-300 uppercase font-mono">
                ATS_COMPLIANT
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight">
              Seu portfólio online, pronto para impressão.
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed font-light">
              Gere um currículo estruturado e elegante em PDF com apenas um clique. O arquivo gerado respeita todas as regras de formatação exigidas pelos sistemas ATS (de triagem automática de grandes empresas), otimizando suas chances em entrevistas.
            </p>
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center gap-2.5 text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                <span>Atualização automática: mudou o site, o PDF muda também.</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                <span>Geração controlada via Chromium headless isolado em fila.</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                <span>Layout limpo que prioriza a leitura de dados de recrutamento.</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Testimonials (Depoimentos) */}
      <section className="max-w-6xl mx-auto px-6 py-20 sm:py-28 space-y-16 relative z-10">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-cyan-400">Depoimentos</h2>
          <p className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            O que dizem os profissionais de tecnologia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Testimonial 1 */}
          <div className="p-6 rounded-2xl bg-[#090a12]/50 border border-neutral-850 flex flex-col justify-between space-y-6">
            <p className="text-xs sm:text-sm text-neutral-300 italic leading-relaxed font-light">
              &ldquo;O DevFolio facilitou demais a minha vida. Sincronizei meu GitHub e em menos de 10 minutos tinha um portfólio no ar com uma estética incrível. Recebi convites de recruiters no LinkedIn na primeira semana de uso!&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-violet-500/20 flex items-center justify-center font-bold text-violet-400 text-xs">
                TS
              </div>
              <div>
                <p className="text-xs font-bold text-white">Thiago Silva</p>
                <p className="text-[10px] text-neutral-500">Engenheiro de Software @ Nubank</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="p-6 rounded-2xl bg-[#090a12]/50 border border-neutral-850 flex flex-col justify-between space-y-6">
            <p className="text-xs sm:text-sm text-neutral-300 italic leading-relaxed font-light">
              &ldquo;Poder gerar um currículo em PDF formatado a partir dos mesmos dados da minha página web é genial. Toda vez que atualizo um projeto no site, não preciso reescrever meu PDF. O tema Neobrutalista é simplesmente espetacular.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-cyan-500/20 flex items-center justify-center font-bold text-cyan-400 text-xs">
                MC
              </div>
              <div>
                <p className="text-xs font-bold text-white">Mariana Costa</p>
                <p className="text-[10px] text-neutral-500">Desenvolvedora Frontend Freelancer</p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="p-6 rounded-2xl bg-[#090a12]/50 border border-neutral-850 flex flex-col justify-between space-y-6">
            <p className="text-xs sm:text-sm text-neutral-300 italic leading-relaxed font-light">
              &ldquo;Como Tech Lead, valorizo portfólios diretos ao ponto, que mostram código no GitHub e links de demo funcionais. O DevFolio padroniza isso de um jeito muito elegante. Uso e indico para todos os devs do meu time.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-pink-500/20 flex items-center justify-center font-bold text-pink-400 text-xs">
                LL
              </div>
              <div>
                <p className="text-xs font-bold text-white">Lucas Lima</p>
                <p className="text-[10px] text-neutral-500">Tech Lead @ Mercado Livre</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-20 sm:py-28 space-y-12 relative z-10 scroll-mt-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-violet-400">FAQ</h2>
          <p className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Perguntas Frequentes
          </p>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="border border-neutral-850 rounded-xl overflow-hidden bg-[#090a12]/40 backdrop-blur-sm transition-all"
            >
              <button 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left px-6 py-4 flex items-center justify-between text-sm sm:text-base font-semibold text-neutral-200 hover:text-white cursor-pointer"
              >
                <span>{faq.question}</span>
                <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180 text-violet-400' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-neutral-400 leading-relaxed font-light border-t border-neutral-900 bg-neutral-950/20 animate-in fade-in slide-in-from-top-2 duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-6xl mx-auto px-6 py-16 sm:py-24 relative z-10 text-center">
        <div className="relative p-8 sm:p-16 rounded-3xl border border-neutral-850 bg-gradient-to-br from-[#0c0d16]/80 via-black/80 to-[#07080e]/80 overflow-hidden">
          
          {/* Accent lighting for CTA card */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-violet-600/20 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="space-y-6 max-w-2xl mx-auto relative z-10">
            <h2 className="text-2xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Construa sua presença profissional hoje.
            </h2>
            <p className="text-xs sm:text-base text-neutral-400 leading-relaxed font-light">
              Junte-se a centenas de profissionais de tecnologia que estão transformando currículos tradicionais em experiências digitais de alto impacto.
            </p>
            <div className="pt-4">
              <Link 
                href="/register" 
                className="w-full sm:w-auto bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm py-3.5 px-8 rounded-xl shadow-[0_8px_30px_rgba(139,92,246,0.35)] hover:scale-[1.02] transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                Começar Gratuitamente
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-[#020204] relative z-10 py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-4 gap-8 text-left">
          
          {/* Logo & Copyright */}
          <div className="space-y-4 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-extrabold shadow-md">
                D
              </span>
              <span className="font-extrabold text-md tracking-tight text-white">
                DevFolio
              </span>
            </Link>
            <p className="text-[10px] text-neutral-600 leading-relaxed">
              O gerador de portfólio automatizado definitivo para desenvolvedores e profissionais de TI.<br />
              &copy; {new Date().getFullYear()} DevFolio. Todos os direitos reservados.
            </p>
          </div>

          {/* Column 2 */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-neutral-300">Produto</h4>
            <ul className="space-y-2 text-neutral-500">
              <li><a href="#recursos" className="hover:text-neutral-300 transition-colors">Recursos</a></li>
              <li><a href="#como-funciona" className="hover:text-neutral-300 transition-colors">Como Funciona</a></li>
              <li><a href="#showcase" className="hover:text-neutral-300 transition-colors">Temas</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-neutral-300">Segurança & Legal</h4>
            <ul className="space-y-2 text-neutral-500">
              <li><a href="#" className="hover:text-neutral-300 transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-neutral-300 transition-colors">Privacidade (LGPD)</a></li>
              <li><a href="#" className="hover:text-neutral-300 transition-colors">Segurança de Dados</a></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-neutral-300">Conecte-se</h4>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-neutral-950 border border-neutral-900 text-neutral-500 hover:text-white rounded transition-colors">
                <GithubIcon className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="p-2 bg-neutral-950 border border-neutral-900 text-neutral-500 hover:text-white rounded transition-colors">
                <LinkedinIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
