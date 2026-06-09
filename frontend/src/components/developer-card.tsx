"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Award, Briefcase, Calendar, GraduationCap, Code, RefreshCw, Sparkles, LockKeyhole } from "lucide-react";
import { getRarityTier } from "@/features/gamification/lib/calculate-tier";
import { calculateLevelProgress } from "@/features/gamification/lib/calculate-level";
import { calculateOvr } from "@/features/gamification/domain/calculate-ovr";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export type BadgeType = {
  id: string;
  name: string;
  description: string;
  icon_path: string;
};

export type ProfileType = {
  id: string;
  name: string;
  username: string;
  avatar_url?: string | null;
  bio?: string | null;
  role?: string | null;
  location?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  website_url?: string | null;
  theme_name?: string | null;
  ovr?: number;
  xp?: number;
  level?: number;
  profile_completeness?: number;
  badges?: BadgeType[];
  custom_styles?: {
    border_theme?: 'default' | 'neon' | 'holographic' | 'cosmic';
    foil_effect?: 'none' | 'chrome' | 'gold' | 'diamond';
    pinned_badges?: string[];
  } | null;
};

interface DeveloperCardProps {
  profile: ProfileType;
  showDetails?: boolean;
  projects?: any[];
  experiences?: any[];
  educations?: any[];
}

