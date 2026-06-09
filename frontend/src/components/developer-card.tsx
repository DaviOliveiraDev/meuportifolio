"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Award, Briefcase, Calendar, GraduationCap, Code, RefreshCw, Sparkles, LockKeyhole, Globe } from "lucide-react";
import { getRarityTier } from "@/features/gamification/lib/calculate-tier";
import { calculateLevelProgress } from "@/features/gamification/lib/calculate-level";
import { calculateOvr } from "@/features/gamification/domain/calculate-ovr";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
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
  const uid = React.useId().replace(/[:]/g, "");
  const gradientId = `crest-grad-${uid}`;
  const clipId = `crest-clip-${uid}`;

  const level = profile.level || 1;
  const xp = profile.xp || 0;
  const badges = profile.badges || [];

  // Calcula sub-scores baseados nos itens reais e o OVR
  const { ovr: calculatedOvr, breakdown } = calculateOvr(
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

  const ovr = calculatedOvr || profile.ovr || 1;
  const tier = getRarityTier(ovr);
  const progress = calculateLevelProgress(level, xp);

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

  // Path da moldura em formato de escudo/crest (estilo FUT) - viewBox 320x460
  const SHIELD_PATH =
    "M160 6 L174 24 C188 30 232 24 260 44 C286 62 300 84 300 116 L300 356 C300 404 250 434 160 452 C70 434 20 404 20 356 L20 116 C20 84 34 62 60 44 C88 24 132 30 146 24 Z";

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm font-sans select-none group">
      
      {/* 3D Wrapper */}
      <div 
        className="perspective-[1000px] cursor-pointer relative"
        onClick={handleCardClick}
      >
        {/* GLOW NEON DO ESCUDO (atrás da moldura) */}
        <svg
          className="absolute -inset-1 w-[336px] h-[476px] pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity duration-500"
          viewBox="-8 -8 336 476"
          fill="none"
          aria-hidden="true"
        >
          <path d={SHIELD_PATH} stroke={`url(#${gradientId})`} strokeWidth="6" className="blur-[14px]" />
        </svg>

        {/* CARD FÍSICO CONTÊINER (formato de escudo) */}
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
          className="relative w-80 h-[460px]"
        >
          {/* SVG defs: gradiente e clip do escudo */}
          <svg className="absolute w-0 h-0" aria-hidden="true">
            <defs>
              <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
                <path d={SHIELD_PATH} />
              </clipPath>
              <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={tier.stops[0]} />
                <stop offset="50%" stopColor={tier.stops[1]} />
                <stop offset="100%" stopColor={tier.stops[2]} />
              </linearGradient>
            </defs>
          </svg>

          {/* FRENTE DO CARD */}
          <div
            className="absolute inset-0"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            {/* Fundo recortado em escudo */}
            <div
              className={`absolute inset-0 ${tier.bg} overflow-hidden text-white`}
              style={{ clipPath: `url(#${clipId})`, WebkitClipPath: `url(#${clipId})` }}
            >
              {/* Aurora de fundo */}
              <div className={`absolute top-6 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-gradient-to-br ${borderGradientClass} blur-[55px] opacity-40 pointer-events-none`} />
              <div className="absolute bottom-0 left-[-30px] w-40 h-40 rounded-full bg-indigo-500/15 blur-[45px] pointer-events-none" />
              {renderFoilSheen()}
              <motion.div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-25 mix-blend-overlay transition-opacity duration-300 z-20"
                style={{
                  background: `radial-gradient(circle at ${shineX} ${shineY}, rgba(255,255,255,0.45) 0%, transparent 60%)`,
                }}
              />
            </div>

            {/* Moldura dupla do escudo (linhas neon) */}
            <svg
              className="absolute inset-0 w-80 h-[460px] pointer-events-none z-30 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
              viewBox="0 0 320 460"
              fill="none"
              aria-hidden="true"
            >
              <path d={SHIELD_PATH} stroke={`url(#${gradientId})`} strokeWidth="3" />
              <path
                d="M160 22 L171 36 C184 41 224 36 248 53 C269 68 281 87 281 115 L281 352 C281 393 238 419 160 435 C82 419 39 393 39 352 L39 115 C39 87 51 68 72 53 C96 36 136 41 149 36 Z"
                stroke={`url(#${gradientId})`}
                strokeWidth="1.5"
                opacity="0.7"
              />

              {/* Luz viajante percorrendo a moldura (tiers holográficos) */}
              {tier.hasHoloEffect && (
                <motion.path
                  d={SHIELD_PATH}
                  stroke="#ffffff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="0.12 0.88"
                  initial={{ strokeDashoffset: 1 }}
                  animate={{ strokeDashoffset: [1, 0] }}
                  transition={{ duration: 3.5, ease: "linear", repeat: Infinity }}
                  className="drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]"
                  style={{ opacity: 0.85 }}
                />
              )}
            </svg>

            {/* CONTEÚDO */}
            <div className="absolute inset-0 flex flex-col items-center px-7 pt-8 pb-10 text-white z-40">
              {/* GitHub icon */}
              <div className="absolute right-9 top-9 w-6 h-6 rounded-full bg-neutral-950/70 border border-white/10 flex items-center justify-center text-neutral-400">
                <GithubIcon className="w-3 h-3" />
              </div>

              {/* OVR */}
              <div className="flex items-start gap-1.5 select-none shrink-0">
                <span className="text-5xl font-black leading-none tracking-tighter bg-gradient-to-b from-white to-neutral-300 bg-clip-text text-transparent filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.7)]">
                  {ovr}
                </span>
                <span className="text-[11px] font-black tracking-widest text-white/90 uppercase mt-1.5">OVR</span>
              </div>

              {/* LVL Pill */}
              <span className="shrink-0 mt-2 px-4 py-1 rounded-md bg-black/45 border border-white/15 text-[11px] font-black font-mono tracking-[0.18em] text-neutral-100 uppercase backdrop-blur-xs">
                LVL {level}
              </span>

              {/* Avatar circular com anel */}
              <div className="mt-4 mb-3 relative shrink-0">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${borderGradientClass} p-[3px] shadow-[0_8px_28px_rgba(0,0,0,0.55)]`}>
                  <div className="w-full h-full rounded-full bg-[#050508] flex items-center justify-center overflow-hidden border-2 border-black/40">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" draggable={false} />
                    ) : (
                      <span className="text-3xl font-black text-white uppercase">{profile.name.substring(0, 2)}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Nome & cargo */}
              <h3 className="shrink-0 text-2xl font-black tracking-tight text-white max-w-full text-center drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.8)] leading-tight px-2 truncate">
                {profile.name}
              </h3>
              <p className="shrink-0 text-sm font-medium tracking-wide mt-0.5 text-white/70 text-center">
                {profile.role || "Developer"}
              </p>

              {/* Divider */}
              <div className="shrink-0 w-[78%] h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent mt-3 mb-3" />

              {/* 4 STATS HORIZONTAIS */}
              <div className="shrink-0 flex items-stretch justify-center w-[82%] mb-3">
                {[
                  { label: "EXP", value: breakdown.experience },
                  { label: "PRJ", value: breakdown.projects },
                  { label: "GIT", value: breakdown.github },
                  { label: "COM", value: breakdown.completeness },
                ].map((stat, i) => (
                  <React.Fragment key={stat.label}>
                    {i > 0 && <div className="w-[1px] bg-white/15 self-stretch my-0.5" />}
                    <div className="flex-1 flex flex-col items-center px-1.5">
                      <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">{stat.label}</span>
                      <span className="text-xl font-black text-white font-mono leading-tight mt-0.5">{stat.value}</span>
                      <div className="mt-1 w-full h-[3px] rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full bg-gradient-to-r ${borderGradientClass}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, stat.value)}%` }}
                          transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 + i * 0.1 }}
                        />
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>

              {/* SLOTS DE MEDALHAS */}
              <div className="shrink-0 flex items-center justify-center gap-2.5 mt-auto">
                {displayBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="w-9 h-9 rounded-xl bg-neutral-950/55 border border-white/10 flex items-center justify-center text-amber-400/95 shadow-sm"
                    title={`${badge.name}: ${badge.description}`}
                  >
                    {getBadgeIcon(badge.icon_path)}
                  </div>
                ))}
                {displayBadges.length === 0 && (
                  <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Sem Conquistas Fixadas</span>
                )}
              </div>

              {/* Flip hint */}
              <div className="absolute bottom-2 right-7 text-[7px] text-white/40 font-bold uppercase tracking-wider flex items-center gap-0.5">
                <RefreshCw className="w-2 h-2 animate-spin" style={{ animationDuration: "6s" }} />
                Ver Ficha
              </div>
            </div>
          </div>

          {/* VERSO DO CARD (Ficha de Informações Técnicas) */}
          <div 
            className="absolute inset-0"
            style={{ 
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden"
            }}
          >
            {/* Fundo recortado em escudo */}
            <div
              className={`absolute inset-0 ${tier.bg}`}
              style={{ clipPath: `url(#${clipId})`, WebkitClipPath: `url(#${clipId})` }}
            >
              <div className="absolute top-[-40px] left-[-40px] w-40 h-40 rounded-full bg-gradient-to-br from-violet-600/10 to-indigo-600/10 blur-[50px]" />
            </div>

            {/* Moldura neon do escudo */}
            <svg
              className="absolute inset-0 w-80 h-[460px] pointer-events-none z-30 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
              viewBox="0 0 320 460"
              fill="none"
              aria-hidden="true"
            >
              <path d={SHIELD_PATH} stroke={`url(#${gradientId})`} strokeWidth="3" />
            </svg>

            {/* Conteúdo do verso */}
            <div className="absolute inset-0 flex flex-col px-7 pt-9 pb-10 text-white z-40">
            <div className="flex justify-between items-center pb-2.5 border-b border-white/10 z-10">
              <span className="text-[9px] font-black uppercase tracking-widest text-neutral-450">Ficha do Dev</span>
              <span className="text-[9px] font-mono text-violet-400">@{profile.username}</span>
            </div>

            {/* Verso Stats */}
            <div className="flex-1 flex flex-col justify-start gap-3 py-3 z-10 overflow-hidden">
              {/* Progresso do nível */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-neutral-300">
                  <span>Progresso do Nível {level}</span>
                  <span>{progress.percentage.toFixed(0)}%</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-950 border border-white/5 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${borderGradientClass} rounded-full`} style={{ width: `${progress.percentage}%` }} />
                </div>
              </div>

              {/* Breakdown completo do OVR */}
              <div className="border-t border-white/5 pt-2.5">
                <span className="text-[8px] uppercase font-black text-neutral-500 tracking-widest block mb-1.5">Composição do OVR</span>
                <div className="flex flex-col gap-1.5">
                  {[
                    { label: "Experiência", value: breakdown.experience },
                    { label: "Projetos", value: breakdown.projects },
                    { label: "GitHub", value: breakdown.github },
                    { label: "Skills & Badges", value: breakdown.skills_badges },
                    { label: "Formação", value: breakdown.education },
                    { label: "Completude", value: breakdown.completeness },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-2">
                      <span className="text-[9px] font-semibold text-neutral-400 w-24 shrink-0">{s.label}</span>
                      <div className="flex-1 h-1.5 bg-neutral-950 border border-white/5 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${borderGradientClass} rounded-full`} style={{ width: `${Math.min(100, s.value)}%` }} />
                      </div>
                      <span className="text-[9px] font-mono font-bold text-white w-6 text-right shrink-0">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumo + links */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-medium border-t border-white/5 pt-2.5">
                <div>
                  <span className="text-[8px] uppercase font-bold text-neutral-500 block">XP Total</span>
                  <span className="text-white font-extrabold">{progress.totalXp} XP</span>
                </div>
                <div>
                  <span className="text-[8px] uppercase font-bold text-neutral-500 block">Conquistas</span>
                  <span className="text-amber-400 font-extrabold">{badges.length} badges</span>
                </div>
              </div>

              {/* Links sociais */}
              {(profile.github_url || profile.linkedin_url || profile.website_url) && (
                <div className="flex items-center gap-2 border-t border-white/5 pt-2.5">
                  {profile.github_url && (
                    <a href={profile.github_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                      className="w-8 h-8 rounded-lg bg-neutral-950/60 border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white hover:border-white/30 transition-colors" aria-label="GitHub">
                      <GithubIcon className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {profile.linkedin_url && (
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                      className="w-8 h-8 rounded-lg bg-neutral-950/60 border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white hover:border-white/30 transition-colors" aria-label="LinkedIn">
                      <LinkedinIcon className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {profile.website_url && (
                    <a href={profile.website_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                      className="w-8 h-8 rounded-lg bg-neutral-950/60 border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white hover:border-white/30 transition-colors" aria-label="Website">
                      <Globe className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Flip back hint */}
            <div className="mt-auto pt-2.5 border-t border-white/10 flex items-center justify-center gap-1 text-[8px] text-neutral-500 font-bold uppercase tracking-wider">
              <RefreshCw className="w-2.5 h-2.5" />
              Clique para Virar
            </div>
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
