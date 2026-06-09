'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  FolderGit2, 
  ArrowRight, 
  Menu, 
  X, 
  Sparkles, 
  Scale, 
  Award, 
  Compass, 
  Share2, 
  Terminal, 
  CheckCircle2, 
  RefreshCw,
  Zap
} from 'lucide-react';
import DeveloperCard from '@/components/developer-card';
import { getRarityTier } from '@/features/gamification/lib/calculate-tier';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Perfil mockado de alta fidelidade para demonstrar o card interativo na Landing Page
  const demoProfile = {
    id: "ana-costa-demo",
    name: "Ana Costa",
    username: "anacosta",
    avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=ana",
    role: "React Specialist",
    bio: "Desenvolvedora Frontend apaixonada por Next.js, interfaces fluidas e animações de alto nível. Tech lead de interfaces no DevFolio.",
    ovr: 88, // Diamond Tier
    level: 12,
    xp: 4520,
    profile_completeness: 94,
    badges: [
      { id: "b1", name: "React Specialist", description: "Construa 5 interfaces modernas com React/Next.js.", icon_path: "star" },
      { id: "b2", name: "Open Source Hero", description: "Conecte sua conta e realize contribuições públicas no GitHub.", icon_path: "github" },
      { id: "b3", name: "Docker Commander", description: "Configure infraestrutura com Docker em 3 projetos.", icon_path: "projects" }
    ]
  };

  const opponentProfile = {
    id: "davi-silva-demo",
    name: "Davi Silva",
    username: "davisilva",
    avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=davi",
    role: "Backend Architect",
    bio: "Tech Lead focado em APIs de alta escalabilidade com Laravel, microserviços em Docker e infraestrutura AWS Cloud.",
    ovr: 82, // Gold Tier
    level: 9,
    xp: 2200,
    profile_completeness: 88,
    badges: [
      { id: "b4", name: "Laravel Master", description: "Crie 5 projetos usando o ecossistema Laravel.", icon_path: "star" },
      { id: "b5", name: "Docker Commander", description: "Configure infraestrutura com Docker em 3 projetos.", icon_path: "projects" }
    ]
  };

  const faqs = [
    {
      question: "Como o meu OVR é calculado?",
      answer: "O seu OVR (Score Geral) é calculado por um algoritmo ponderado transparente baseado em 6 pilares: sua Experiência Profissional, o número e a completude dos seus Projetos, suas Habilidades ativas, sua atividade no GitHub, sua Formação Acadêmica e o percentual de preenchimento do seu Perfil."
    },
    {
      question: "Como posso subir de nível?",
      answer: "Cada ação na plataforma (adicionar bio, cadastrar um projeto, conectar redes sociais) concede pontos de XP de acordo com uma lista fixa de recompensas. O XP necessário para subir de nível segue uma curva progressiva: XP = 100 * (Level ^ 1.5)."
    },
    {
      question: "O DevFolio é gratuito?",
      answer: "Sim! Oferecemos um plano gratuito completo onde você pode criar seu perfil, gerar seu Developer Card, sincronizar seus projetos com o GitHub e acompanhar seu OVR. Temos também planos Premium adicionais com temas exclusivos e domínios personalizados."
    },
    {
      question: "Os recrutadores conseguem ver minhas notas de OVR?",
      answer: "Sim! O seu Developer Card e o seu portfólio público exibem o seu OVR e seu histórico de evolução. Isso ajuda recrutadores a entenderem rapidamente seus eixos técnicos de destaque de forma simplificada."
    }
  ];

  return (
    <div className="bg-[#050508] text-[#f1f5f9] min-h-screen relative overflow-x-hidden font-sans antialiasedSelection">
      
      {/* Background glow blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-violet-600/10 rounded-full blur-[100px] sm:blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-[800px] right-1/4 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-indigo-500/5 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[400px] left-10 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      
      {/* Grid pattern overlay */}
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
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <a href="#card-rarity" className="hover:text-white transition-colors">O Card</a>
            <a href="#ovr-system" className="hover:text-white transition-colors">Sistema OVR</a>
            <a href="#vs-mode" className="hover:text-white transition-colors">Duelo VS</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-neutral-400 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link 
              href="/register" 
              className="bg-violet-650 hover:bg-violet-600 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-[0_4px_20px_rgba(139,92,246,0.25)] transition-all hover:scale-[1.02] cursor-pointer"
            >
              Começar Grátis
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
              <a href="#card-rarity" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1 transition-colors">O Card</a>
              <a href="#ovr-system" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1 transition-colors">Sistema OVR</a>
              <a href="#vs-mode" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1 transition-colors">Duelo VS</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1 transition-colors">FAQ</a>
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
                className="bg-violet-650 hover:bg-violet-600 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-[0_4px_20px_rgba(139,92,246,0.2)] text-center cursor-pointer"
              >
                Começar Grátis
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto px-6 pt-28 sm:pt-36 pb-20 text-left z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Esquerda: Conteúdo Publicitário */}
          <div className="lg:col-span-7 space-y-8">
            {/* Glow pill badge */}
            <div className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-full border border-violet-500/30 bg-violet-950/15 backdrop-blur-sm shadow-[0_0_15px_rgba(139,92,246,0.1)]">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-[10px] sm:text-xs font-bold text-violet-300 tracking-wider uppercase">
                O Primeiro RPG de Carreira para Desenvolvedores
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] bg-gradient-to-b from-white via-white to-[#94a3b8] bg-clip-text text-transparent">
                Seu portfólio virou um <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">RPG de Carreira.</span>
              </h1>
              <p className="text-sm sm:text-lg text-neutral-400 max-w-xl leading-relaxed font-light">
                Conecte seu GitHub para gerar seu Developer Card interativo em 3D. Evolua seu OVR preenchendo sua jornada de engenharia, complete missões e desbloqueie badges de prestígio verificados pelo mercado.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link 
                href="/register" 
                className="w-full sm:w-auto bg-violet-650 hover:bg-violet-600 text-white font-bold text-sm py-3.5 px-8 rounded-xl shadow-[0_8px_30px_rgba(139,92,246,0.35)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                ⚔️ Começar meu RPG de Carreira (Grátis)
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a 
                href="#vs-mode" 
                className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-200 font-bold text-sm py-3.5 px-8 rounded-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
              >
                🏆 Ver Leaderboards
              </a>
            </div>
          </div>

          {/* Direita: Developer Card 3D Vivo */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative group">
            {/* Glow de fundo atrás do card */}
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/10 to-cyan-500/10 rounded-3xl blur-2xl opacity-80 pointer-events-none" />
            
            <DeveloperCard profile={demoProfile} showDetails={false} />
            
            <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mt-4 flex items-center gap-1.5 animate-pulse select-none">
              🖱️ Passe o mouse para inclinar 3D • Clique para virar
            </div>
          </div>

        </div>
      </section>

      {/* Seção 2: Raridades dos Cards */}
      <section id="card-rarity" className="max-w-6xl mx-auto px-6 py-20 border-t border-neutral-900 relative z-10 scroll-mt-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-violet-400">Prestígio Visual</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Evolua a moldura do seu sucesso técnico.
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed font-light">
            Seu cartão de visitas digital muda de tier de acordo com seu OVR. Do rústico Bronze ao majestoso Lendário.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Bronze */}
          <div className="bg-neutral-950/40 border border-neutral-900 p-5 rounded-2xl space-y-3">
            <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-amber-700/15 border border-amber-800/20 text-orange-400">
              Bronze Tier (OVR &lt; 65)
            </span>
            <h3 className="text-sm font-extrabold text-white">Forjado no Ferro</h3>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              O ponto de partida da sua jornada. Moldura sólida e fosca representando seus primeiros commits.
            </p>
          </div>

          {/* Silver */}
          <div className="bg-neutral-950/40 border border-neutral-900 p-5 rounded-2xl space-y-3">
            <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-slate-400/15 border border-slate-500/20 text-slate-300">
              Prata Tier (65 - 74)
            </span>
            <h3 className="text-sm font-extrabold text-white">Lapidado no Aço</h3>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              Brilho prateado acetinado, liberando o direito de destacar medalhas físicas no rodapé do seu card.
            </p>
          </div>

          {/* Gold */}
          <div className="bg-neutral-950/40 border border-neutral-900 p-5 rounded-2xl space-y-3">
            <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-yellow-500/15 border border-yellow-500/20 text-yellow-400">
              Ouro Tier (75 - 84)
            </span>
            <h3 className="text-sm font-extrabold text-white">Prestígio Polido</h3>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              Aura dourada brilhante de prestígio imediato para processos seletivos e visibilidade no leaderboard.
            </p>
          </div>

          {/* Diamond */}
          <div className="bg-neutral-950/40 border border-neutral-900 p-5 rounded-2xl space-y-3">
            <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/20 text-cyan-400">
              Diamante Tier (85 - 94)
            </span>
            <h3 className="text-sm font-extrabold text-white">Refração Glacial</h3>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              Moldura ciano néon com efeito de refração holográfica interativo que acompanha a rotação do mouse.
            </p>
          </div>

          {/* Legendary */}
          <div className="bg-neutral-950/40 border border-neutral-900 p-5 rounded-2xl space-y-3">
            <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-purple-500/15 border border-purple-500/20 text-purple-400">
              Lendário Tier (OVR 95+)
            </span>
            <h3 className="text-sm font-extrabold text-white">Singularidade</h3>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              Moldura animada com rotação cromática 360° e efeito de pulsação de aura neon cósmica.
            </p>
          </div>
        </div>
      </section>

      {/* Seção 3: Sistema OVR */}
      <section id="ovr-system" className="max-w-6xl mx-auto px-6 py-20 border-t border-neutral-900 relative z-10 scroll-mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Esquerda: Detalhes do Radar Chart */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold font-mono uppercase tracking-widest text-cyan-400">Algoritmo Transparente</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Seus eixos técnicos medidos com precisão.
            </h2>
            <p className="text-neutral-450 text-sm leading-relaxed font-light">
              Chega de scores obscuros. A reputação do DevFolio calcula sua classificação com base na atividade real do seu perfil, dividida em 6 pesos ajustáveis auditados pelo sistema.
            </p>

            <div className="space-y-4 text-xs font-medium text-neutral-300">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-white">Histórico de Trabalho (OVR 30%):</span> Meses acumulados de experiências no mercado de tecnologia.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-white">Projetos Ativos (OVR 25%):</span> Quantidade, links e qualidade de seus repositórios listados.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-white">Conexão GitHub (OVR 15%):</span> Commits diários sincronizados nativamente.
                </div>
              </div>
            </div>
          </div>

          {/* Direita: Interface Simulando o Detalhamento */}
          <div className="lg:col-span-7 bg-neutral-900/10 border border-neutral-900 p-6 rounded-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-850 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-6">
              <span>Painel de Auditoria de Atributos</span>
              <span className="text-[10px] font-mono text-cyan-400">// CALC_ENGINE_OK</span>
            </div>

            <div className="space-y-4 text-xs font-medium">
              <div className="space-y-1">
                <div className="flex justify-between text-neutral-400">
                  <span>Backend (PHP, C#, Node)</span>
                  <span className="text-white font-bold">82 / 100</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-950 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full" style={{ width: '82%' }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-neutral-400">
                  <span>Frontend (Next, React, Tailwind)</span>
                  <span className="text-white font-bold">74 / 100</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-950 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full" style={{ width: '74%' }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-neutral-400">
                  <span>DevOps & Infraestrutura (Docker, AWS)</span>
                  <span className="text-white font-bold">80 / 100</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-950 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full" style={{ width: '80%' }} />
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-neutral-950/60 border border-neutral-850 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 animate-pulse" />
              <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
                💡 <span className="font-bold text-white">Dica de Evolução:</span> Conecte repositórios frontend no GitHub para elevar seu score de Frontend de 74 para 80 e evoluir o OVR total da sua carta.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Seção 4: Duelo VS Comparador */}
      <section id="vs-mode" className="max-w-6xl mx-auto px-6 py-20 border-t border-neutral-900 relative z-10 scroll-mt-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-violet-400">Batalha de Atributos</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Compare seu nível técnico lado a lado.
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed font-light">
            Selecione dois desenvolvedores para cruzar suas cartas, Tiers de raridade e sub-scores em duelos visuais instantâneos.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row justify-center items-center gap-10">
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-bold tracking-widest text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full mb-3 uppercase">
              Desafiante A
            </span>
            <DeveloperCard profile={demoProfile} showDetails={false} />
          </div>

          {/* Duelo Badge */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-black text-white text-lg border-2 border-neutral-950 shadow-lg shadow-violet-950/20 animate-pulse">
              VS
            </div>
            <span className="text-[10px] font-bold font-mono text-neutral-550 uppercase tracking-widest">Atributos Cruzados</span>
            <Link 
              href="/compare?users=anacosta,davisilva" 
              className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1"
            >
              Testar Simulador
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[9px] font-bold tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full mb-3 uppercase">
              Desafiante B
            </span>
            <DeveloperCard profile={opponentProfile} showDetails={false} />
          </div>
        </div>
      </section>

      {/* Seção 5: Conquistas & Loops de Compartilhamento */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-neutral-900 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Esquerda: Loops Virais */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full border border-violet-500/30 bg-violet-950/15">
              <Share2 className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-[10px] font-bold text-violet-300 uppercase font-mono">
                Loops de Crescimento
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Construa sua marca pessoal com Loops Virais.
            </h2>
            <p className="text-neutral-450 text-sm leading-relaxed font-light">
              Compartilhe seu Developer Card dinamicamente no LinkedIn ou Twitter/X. O card gera automaticamente um link de desafio com efeito "VS" que atrai outros desenvolvedores para tentarem bater seu score OVR.
            </p>

            <div className="grid grid-cols-2 gap-4 text-xs font-medium border-t border-neutral-900 pt-6">
              <div className="space-y-1">
                <span className="text-white font-extrabold flex items-center gap-1">
                  <Zap className="w-4 h-4 text-amber-500" /> Embed de README
                </span>
                <p className="text-neutral-400 font-light">Adicione seu card dinâmico no topo do seu perfil do GitHub.</p>
              </div>
              <div className="space-y-1">
                <span className="text-white font-extrabold flex items-center gap-1">
                  <Award className="w-4 h-4 text-violet-400" /> Álbum de Badges
                </span>
                <p className="text-neutral-400 font-light">Fixe suas medalhas mais raras em destaque no LinkedIn.</p>
              </div>
            </div>
          </div>

          {/* Direita: Mockup do LinkedIn Post */}
          <div className="lg:col-span-6 bg-neutral-900/10 border border-neutral-900 p-6 rounded-2xl text-left">
            <div className="flex items-center gap-3 border-b border-neutral-850 pb-4 mb-4">
              <div className="w-9 h-9 rounded-full bg-violet-500/20 flex items-center justify-center font-bold text-xs text-violet-400">AC</div>
              <div>
                <p className="text-xs font-bold text-white">Ana Costa</p>
                <p className="text-[9px] text-neutral-500">React Specialist • Postado no LinkedIn</p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed font-medium italic mb-4">
              "Acabo de atingir o Tier Diamante no DevFolio com OVR 88! Sincronizei minha conta e mostrei meu nível real. Duvido você bater meu score de Frontend. Compare seu card com o meu aqui: devfolio.com/compare/vs/anacosta"
            </p>

            {/* Simulated shared card preview */}
            <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-850 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold font-mono text-violet-400 uppercase tracking-widest">Duelo DevFolio</p>
                <p className="text-xs font-extrabold text-white">Batalhar contra @anacosta</p>
                <p className="text-[9px] text-neutral-500">Conecte seu GitHub para comparar seu OVR.</p>
              </div>
              <div className="px-3 py-2 rounded-lg bg-violet-650 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 select-none">
                Batalhar <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-20 border-t border-neutral-900 relative z-10 scroll-mt-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-violet-400">FAQ</span>
          <h2 className="text-3xl font-extrabold text-white">Perguntas Frequentes</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isSelected = activeFaq === index;
            return (
              <div 
                key={index} 
                className="bg-neutral-950/40 border border-neutral-900 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(isSelected ? null : index)}
                  className="w-full px-6 py-4.5 text-left text-sm font-extrabold text-white flex justify-between items-center hover:bg-neutral-900/35 outline-none transition-colors"
                >
                  {faq.question}
                  <ChevronRightIcon className={`w-4 h-4 text-neutral-500 transition-transform duration-300 ${isSelected ? 'rotate-90' : ''}`} />
                </button>
                {isSelected && (
                  <div className="px-6 pb-5 text-xs text-neutral-400 leading-relaxed font-light border-t border-neutral-900/60 pt-4 animate-in fade-in duration-300">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center relative z-10">
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-neutral-900/80 to-[#07080e]/95 border border-neutral-850 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/5 to-cyan-500/5 rounded-3xl blur-xl opacity-60 pointer-events-none" />
          
          <div className="space-y-6 max-w-xl mx-auto relative z-10">
            <TrophyIcon className="w-12 h-12 text-violet-500 mx-auto animate-bounce" style={{ animationDuration: '4s' }} />
            <h2 className="text-3xl font-black text-white tracking-tight">Forje sua reputação hoje mesmo.</h2>
            <p className="text-neutral-400 text-sm leading-relaxed font-light">
              Junte-se a milhares de desenvolvedores no RPG de Carreira. Gere seu card, suba na leaderboard e conquiste visibilidade real.
            </p>
            <Link 
              href="/register" 
              className="inline-flex items-center gap-1.5 bg-violet-650 hover:bg-violet-600 text-white font-bold text-sm py-4 px-8 rounded-xl shadow-md shadow-violet-950/20 hover:scale-[1.02] transition-all cursor-pointer"
            >
              Começar meu RPG de Carreira (Grátis)
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900/60 bg-[#050508]/80 py-8 relative z-10 text-xs text-neutral-600">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">D</span>
            <span className="font-extrabold text-neutral-450">DevFolio</span>
          </div>
          <p>© 2026 DevFolio Gamified. Feito com paixão por e para desenvolvedores.</p>
        </div>
      </footer>

    </div>
  );
}

// Icon helper components
function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function TrophyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
      <path d="M12 2a6 6 0 0 1 6 6v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z" />
    </svg>
  );
}