export default function DeveloperCard({ 
  profile, 
  showDetails = false,
  projects = [],
  experiences = [],
  educations = []
}: DeveloperCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const ovr = profile.ovr || 1;
  const level = profile.level || 1;
  const xp = profile.xp || 0;
  const badges = profile.badges || [];

  const tier = getRarityTier(ovr);
  const progress = calculateLevelProgress(level, xp);

  // Calcula sub-scores baseados nos itens reais
  const { breakdown } = calculateOvr(
    {
      profile_completeness: profile.profile_completeness || 0,
      github_url: profile.github_url,
      experiences: experiences.length > 0 ? experiences : (profile as any).experiences || [],
      projects: projects.length > 0 ? projects : (profile as any).projects || [],
      skills: (profile as any).skills || [],
      badges: badges,
    },
    educations.length > 0 ? educations.length : ((profile as any).educations?.length ?? 0)
  );

  // Customizações de estilo extraídas do profile
  const customStyles = profile.custom_styles || {};
  const borderTheme = customStyles.border_theme || 'default';
  const foilEffect = customStyles.foil_effect || 'none';
  const pinnedBadgeIds = customStyles.pinned_badges || [];

  // Pega as medalhas fixadas ou as primeiras 3 desbloqueadas por padrão
  const pinnedBadges = badges.filter(b => pinnedBadgeIds.includes(b.id)).slice(0, 3);
  const displayBadges = pinnedBadges.length > 0 ? pinnedBadges : badges.slice(0, 3);

  // Framer Motion 3D Hover/Tilt variables
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Transforma posições do mouse em graus de rotação 3D
  const rotateX = useTransform(y, [-150, 150], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  // Spring animations para suavizar a rotação
  const springConfig = { damping: 25, stiffness: 200, mass: 0.8 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);

  // Posições do reflexo de brilho holográfico
  const shineX = useTransform(x, [-100, 100], ["0%", "100%"]);
  const shineY = useTransform(y, [-150, 150], ["0%", "100%"]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!cardRef.current || isFlipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left - width / 2;
    const mouseY = event.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
    x.set(0);
    y.set(0);
  };

  // Determina as cores de borda/gradient baseadas nas escolhas do customizer
  const getCardBorderClass = () => {
    switch (borderTheme) {
      case 'neon':
        return 'from-[#06b6d4] via-[#ec4899] to-[#a855f7]';
      case 'holographic':
        return 'from-[#cbd5e1] via-[#f472b6] via-[#38bdf8] via-[#fbbf24] to-[#cbd5e1] animate-pulse';
      case 'cosmic':
        return 'from-[#8b5cf6] via-[#d946ef] to-[#f43f5e]';
      default:
        return tier.color; // Padrão baseado no OVR
    }
  };

  // Efeitos holográficos adicionais (Foil)
  const renderFoilSheen = () => {
    if (foilEffect === 'none') return null;

    let bgStyle = '';
    let opacity = 'opacity-30';

    if (foilEffect === 'chrome') {
      bgStyle = 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.3) 100%)';
      opacity = 'opacity-20';
    } else if (foilEffect === 'gold') {
      bgStyle = 'linear-gradient(135deg, rgba(251,191,36,0.35) 0%, rgba(255,255,255,0) 60%, rgba(217,119,6,0.4) 100%)';
      opacity = 'opacity-35';
    } else if (foilEffect === 'diamond') {
      bgStyle = 'radial-gradient(circle, rgba(165,243,252,0.4) 0%, rgba(99,102,241,0.1) 70%)';
      opacity = 'opacity-40';
    }

    return (
      <motion.div 
        className={`absolute inset-0 pointer-events-none rounded-[22px] mix-blend-overlay transition-opacity duration-300 z-25 ${opacity}`}
        style={{
          background: bgStyle,
          backgroundAttachment: 'fixed'
        }}
      />
    );
  };

  const borderGradientClass = getCardBorderClass();

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm font-sans select-none group">
      
      {/* 3D Wrapper */}
      <div 
        className="perspective-[1000px] cursor-pointer relative"
        onClick={handleCardClick}
      >
        {/* DOUBLE LAYER NEON GLOW (Sombra expandida e borrada no fundo) */}
        <div 
          className={`absolute -inset-2 rounded-[28px] bg-gradient-to-br ${borderGradientClass} filter blur-[20px] opacity-40 transition-opacity duration-500 group-hover:opacity-60 pointer-events-none`}
        />

        {/* CARD FÍSICO CONTÊINER */}
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          style={{
            rotateX: isFlipped ? 0 : smoothRotateX,
            rotateY: isFlipped ? 180 : smoothRotateY,
            transformStyle: "preserve-3d",
          }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
          className={`relative w-80 h-[460px] rounded-3xl p-[1.5px] bg-gradient-to-br ${borderGradientClass} transition-shadow duration-500`}
        >
          {/* FRENTE DO CARD (FUT / TCG Centered Layout) */}
          <div 
            className={`absolute inset-0 rounded-[22.5px] ${tier.bg} flex flex-col items-center p-5 overflow-hidden text-white border border-white/5`}
            style={{ 
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden"
            }}
          >
            {/* Efeitos de Fundo/Aura interna do Card */}
            <div className={`absolute top-0 right-0 w-36 h-36 rounded-full bg-gradient-to-br ${borderGradientClass} blur-[45px] opacity-20`} />
            <div className="absolute bottom-[-20px] left-[-20px] w-36 h-36 rounded-full bg-indigo-500/10 blur-[40px] pointer-events-none" />

            {/* Foil Sheen holográfica dinâmica */}
            {renderFoilSheen()}

            {/* Radial glow seguindo o ponteiro do mouse */}
            <motion.div 
              className="absolute inset-0 pointer-events-none rounded-[22px] opacity-0 group-hover:opacity-25 mix-blend-overlay transition-opacity duration-300 z-20"
              style={{
                background: `radial-gradient(circle at ${shineX} ${shineY}, rgba(255,255,255,0.45) 0%, transparent 60%)`
              }}
            />

            {/* Aurora de fundo (luz suave atrás do conteúdo) */}
            <div className={`absolute -top-10 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full bg-gradient-to-br ${borderGradientClass} blur-[60px] opacity-30 pointer-events-none`} />

            {/* TOP HEADER: OVR RATING & LEVEL */}
            <div className="flex flex-col items-center z-10 w-full mb-4 mt-3 relative">
              {/* GitHub icon on the top right */}
              <div className="absolute right-1 top-0 w-6 h-6 rounded-full bg-neutral-950/80 border border-white/10 flex items-center justify-center text-neutral-400">
                <GithubIcon className="w-3 h-3" />
              </div>

              <div className="flex items-start gap-1.5 select-none">
                <span className="text-6xl font-black leading-none tracking-tighter bg-gradient-to-b from-white to-neutral-300 bg-clip-text text-transparent filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.7)]">
                  {ovr}
                </span>
                <span className={`text-[11px] font-black tracking-widest ${tier.text} uppercase mt-1.5`}>
                  OVR
                </span>
              </div>

              {/* LVL Pill */}
              <span className="mt-2 px-3 py-0.5 rounded-md bg-black/55 border border-white/10 text-[10px] font-black font-mono tracking-[0.2em] text-neutral-100 uppercase backdrop-blur-xs">
                LVL {level}
              </span>
            </div>

            {/* CENTER: AVATAR CIRCULAR COM ANEL */}
            <div className="z-10 mb-4 relative">
              <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${borderGradientClass} p-[2.5px] shadow-[0_8px_24px_rgba(0,0,0,0.5)]`}>
                <div className="w-full h-full rounded-full bg-[#050508] flex items-center justify-center overflow-hidden border-2 border-black/40">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  ) : (
                    <span className="text-3xl font-black text-white uppercase">{profile.name.substring(0, 2)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* MIDDLE SECTION: NOME & CARGO */}
            <div className="flex flex-col items-center text-center z-10 w-full mb-3">
              <h3 className="text-2xl font-black tracking-tight text-white truncate max-w-full font-sans drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.8)] leading-tight">
                {profile.name}
              </h3>
              <p className={`text-xs font-semibold tracking-wide mt-0.5 ${tier.text}`}>
                {profile.role || "Developer"}
              </p>
            </div>

            {/* Divider Line */}
            <div className="w-[88%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10 mb-3" />

            {/* BOTTOM SECTION: 4 STATS HORIZONTAIS COM DIVISÓRIAS */}
            <div className="flex items-stretch justify-center z-10 w-[92%] mb-4">
              {[
                { label: "EXP", value: breakdown.experience },
                { label: "PRJ", value: breakdown.projects },
                { label: "GIT", value: breakdown.github },
                { label: "COM", value: breakdown.completeness },
              ].map((stat, i) => (
                <React.Fragment key={stat.label}>
                  {i > 0 && <div className="w-[1px] bg-white/15 self-stretch my-1" />}
                  <div className="flex-1 flex flex-col items-center px-1">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">{stat.label}</span>
                    <span className="text-lg font-black text-white font-mono leading-tight mt-0.5">{stat.value}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* SLOTS DE MEDALHAS */}
            <div className="flex items-center justify-center gap-2.5 z-10 mt-auto pb-0.5">
              {displayBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="w-9 h-9 rounded-xl bg-neutral-950/65 border border-white/10 flex items-center justify-center text-amber-400/95 shadow-sm"
                  title={`${badge.name}: ${badge.description}`}
                >
                  {getBadgeIcon(badge.icon_path)}
                </div>
              ))}
              {displayBadges.length === 0 && (
                <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest">Sem Conquistas Fixadas</span>
              )}
            </div>

            {/* Flip hint */}
            <div className="absolute bottom-1 right-2 text-[7px] text-neutral-500 font-bold uppercase tracking-wider flex items-center gap-0.5 z-20">
              <RefreshCw className="w-2 h-2 animate-spin" style={{ animationDuration: '6s' }} />
              Ver Ficha
            </div>
          </div>

          {/* VERSO DO CARD (Ficha de Informações Técnicas) */}
          <div 
            className={`absolute inset-0 rounded-[22.5px] ${tier.bg} flex flex-col p-5 text-white border border-white/5`}
            style={{ 
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden"
            }}
          >
            <div className="absolute top-[-50px] left-[-50px] w-40 h-40 rounded-full bg-gradient-to-br from-violet-600/10 to-indigo-600/10 blur-[50px]" />
            
            <div className="flex justify-between items-center pb-2.5 border-b border-white/10 z-10">
              <span className="text-[9px] font-black uppercase tracking-widest text-neutral-450">Ficha do Dev</span>
              <span className="text-[9px] font-mono text-violet-400">@{profile.username}</span>
            </div>

            {/* Verso Stats */}
            <div className="flex-1 flex flex-col justify-center gap-4 py-3 z-10">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-neutral-400">
                  <span>Progresso do Nível {level}</span>
                  <span>{progress.percentage.toFixed(0)}%</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-950 border border-white/5 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${borderGradientClass} rounded-full`} style={{ width: `${progress.percentage}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-medium border-t border-white/5 pt-3">
                <div>
                  <span className="text-[8px] uppercase font-bold text-neutral-500 block">XP Total</span>
                  <span className="text-white font-extrabold">{progress.totalXp} XP</span>
                </div>
                <div>
                  <span className="text-[8px] uppercase font-bold text-neutral-500 block">Nível</span>
                  <span className="text-white font-extrabold">{progress.currentLevel}</span>
                </div>
                <div>
                  <span className="text-[8px] uppercase font-bold text-neutral-500 block">Completude</span>
                  <span className="text-violet-400 font-extrabold">{profile.profile_completeness || 0}%</span>
                </div>
                <div>
                  <span className="text-[8px] uppercase font-bold text-neutral-500 block">Conquistas</span>
                  <span className="text-amber-400 font-extrabold">{badges.length} badges</span>
                </div>
              </div>

              <div className="text-[9px] text-neutral-450 font-light mt-1.5 italic leading-relaxed text-center">
                *O OVR é recalculado quando novas experiências ou projetos são adicionados.
              </div>
            </div>

            {/* Flip back hint */}
            <div className="mt-auto pt-2.5 border-t border-white/10 flex items-center justify-center gap-1 text-[8px] text-neutral-500 font-bold uppercase tracking-wider">
              <RefreshCw className="w-2.5 h-2.5" />
              Clique para Virar
            </div>
          </div>
        </motion.div>
      </div>

      {/* DETALHES DE XP & COMPLETUDE */}
      {showDetails && (
        <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 shadow-sm rounded-2xl p-5 flex flex-col gap-4">
          {/* XP Progress */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-end text-xs font-semibold text-neutral-450">
              <span>Nível {level}</span>
              <span className="text-neutral-950 dark:text-neutral-50">{progress.xpInCurrentLevel} / {progress.xpForNext} XP</span>
            </div>
            <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${borderGradientClass} rounded-full transition-all duration-1000`}
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>

          {/* Completude do Perfil */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-end text-xs font-semibold text-neutral-450">
              <span>Completude do Perfil</span>
              <span className="text-violet-600 dark:text-violet-400">{profile.profile_completeness || 0}%</span>
            </div>
            <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-1000"
                style={{ width: `${profile.profile_completeness || 0}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Icon helper function
function getBadgeIcon(iconPath: string) {
  const props = { className: "w-4 h-4 text-amber-400" };
  switch (iconPath) {
    case "star":
      return <Award {...props} />;
    case "github":
      return <GithubIcon className="w-4 h-4 text-amber-400" />;
    case "pdf":
      return <Code {...props} />;
    case "projects":
      return <Briefcase {...props} />;
    case "experiences":
      return <Calendar {...props} />;
    case "skills":
      return <GraduationCap {...props} />;
    default:
      return <Award {...props} />;
  }
}
