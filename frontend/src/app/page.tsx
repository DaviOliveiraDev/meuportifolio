'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { 
  ArrowRight, 
  Menu, 
  X, 
  Sparkles, 
  Scale, 
  Award, 
  Share2, 
  Terminal, 
  CheckCircle2, 
  Zap,
  Play,
  Layers,
  ChevronRight,
  TrendingUp,
  ShieldAlert,
  Users,
  Search,
  Trophy,
  Compass
} from 'lucide-react';
import DeveloperCard, { ProfileType } from '@/components/developer-card';
import { getRarityTier } from '@/features/gamification/lib/calculate-tier';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Controle de preview de elos (Valorant style)
  const [selectedPreviewTier, setSelectedPreviewTier] = useState<number>(3); // Diamond default
  const [selectedExploreTag, setSelectedExploreTag] = useState<string>("All");

  // Perfis mockados de alta fidelidade para demonstrar o card interativo
  const demoProfile: ProfileType = {
    id: "ana-costa-demo",
    name: "Ana Costa",
    username: "anacosta",
    avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=ana",
    role: "React Specialist",
    bio: "Tech Lead no DevFolio. Apaixonada por Next.js, interfaces fluidas e micro-animações.",
    ovr: 88, // Diamond Tier
    level: 12,
    xp: 4520,
    profile_completeness: 94,
    badges: [
      { id: "b1", name: "React Specialist", description: "Construa 5 interfaces modernas com React/Next.js.", icon_path: "star" },
      { id: "b2", name: "Open Source Hero", description: "Conecte sua conta e realize contribuições públicas no GitHub.", icon_path: "github" },
      { id: "b3", name: "Docker Commander", description: "Configure infraestrutura com Docker em 3 projetos.", icon_path: "projects" }
    ],
    technology_scores: [
      { technology_id: "react", technology: { name: "React", slug: "react" }, score: 92, confidence_level: "Expert" as const, evidence_count: 8 },
      { technology_id: "nextjs", technology: { name: "Next.js", slug: "nextjs" }, score: 90, confidence_level: "Expert" as const, evidence_count: 6 },
      { technology_id: "typescript", technology: { name: "TypeScript", slug: "typescript" }, score: 85, confidence_level: "Proven" as const, evidence_count: 4 }
    ],
    custom_styles: {
      border_theme: 'default' as const,
      foil_effect: 'diamond' as const,
      pinned_badges: ["b1", "b2", "b3"],
      card_slots: {
        slot_1: "top_technology" as const,
        slot_2: "top_3_technologies" as const,
        slot_3: "projects_count" as const,
        slot_4: "education_degree" as const,
        slot_5: "github_combined" as const
      }
    }
  };

  const opponentProfile: ProfileType = {
    id: "davi-silva-demo",
    name: "Davi Silva",
    username: "davisilva",
    avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=davi",
    role: "Backend Architect",
    bio: "Tech Lead focado em APIs de alta escalabilidade com Laravel, Docker e AWS Cloud.",
    ovr: 82, // Gold Tier
    level: 9,
    xp: 2200,
    profile_completeness: 88,
    badges: [
      { id: "b4", name: "Laravel Master", description: "Crie 5 projetos usando o ecossistema Laravel.", icon_path: "star" },
      { id: "b5", name: "Docker Commander", description: "Configure infraestrutura com Docker em 3 projetos.", icon_path: "projects" }
    ],
    technology_scores: [
      { technology_id: "laravel", technology: { name: "Laravel", slug: "laravel" }, score: 88, confidence_level: "Proven" as const, evidence_count: 5 },
      { technology_id: "php", technology: { name: "PHP", slug: "php" }, score: 85, confidence_level: "Proven" as const, evidence_count: 7 },
      { technology_id: "postgresql", technology: { name: "PostgreSQL", slug: "postgresql" }, score: 80, confidence_level: "Verified" as const, evidence_count: 3 }
    ],
    custom_styles: {
      border_theme: 'default' as const,
      foil_effect: 'gold' as const,
      pinned_badges: ["b4", "b5"],
      card_slots: {
        slot_1: "top_technology" as const,
        slot_2: "top_3_technologies" as const,
        slot_3: "experience_years" as const,
        slot_4: "education_degree" as const,
        slot_5: "github_combined" as const
      }
    }
  };

  // 3D Parallax Mouse Tracking
  const heroRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const springConfig = { damping: 30, stiffness: 180, mass: 1 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);

  // Parallax layers
  const floatX1 = useTransform(mouseX, [-300, 300], [-25, 25]);
  const floatY1 = useTransform(mouseY, [-300, 300], [-25, 25]);
  const floatX2 = useTransform(mouseX, [-300, 300], [30, -30]);
  const floatY2 = useTransform(mouseY, [-300, 300], [30, -30]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = e.clientX - rect.left - width / 2;
    const y = e.clientY - rect.top - height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const TIERS_INFO = [
    {
      index: 0,
      key: 'bronze',
      name: 'Bronze',
      ovrRange: '< 65',
      previewOvr: 55,
      gradient: 'from-amber-700 via-orange-800 to-amber-900',
      textColor: 'text-orange-400',
      description: 'O início da jornada técnica. Visual rústico em cobre, focado na solidez das primeiras experiências.',
      perk: 'Borda opaca de metal bruto'
    },
    {
      index: 1,
      key: 'silver',
      name: 'Silver',
      ovrRange: '65 - 74',
      previewOvr: 70,
      gradient: 'from-slate-300 via-zinc-400 to-slate-500',
      textColor: 'text-slate-350',
      description: 'Lapidação profissional. O card ganha acabamento em aço cromado com shimmer reativo ao mouse.',
      perk: 'Reflexo Shimmer metálico vertical'
    },
    {
      index: 2,
      key: 'gold',
      name: 'Gold',
      ovrRange: '75 - 84',
      previewOvr: 80,
      gradient: 'from-amber-400 via-yellow-500 to-amber-600',
      textColor: 'text-amber-400',
      description: 'Destaque no mercado. Moldura banhada a ouro polido com emissão constante de luz e aura âmbar.',
      perk: 'Emissão constante de brilho (Glow)'
    },
    {
      index: 3,
      key: 'diamond',
      name: 'Diamond',
      ovrRange: '85 - 94',
      previewOvr: 90,
      gradient: 'from-cyan-400 via-indigo-500 to-purple-600',
      textColor: 'text-cyan-300',
      description: 'Elite de engenharia. Efeito prismático com refração holográfica (foil) que segue o movimento do cursor.',
      perk: 'Refração de luz holográfica interativa'
    },
    {
      index: 4,
      key: 'legendary',
      name: 'Legendary',
      ovrRange: '95+',
      previewOvr: 98,
      gradient: 'from-purple-600 via-pink-600 to-amber-500',
      textColor: 'text-pink-400',
      description: 'Singularidade absoluta. O cume do DevFolio. Moldura animada em rotação de cores e pulsação de aura.',
      perk: 'Aura viva com rotação cromática 360°'
    }
  ];

  const selectedTier = TIERS_INFO[selectedPreviewTier];

  const faqs = [
    {
      question: "Como o meu OVR é calculado no DNA 2.0?",
      answer: "O seu OVR (Overall Rating) é calculado dinamicamente com base nas suas pontuações de tecnologia verificadas por IA e pesos ajustados no backend. O sistema avalia sua consistência de código, complexidade de projetos no GitHub, tempo de trabalho real listado nas experiências e suas conquistas gerais."
    },
    {
      question: "O que são as tecnologias 'Verified' e 'Proven' no card?",
      answer: "Tecnologias declaradas passam por análise de evidências. 'Verified' indica que você possui projetos listados com a stack. 'Proven' e 'Expert' são concedidos com base no volume de commits, histórico de trabalho e badges de proficiência validados pela plataforma."
    },
    {
      question: "O DevFolio substitui meu portfólio tradicional?",
      answer: "Não apenas substitui, mas eleva. Ele reúne em uma única página um portfólio visual limpo com a credibilidade de um card de atributos interativo e auditável, ideal para ser compartilhado com recrutadores e colocado no README do seu GitHub."
    },
    {
      question: "Como funciona o modo de comparação (Duelo VS)?",
      answer: "Permite cruzar as estatísticas técnicas de dois desenvolvedores em tempo real. O comparador avalia os scores de Frontend, Backend, DevOps e Comunidade, destacando qual profissional tem maior dominância em cada área de forma 100% visual."
    }
  ];

  const exploreMockProfiles = [
    {
      name: "Ana Costa",
      role: "React Specialist",
      ovr: 88,
      tier: "Diamond",
      skills: ["React", "Next.js", "TypeScript"],
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=ana"
    },
    {
      name: "Davi Silva",
      role: "Backend Architect",
      ovr: 82,
      tier: "Gold",
      skills: ["Laravel", "PHP", "Docker"],
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=davi"
    },
    {
      name: "Carla Souza",
      role: "DevOps Engineer",
      ovr: 91,
      tier: "Diamond",
      skills: ["AWS", "Docker", "TypeScript"],
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=carla"
    },
    {
      name: "Julia Lima",
      role: "Frontend Engineer",
      ovr: 76,
      tier: "Gold",
      skills: ["React", "TypeScript"],
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=julia"
    }
  ];

  const leaderboardMockProfiles = [
    { rank: 1, name: "Carla Souza", role: "DevOps Engineer", ovr: 91, tier: "Diamond", xp: "14.2k XP", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=carla", gradient: "from-cyan-400 to-indigo-500" },
    { rank: 2, name: "Ana Costa", role: "React Specialist", ovr: 88, tier: "Diamond", xp: "12.8k XP", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=ana", gradient: "from-cyan-400 to-indigo-500" },
    { rank: 3, name: "Davi Silva", role: "Backend Architect", ovr: 82, tier: "Gold", xp: "9.5k XP", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=davi", gradient: "from-amber-400 to-yellow-500" },
    { rank: 4, name: "Lucas Rocha", role: "Fullstack Developer", ovr: 79, tier: "Gold", xp: "8.1k XP", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=lucas", gradient: "from-amber-400 to-yellow-500" }
  ];

  const tags = ["All", "React", "Next.js", "Laravel", "TypeScript", "Docker", "AWS"];

  const filteredExploreProfiles = selectedExploreTag === "All"
    ? exploreMockProfiles
    : exploreMockProfiles.filter(p => p.skills.includes(selectedExploreTag));

  return (
    <div className="bg-[#030306] text-[#f1f5f9] min-h-screen relative overflow-x-hidden font-sans antialiased selection:bg-violet-650 selection:text-white">
      
      {/* Luzes néon de fundo (Aura cósmica) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[1000px] h-[500px] sm:h-[800px] bg-gradient-to-b from-violet-600/10 via-indigo-600/5 to-transparent rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[1200px] right-1/10 w-[400px] h-[500px] bg-cyan-600/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-[400px] left-1/10 w-[500px] h-[500px] bg-pink-600/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Grid de colunas verticais (Mockup style) */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-6xl pointer-events-none z-0 flex justify-between px-6 opacity-[0.03] sm:opacity-[0.06]">
        <div className="w-[1px] h-full bg-white" />
        <div className="w-[1px] h-full bg-white hidden sm:block" />
        <div className="w-[1px] h-full bg-white" />
        <div className="w-[1px] h-full bg-white hidden sm:block" />
        <div className="w-[1px] h-full bg-white" />
        <div className="w-[1px] h-full bg-white hidden sm:block" />
        <div className="w-[1px] h-full bg-white" />
      </div>

      {/* Header / Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#030306]/75 backdrop-blur-xl border-b border-neutral-900/60 transition-all">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center justify-center">
              <div className="w-3.5 h-3.5 bg-white/20 rounded-sm transform rotate-45" />
            </div>
            <span className="font-extrabold text-lg text-white tracking-tight">
              DevFolio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-extrabold uppercase tracking-widest text-neutral-450">
            <Link href="/explore" className="hover:text-white transition-colors">Explorar</Link>
            <Link href="/leaderboard" className="hover:text-white transition-colors">Leaderboards</Link>
            <a href="#ovr-system" className="hover:text-white transition-colors">Tech DNA 2.0</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link 
              href="/register" 
              className="bg-transparent hover:bg-white hover:text-black border border-neutral-800 hover:border-white text-white font-extrabold text-[10px] uppercase tracking-wider py-2 px-5 rounded-full transition-all duration-300 cursor-pointer"
            >
              Começar card
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 text-neutral-400 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#030306]/95 backdrop-blur-xl border-b border-neutral-900 px-6 py-6 space-y-4 absolute top-16 left-0 right-0 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
            <nav className="flex flex-col gap-4 text-xs font-black uppercase tracking-wider text-neutral-400">
              <Link href="/explore" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1 transition-colors">Explorar</Link>
              <Link href="/leaderboard" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1 transition-colors">Leaderboards</Link>
              <a href="#ovr-system" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1 transition-colors">Tech DNA 2.0</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1 transition-colors">FAQ</a>
            </nav>
            <div className="h-[1px] bg-neutral-900 my-4" />
            <div className="flex flex-col gap-3">
              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)} 
                className="text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white py-2 text-center"
              >
                Entrar
              </Link>
              <Link 
                href="/register" 
                onClick={() => setMobileMenuOpen(false)} 
                className="bg-violet-650 hover:bg-violet-600 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-[0_4px_20px_rgba(139,92,246,0.3)] text-center cursor-pointer border border-violet-500/20"
              >
                Começar card
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* EXPERIMENTAL 3D HERO SECTION */}
      <section 
        id="hero-arena"
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative max-w-6xl mx-auto px-6 pt-28 pb-20 md:pt-36 md:pb-28 z-10 flex flex-col items-center text-center scroll-mt-16"
      >
        {/* Glow pill badge */}
        <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full border border-violet-500/30 bg-violet-950/20 backdrop-blur-md shadow-[0_0_20px_rgba(139,92,246,0.15)] mb-8 select-none animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-[10px] font-bold text-violet-300 tracking-widest uppercase">
            Season 1: Forjando a Identidade Tech
          </span>
        </div>

        {/* Headline Centrada Estilo Apple / Mockup */}
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-extrabold tracking-tight leading-[1.05] max-w-5xl bg-gradient-to-b from-white via-neutral-100 to-neutral-500 bg-clip-text text-transparent mb-8 uppercase">
          Seu portfólio virou um <br/>
          <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">RPG de Carreira.</span>
          <br/>
          <span className="text-white">Evolua seu OVR.</span>
        </h1>
        
        <p className="text-sm sm:text-lg text-neutral-400 max-w-3xl leading-relaxed font-light mb-12">
          Conecte seu GitHub para gerar seu **Developer Card 3D interativo** com atributos auditados por inteligência artificial. Suba no ranking, conquiste elos de prestígio e explore perfis de elite.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-16 relative z-30">
          <Link 
            href="/register" 
            className="w-full sm:w-auto bg-violet-650 hover:bg-violet-600 text-white font-bold text-sm py-4 px-8 rounded-full shadow-[0_8px_30px_rgba(139,92,246,0.35)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer border border-violet-550/20"
          >
            Começar meu RPG de Carreira
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/leaderboard" 
            className="w-full sm:w-auto bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-200 font-bold text-sm py-4 px-8 rounded-full hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
          >
            Ver Leaderboard Global
          </Link>
        </div>

        {/* 3D ARENA (Interactive Parallax Showcase) */}
        <div className="relative w-full max-w-lg h-[460px] flex items-center justify-center mt-6 perspective-[1200px]">
          
          {/* Layer 1: Efeitos de Luz que seguem o mouse no fundo */}
          <motion.div 
            style={{ 
              x: floatX1, 
              y: floatY1, 
              rotateX: smoothRotateX, 
              rotateY: smoothRotateY,
              transformStyle: "preserve-3d" 
            }}
            className="absolute inset-0 rounded-3xl bg-radial-gradient from-violet-600/15 via-transparent to-transparent blur-3xl pointer-events-none"
          />

          {/* Layer 2: Grid perspectiva 3D rotacional */}
          <motion.div
            style={{
              rotateX: smoothRotateX,
              rotateY: smoothRotateY,
              transformStyle: "preserve-3d"
            }}
            className="absolute w-[440px] h-[440px] rounded-full border border-violet-500/10 bg-neutral-950/20 pointer-events-none flex items-center justify-center"
          >
            <div className="w-[300px] h-[300px] rounded-full border border-indigo-500/5 border-dashed" />
            <div className="w-[180px] h-[180px] rounded-full border border-cyan-500/5" />
          </motion.div>

          {/* Layer 3: O Developer Card Principal em 3D */}
          <motion.div
            style={{
              rotateX: smoothRotateX,
              rotateY: smoothRotateY,
              transformStyle: "preserve-3d"
            }}
            className="relative z-20 transition-all duration-300"
          >
            <DeveloperCard profile={demoProfile} showDetails={false} />
          </motion.div>

          {/* Layer 4: Floating 3D Widgets / Parallax Elements */}
          {/* Widget 1: OVR Badge */}
          <motion.div
            style={{
              x: floatX1,
              y: floatY2,
              translateZ: 100,
              transformStyle: "preserve-3d"
            }}
            className="absolute top-20 -left-6 z-30 px-3.5 py-2 rounded-2xl bg-neutral-900/90 border border-cyan-500/30 backdrop-blur-xl shadow-lg flex items-center gap-2 select-none pointer-events-none"
          >
            <div className="text-xl font-black text-cyan-400 font-mono">88</div>
            <div className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest leading-tight">
              OVR<br/><span className="text-cyan-300 font-extrabold text-[7px]">Diamond</span>
            </div>
          </motion.div>

          {/* Widget 2: DNA Tech Badge */}
          <motion.div
            style={{
              x: floatX2,
              y: floatY1,
              translateZ: 80,
              transformStyle: "preserve-3d"
            }}
            className="absolute bottom-20 -right-12 z-30 p-3.5 rounded-2xl bg-neutral-900/95 border border-purple-500/30 backdrop-blur-xl shadow-lg flex flex-col gap-1 text-left select-none pointer-events-none max-w-[130px]"
          >
            <span className="text-[7px] font-mono text-purple-400 font-black uppercase tracking-widest leading-none">DNA STACK</span>
            <span className="text-[10px] text-white font-extrabold font-sans leading-tight">React Specialist</span>
            <div className="h-1 w-full bg-neutral-950 rounded-full mt-1 overflow-hidden p-[1px]">
              <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-purple-500 to-indigo-500" />
            </div>
          </motion.div>
          
        </div>

        {/* Dica interativa de navegação */}
        <div className="text-[9px] text-neutral-500 font-mono font-black uppercase tracking-widest mt-12 flex items-center gap-1.5 animate-pulse select-none z-30">
          🎮 Mova o mouse sobre a Arena para inclinar • Clique no card para ver o verso
        </div>
      </section>

      {/* DEDICATED EXPLORE SECTION */}
      <section id="explore-section" className="max-w-6xl mx-auto px-6 py-20 border-t border-neutral-900/60 relative z-10 scroll-mt-16 bg-[#030306]/20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 text-left space-y-6">
            <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full border border-violet-500/20 bg-violet-950/10 text-violet-400">
              <Compass className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black tracking-widest uppercase font-mono">Painel de Busca</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight uppercase tracking-tight">
              Explore perfis de engenharia de elite.
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-light">
              Navegue pela comunidade e encontre profissionais de alto nível com base em suas proficiências de código verificadas por IA. Cada perfil exibe um Developer Card auditado pronto para comparação ou conexões.
            </p>
            <div className="pt-4">
              <Link 
                href="/explore" 
                className="inline-flex items-center gap-2 bg-violet-650 hover:bg-violet-600 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-full transition-all hover:scale-[1.02] shadow-[0_4px_20px_rgba(139,92,246,0.25)] border border-violet-550/20"
              >
                Explorar Todos os Perfis
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          <div className="lg:col-span-7 bg-neutral-950/40 border border-neutral-900 p-6 md:p-8 rounded-3xl relative text-left backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-[80px] pointer-events-none" />
            
            {/* Simulated Search bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
              <input 
                type="text" 
                placeholder="Buscar desenvolvedores por stack ou elo..." 
                disabled 
                className="w-full bg-neutral-900/50 border border-neutral-850 rounded-full py-2.5 pl-10 pr-4 text-xs text-neutral-450 placeholder-neutral-500 outline-none"
              />
            </div>

            {/* Filter tags preview */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedExploreTag(tag)}
                  className={`py-1.5 px-3 rounded-full text-[10px] font-bold transition-all border cursor-pointer ${
                    selectedExploreTag === tag
                      ? 'bg-white text-black border-white'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-850 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Profiles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredExploreProfiles.map((p, idx) => (
                <div key={idx} className="bg-neutral-900/30 border border-neutral-850 rounded-2xl p-4 flex items-center justify-between hover:border-neutral-700 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-full border border-neutral-800" />
                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">{p.name}</h4>
                      <p className="text-[9px] text-neutral-500">{p.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-neutral-950 border border-neutral-900 text-neutral-450 uppercase">{p.tier}</span>
                    <span className="text-xs font-bold font-mono text-white bg-neutral-950 px-2 py-1 rounded-lg border border-neutral-800 leading-none">{p.ovr}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* DEDICATED LEADERBOARDS SECTION */}
      <section id="leaderboards-section" className="max-w-6xl mx-auto px-6 py-20 border-t border-neutral-900/60 relative z-10 scroll-mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="w-full bg-neutral-950/60 border border-neutral-900 rounded-3xl overflow-hidden shadow-2xl relative backdrop-blur-xl">
              <div className="absolute top-0 left-0 w-48 h-48 bg-cyan-600/5 rounded-full blur-[60px] pointer-events-none" />
              
              <div className="p-4 bg-neutral-900/20 border-b border-neutral-900 flex justify-between items-center text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-500">
                <span>Ranking</span>
                <span>Desenvolvedor</span>
                <span className="text-right">Score OVR</span>
              </div>
              <div className="divide-y divide-neutral-900">
                {leaderboardMockProfiles.map((p) => (
                  <div key={p.rank} className="p-4 flex items-center justify-between hover:bg-neutral-900/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold font-mono w-5 ${
                        p.rank === 1 ? 'text-yellow-500' : p.rank === 2 ? 'text-slate-350' : p.rank === 3 ? 'text-amber-600' : 'text-neutral-555'
                      }`}>#{p.rank}</span>
                      <img src={p.avatar} alt={p.name} className="w-8.5 h-8.5 rounded-full border border-neutral-800" />
                      <div className="text-left">
                        <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                          {p.name}
                          <span className={`text-[7px] font-black font-mono px-1 py-0.2 rounded bg-neutral-900 border border-neutral-850 uppercase tracking-widest text-neutral-450`}>
                            {p.tier}
                          </span>
                        </h4>
                        <p className="text-[9px] text-neutral-500 leading-tight">{p.role} • {p.xp}</p>
                      </div>
                    </div>
                    <div>
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${p.gradient} flex items-center justify-center font-black font-mono text-white text-xs shadow-md`}>
                        {p.ovr}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5 order-1 lg:order-2 text-left space-y-6">
            <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full border border-cyan-500/20 bg-cyan-950/10 text-cyan-400">
              <Trophy className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black tracking-widest uppercase font-mono">Leaderboard Global</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight uppercase tracking-tight">
              A escada do prestígio técnico.
            </h2>
            <p className="text-neutral-455 text-xs sm:text-sm leading-relaxed font-light">
              Compita de igual para igual. O ranking geral ordena desenvolvedores do mundo todo puramente por suas habilidades auditadas. Suba nos tiers de OVR e grave seu nome no Hall da Fama.
            </p>
            <div className="pt-4">
              <Link 
                href="/leaderboard" 
                className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-855 border border-neutral-800 hover:border-neutral-700 text-neutral-200 font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-full transition-all hover:scale-[1.01]"
              >
                Visualizar Leaderboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* VALORANT STYLE CARD RARITY EVOLUTION SELECTOR */}
      <section id="card-rarity" className="max-w-6xl mx-auto px-6 py-20 border-t border-neutral-900/60 relative z-10 scroll-mt-16 bg-[#030306]/20">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-violet-400">Linha de Evolução</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight uppercase">
            Evolua seu elo técnico visualmente.
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed font-light">
            Seu Developer Card se transforma fisicamente de acordo com seu OVR. Clique nos elos abaixo para testar a evolução em tempo real.
          </p>
        </div>

        {/* Seletor de Tiers (Valorant Style) */}
        <div className="grid grid-cols-5 gap-2 max-w-2xl mx-auto mb-12 p-1 bg-neutral-950/60 border border-neutral-900 rounded-2xl relative z-20">
          {TIERS_INFO.map((tier) => {
            const isSelected = selectedPreviewTier === tier.index;
            return (
              <button
                key={tier.key}
                onClick={() => setSelectedPreviewTier(tier.index)}
                className={`py-3.5 px-1 sm:px-3 rounded-xl text-center flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
                  isSelected 
                    ? `bg-neutral-850/80 border border-neutral-700 shadow-md ${tier.textColor}` 
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                <span className="text-xs sm:text-sm font-black uppercase tracking-wide leading-none">{tier.name}</span>
                <span className="text-[8px] font-mono mt-1 opacity-70 leading-none">OVR {tier.ovrRange}</span>
              </button>
            );
          })}
        </div>

        {/* Visualizador de Evolução Lado a Lado (Card Preview | Detalhes do Elo) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-4xl mx-auto p-6 md:p-8 rounded-3xl bg-neutral-950/20 border border-neutral-900/80 relative">
          {/* Efeitos de brilho do elo selecionado */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-br ${selectedTier.gradient} blur-[120px] opacity-10 pointer-events-none transition-all duration-700`} />

          {/* Carta de Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="scale-90 md:scale-95 origin-center filter drop-shadow-[0_12px_30px_rgba(0,0,0,0.6)]">
              <DeveloperCard
                profile={{
                  ...demoProfile,
                  custom_styles: {
                    ...demoProfile.custom_styles,
                    border_theme: 'default' as const
                  } as ProfileType['custom_styles']
                }}
                ovrOverride={selectedTier.previewOvr}
              />
            </div>
          </div>

          {/* Detalhes do Elo Selecionado */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="space-y-1">
              <span className={`text-[10px] font-black font-mono px-3 py-1 rounded bg-neutral-900 border border-neutral-800 uppercase tracking-widest ${selectedTier.textColor}`}>
                Tier {selectedTier.name}
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-white mt-3 uppercase tracking-tight">
                ELO {selectedTier.name}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {selectedTier.description}
              </p>
            </div>

            {/* Destaque cosmético */}
            <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-850 space-y-2">
              <span className="text-[8px] font-black uppercase text-neutral-500 tracking-wider block">Cosmético Desbloqueado</span>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-tr ${selectedTier.gradient}`} />
                <span className="text-xs text-neutral-200 font-extrabold">{selectedTier.perk}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link 
                href="/register" 
                className={`inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest ${selectedTier.textColor} hover:underline`}
              >
                Conquistar este Elo
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TECH DNA 2.0 (OVR SYSTEM DETAILS) */}
      <section id="ovr-system" className="max-w-6xl mx-auto px-6 py-20 border-t border-neutral-900/60 relative z-10 scroll-mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Esquerda: Detalhes do Novo Motor DNA */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <span className="text-xs font-bold font-mono uppercase tracking-widest text-cyan-400">Algoritmo de Identidade</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight uppercase tracking-tight">
              Tech DNA 2.0: Suas estatísticas em evidência.
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-light">
              Chega de avaliações rasas ou currículos em texto puro. O novo sistema orquestra seus commits, proficiências, projetos e certificados em 5 slots técnicos customizáveis direto na frente do card.
            </p>

            <div className="space-y-4 text-[11px] font-medium text-neutral-300">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-neutral-900 border border-neutral-800 text-cyan-400 mt-0.5">
                  <Terminal className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-extrabold text-white">FOCUS (Skill Primária):</span> Mostra sua tecnologia de maior proficiência validada por IA.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-neutral-900 border border-neutral-800 text-cyan-400 mt-0.5">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-extrabold text-white">STACK (DNA da Stack):</span> Combina até 3 principais tecnologias com notas individuais.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-neutral-900 border border-neutral-800 text-cyan-400 mt-0.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-extrabold text-white">WORK & CRED:</span> Anos de mercado auditados e cursos/certificações mais relevantes.
                </div>
              </div>
            </div>
          </div>

          {/* Direita: Mockup do Dashboard Interno (DNA Audit Panel) */}
          <div className="lg:col-span-7 bg-neutral-950/40 border border-neutral-900 p-6 md:p-8 rounded-3xl relative text-left">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/5 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="flex justify-between items-center pb-3 border-b border-neutral-900 text-[9px] font-mono font-black uppercase tracking-wider text-neutral-500 mb-6">
              <span>Auditoria de Atributos DNA 2.0</span>
              <span className="text-cyan-400">// VERIFIED_BY_ENGINE_V2</span>
            </div>

            <div className="space-y-5 text-xs font-medium">
              <div className="space-y-2">
                <div className="flex justify-between text-neutral-400">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded bg-amber-400" /> React (Frontend Dev)
                  </span>
                  <span className="text-white font-black font-mono">92 / 100 <span className="text-amber-400 font-bold text-[10px]">Expert</span></span>
                </div>
                <div className="h-1.5 w-full bg-neutral-950 border border-neutral-850 rounded-full overflow-hidden p-[1px]">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full" style={{ width: '92%' }} />
                </div>
                <p className="text-[9.5px] text-neutral-500 mt-1 font-light leading-none">Validado em 8 projetos públicos e 1.2k commits de arquivos .jsx/.tsx.</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-neutral-400">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded bg-cyan-400" /> Next.js (App Router)
                  </span>
                  <span className="text-white font-black font-mono">90 / 100 <span className="text-cyan-400 font-bold text-[10px]">Expert</span></span>
                </div>
                <div className="h-1.5 w-full bg-neutral-950 border border-neutral-850 rounded-full overflow-hidden p-[1px]">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full" style={{ width: '90%' }} />
                </div>
                <p className="text-[9.5px] text-neutral-500 mt-1 font-light leading-none">Verificado via 6 projetos com App Router integrados no GitHub.</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-neutral-400">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded bg-purple-400" /> TypeScript (Type-Safety)
                  </span>
                  <span className="text-white font-black font-mono">85 / 100 <span className="text-purple-400 font-bold text-[10px]">Proven</span></span>
                </div>
                <div className="h-1.5 w-full bg-neutral-950 border border-neutral-850 rounded-full overflow-hidden p-[1px]">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" style={{ width: '85%' }} />
                </div>
                <p className="text-[9.5px] text-neutral-500 mt-1 font-light leading-none">Demonstrado em 4 repositórios com strict-type safety ativo.</p>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-neutral-950/60 border border-neutral-900 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 animate-pulse" />
              <p className="text-[10px] sm:text-xs text-neutral-450 font-light leading-relaxed">
                💡 <span className="font-bold text-white">Auditoria Ativa:</span> Conecte repositórios ou certifique e-mails profissionais para validar mais stacks no seu DNA e subir sua nota instantaneamente.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* VS MODE COMPARATOR SECTION */}
      <section id="vs-mode" className="max-w-6xl mx-auto px-6 py-20 border-t border-neutral-900/60 relative z-10 scroll-mt-16 bg-[#030306]/20">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-violet-400">Comparação Cruzada</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight uppercase tracking-tight">
            Duelo de Atributos: A Arena Técnica.
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed font-light">
            Compare o prestígio, elo e atributos do seu card com colegas de trabalho, concorrentes ou referências globais do mercado.
          </p>
        </div>

        {/* Visualizador de Batalha (Lado a Lado) */}
        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-10">
          {/* Jogador A */}
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-black tracking-widest text-cyan-400 bg-cyan-950/40 border border-cyan-800/20 px-3.5 py-1.5 rounded-full mb-4 uppercase">
              React Specialist (Ana)
            </span>
            <div className="scale-90 md:scale-95 origin-center filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
              <DeveloperCard profile={demoProfile} showDetails={false} />
            </div>
          </div>

          {/* Hub de Duelo Central */}
          <div className="flex flex-col justify-center items-center gap-4 text-center max-w-[280px] bg-neutral-950/60 border border-neutral-900 rounded-3xl p-6 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/5 to-cyan-500/5 rounded-3xl blur-md pointer-events-none" />
            
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center font-black text-white text-xl border-3 border-[#030306] shadow-xl relative animate-pulse">
              VS
            </div>
            
            <div className="space-y-1 relative z-10">
              <h4 className="text-sm font-black text-white uppercase tracking-tight">Análise Geral</h4>
              <p className="text-[10px] text-neutral-400 font-medium leading-relaxed">
                Comparação de notas baseadas em evidências reais de código e commits.
              </p>
            </div>

            {/* Sub-stats duel list */}
            <div className="w-full space-y-2.5 my-3 relative z-10 text-[10px] font-mono">
              <div className="flex justify-between items-center bg-neutral-900/60 p-2 rounded-xl border border-neutral-850">
                <span className="text-cyan-400 font-bold">92</span>
                <span className="text-neutral-500 font-bold uppercase text-[9px] tracking-widest">REACT</span>
                <span className="text-neutral-450 font-bold">--</span>
              </div>
              <div className="flex justify-between items-center bg-neutral-900/60 p-2 rounded-xl border border-neutral-850">
                <span className="text-neutral-450 font-bold">--</span>
                <span className="text-neutral-500 font-bold uppercase text-[9px] tracking-widest">LARAVEL</span>
                <span className="text-amber-400 font-bold">88</span>
              </div>
              <div className="flex justify-between items-center bg-neutral-900/60 p-2 rounded-xl border border-neutral-850">
                <span className="text-cyan-400 font-bold">88</span>
                <span className="text-neutral-500 font-bold uppercase text-[9px] tracking-widest">OVR</span>
                <span className="text-neutral-450 font-bold">82</span>
              </div>
            </div>

            <Link 
              href="/compare?users=anacosta,davisilva" 
              className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1.5 uppercase tracking-wider relative z-10 hover:underline"
            >
              Simular Duelo
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Jogador B */}
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-black tracking-widest text-amber-400 bg-amber-950/40 border border-amber-800/20 px-3.5 py-1.5 rounded-full mb-4 uppercase">
              Backend Architect (Davi)
            </span>
            <div className="scale-90 md:scale-95 origin-center filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
              <DeveloperCard profile={opponentProfile} showDetails={false} />
            </div>
          </div>
        </div>
      </section>

      {/* MARKETING & VIRAL SHIELD + MOCKUP BOTTOM CARDS */}
      <section id="marketing-cards" className="max-w-6xl mx-auto px-6 py-20 border-t border-neutral-900/60 relative z-10">
        
        {/* Mockup side-by-side cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-16">
          {/* Left Card: Gamification details */}
          <div className="bg-neutral-950/40 border border-neutral-900 p-8 rounded-3xl text-left relative overflow-hidden flex flex-col justify-between backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-650/5 rounded-full blur-[60px] pointer-events-none" />
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-violet-650/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-extrabold text-white uppercase tracking-tight">Seu portfólio virou um RPG de Carreira.</h3>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-light">
                Esqueça currículos antigos. No DevFolio, cada commit no GitHub, cada projeto verificado e cada badge de proficiência sobem suas estatísticas de OVR. Seu card 3D se atualiza dinamicamente e serve como sua prova definitiva de competência técnica.
              </p>
            </div>
            <div className="pt-6 border-t border-neutral-900/60 mt-6 flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
              <span>// GAME_ENGINE_ACTIVE</span>
              <span className="text-violet-400">v2.0.4</span>
            </div>
          </div>

          {/* Right Card: Twitter social mockup container */}
          <div className="bg-neutral-950/40 border border-neutral-900 p-8 rounded-3xl text-left relative overflow-hidden flex flex-col justify-between backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-600/5 rounded-full blur-[60px] pointer-events-none" />
            <div className="space-y-4">
              {/* Header of Tweet */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
                <div className="flex items-center gap-2.5">
                  <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=davi" alt="Avatar" className="w-8.5 h-8.5 rounded-full border border-neutral-800" />
                  <div>
                    <h4 className="text-xs font-extrabold text-white leading-tight">Davi Silva</h4>
                    <p className="text-[9px] text-neutral-500">@davisilva • Backend Architect</p>
                  </div>
                </div>
                {/* Custom Twitter/X Logo style */}
                <svg className="w-4 h-4 text-neutral-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light italic">
                "Compartilhei meu Developer Card no LinkedIn e já recebi 3 abordagens de recrutadores perguntando sobre o meu score verificado de Laravel e Docker. O feedback foi que a auditoria e o elo geram muita confiança!"
              </p>
            </div>
            <div className="pt-6 border-t border-neutral-900/60 mt-6 flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
              <div className="flex gap-4">
                <span>❤️ 142 Likes</span>
                <span>🔁 12 Retweets</span>
              </div>
              <span className="text-cyan-400">#DevFolio</span>
            </div>
          </div>
        </div>

        {/* Viral share text loops */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full border border-violet-500/30 bg-violet-950/20 text-violet-400">
              <Share2 className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black tracking-widest uppercase font-mono">Loops de Crescimento</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight uppercase tracking-tight">
              Sua reputação em evidência nas redes.
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-light">
              Compartilhe seu card dinamicamente no LinkedIn ou GitHub. A imagem se atualiza em tempo real sempre que seu OVR aumenta, atraindo visitas qualificadas de recrutadores e gerando loops de concorrência.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-medium border-t border-neutral-900/60 pt-6">
              <div className="space-y-1.5">
                <span className="text-white font-extrabold flex items-center gap-1.5 uppercase font-mono text-[10px] tracking-wider">
                  <Zap className="w-4 h-4 text-cyan-400 animate-pulse" /> Embed no README
                </span>
                <p className="text-neutral-450 font-medium">Adicione a tag Markdown do seu card dinâmico no topo do seu perfil do GitHub.</p>
              </div>
              <div className="space-y-1.5">
                <span className="text-white font-extrabold flex items-center gap-1.5 uppercase font-mono text-[10px] tracking-wider">
                  <Award className="w-4 h-4 text-violet-400" /> Álbum de Badges
                </span>
                <p className="text-neutral-455 font-medium">Fixe suas medalhas mais raras em destaque no perfil do LinkedIn ou portfólio.</p>
              </div>
            </div>
          </div>

          <div className="bg-neutral-950/40 border border-neutral-900 p-6 md:p-8 rounded-3xl text-left relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-650/5 rounded-full blur-[60px] pointer-events-none" />
            
            <div className="flex items-center gap-3 border-b border-neutral-900 pb-4 mb-4">
              <div className="w-9 h-9 rounded-full bg-violet-500/20 flex items-center justify-center font-bold text-xs text-violet-400 border border-violet-500/10">AC</div>
              <div>
                <p className="text-xs font-bold text-white">Ana Costa</p>
                <p className="text-[9px] text-neutral-500">React Specialist • Postado no LinkedIn</p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed font-medium italic mb-4">
              "Acabo de atingir o Tier Diamante no DevFolio com OVR 88! Sincronizei minha conta e mostrei meu nível real. Duvido você bater meu score de Frontend. Compare seu card com o meu aqui: devfolio.com/compare/vs/anacosta"
            </p>

            {/* Simulated shared card preview */}
            <div className="p-4 rounded-2xl bg-neutral-950/95 border border-neutral-900 flex items-center justify-between shadow-lg">
              <div className="space-y-1">
                <p className="text-[9px] font-mono font-black text-violet-400 uppercase tracking-widest leading-none">Duelo DevFolio</p>
                <p className="text-xs font-extrabold text-white">Batalhar contra @anacosta</p>
                <p className="text-[9px] text-neutral-500 mt-1">Conecte seu GitHub para comparar seu OVR.</p>
              </div>
              <Link href="/register" className="px-3.5 py-2 rounded-xl bg-violet-650 hover:bg-violet-600 text-white text-[9.5px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer border border-violet-550/20 text-center">
                Desafiar <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-20 border-t border-neutral-900/60 relative z-10 scroll-mt-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-violet-400">Perguntas</span>
          <h2 className="text-3xl font-extrabold text-white uppercase tracking-tight">Perguntas Frequentes</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isSelected = activeFaq === index;
            return (
              <div 
                key={index} 
                className="bg-neutral-950/30 border border-neutral-900 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(isSelected ? null : index)}
                  className="w-full px-6 py-4.5 text-left text-sm font-extrabold text-white flex justify-between items-center hover:bg-neutral-900/20 outline-none transition-colors cursor-pointer"
                >
                  {faq.question}
                  <ChevronRight className={`w-4.5 h-4.5 text-neutral-500 transition-transform duration-350 ${isSelected ? 'rotate-90 text-violet-400' : ''}`} />
                </button>
                {isSelected && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-neutral-400 leading-relaxed font-light border-t border-neutral-900/40 pt-4 animate-in fade-in duration-300">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FINAL CALL TO ACTION SECTION */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center relative z-10">
        <div className="p-8 md:p-14 rounded-3xl bg-gradient-to-br from-neutral-900/60 to-[#050508]/95 border border-neutral-900/80 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/5 to-cyan-500/5 rounded-3xl blur-xl opacity-60 pointer-events-none" />
          
          <div className="space-y-6 max-w-xl mx-auto relative z-10">
            <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mx-auto mb-4 animate-bounce" style={{ animationDuration: '4s' }}>
              <Award className="w-6 h-6 text-violet-500" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">Forje sua reputação hoje mesmo.</h2>
            <p className="text-neutral-455 text-xs sm:text-sm leading-relaxed font-medium">
              Junte-se a milhares de desenvolvedores no RPG de Carreira. Gere seu card técnico, suba nos rankings de tecnologia e conquiste visibilidade real.
            </p>
            <Link 
              href="/register" 
              className="inline-flex items-center gap-1.5 bg-violet-650 hover:bg-violet-600 text-white font-extrabold text-xs uppercase tracking-widest py-4.5 px-8 rounded-full shadow-md shadow-violet-950/20 hover:scale-[1.02] transition-all cursor-pointer border border-violet-550/20"
            >
              Forjar meu Card (Grátis)
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900/60 bg-[#030306]/85 py-8 relative z-10 text-xs text-neutral-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-xs">D</div>
            <span className="font-extrabold text-neutral-400 tracking-wider">DevFolio</span>
          </div>
          <p>© 2026 DevFolio. Feito com paixão para desenvolvedores de elite.</p>
        </div>
      </footer>

    </div>
  );
}
