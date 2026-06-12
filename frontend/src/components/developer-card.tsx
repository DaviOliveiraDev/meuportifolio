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

export type TechnologyScoreType = {
  technology_id: string;
  score: number;
  confidence_level: 'Declared' | 'Verified' | 'Proven' | 'Expert';
  evidence_count: number;
  technology?: {
    name: string;
    slug: string;
  };
};

export type TechnologyType = {
  id: string;
  name: string;
  slug: string;
  pivot?: {
    self_proficiency: number;
    is_featured: boolean;
  };
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
  titles?: Array<{ name: string; pivot?: { is_equipped: boolean } }>;
  cosmetics?: Array<{ name: string; type: string; value: string; pivot?: { is_equipped: boolean } }>;
  technology_scores?: TechnologyScoreType[];
  technologies?: TechnologyType[];
  custom_styles?: {
    border_theme?: 'default' | 'neon' | 'holographic' | 'cosmic';
    foil_effect?: 'none' | 'chrome' | 'gold' | 'diamond';
    pinned_badges?: string[];
    card_slots?: {
      slot_1?: 'top_technology' | 'radar_chart';
      slot_2?: 'top_3_technologies' | 'primary_framework';
      slot_3?: 'experience_years' | 'projects_count';
      slot_4?: 'education_degree' | 'certification';
      slot_5?: 'github_combined' | 'views_shares';
    } | null;
  } | null;
};

interface DeveloperCardProps {
  profile: ProfileType;
  showDetails?: boolean;
  projects?: any[];
  experiences?: any[];
  educations?: any[];
  ovrOverride?: number;
}

export default function DeveloperCard({ 
  profile, 
  showDetails = false,
  projects = [],
  experiences = [],
  educations = [],
  ovrOverride
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

  const ovr = ovrOverride || calculatedOvr || profile.ovr || 1;
  const tier = getRarityTier(ovr);
  const progress = calculateLevelProgress(level, xp);

  // Customizações de estilo extraídas do profile
  const customStyles = profile.custom_styles || {};
  const borderTheme = customStyles.border_theme || 'default';
  const foilEffect = customStyles.foil_effect || 'none';
  const pinnedBadgeIds = customStyles.pinned_badges || [];
  const cardSlots = customStyles.card_slots || null;

  // Títulos e Cosméticos Equipados via Relacionamento
  const equippedTitleObj = profile.titles?.find((t: any) => t.pivot?.is_equipped);
  const equippedTitle = equippedTitleObj ? equippedTitleObj.name : null;

  const equippedBorder = profile.cosmetics?.find((c: any) => c.type === 'border' && c.pivot?.is_equipped)?.value;
  const equippedBg = profile.cosmetics?.find((c: any) => c.type === 'background' && c.pivot?.is_equipped)?.value;
  const equippedEffect = profile.cosmetics?.find((c: any) => c.type === 'effect' && c.pivot?.is_equipped)?.value;

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

  // Posições do reflexo metálico (foil) - varre o card conforme o mouse
  const foilShineX = useTransform(x, [-150, 150], ["0%", "100%"]);
  const foilShineY = useTransform(y, [-200, 200], ["0%", "100%"]);

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

  // Determina as cores de borda/gradient baseadas nas escolhas do customizer ou cosmético equipado
  const getCardBorderClass = () => {
    if (equippedBorder) {
      switch (equippedBorder) {
        case 'border-amber-800': return 'from-[#78350f] to-[#b45309]';
        case 'border-slate-400': return 'from-[#64748b] to-[#cbd5e1]';
        case 'border-yellow-500': return 'from-[#eab308] via-[#f59e0b] to-[#d97706]';
        case 'border-sky-500': return 'from-[#0ea5e9] via-[#3b82f6] to-[#6366f1]';
        case 'border-purple-600': return 'from-[#7c3aed] via-[#a855f7] to-[#ec4899]';
        case 'border-neon-cyber': return 'from-[#06b6d4] via-[#ec4899] via-[#a855f7] to-[#06b6d4] animate-pulse';
        default: return equippedBorder;
      }
    }

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

  const getCardBorderStops = () => {
    if (equippedBorder) {
      switch (equippedBorder) {
        case 'border-amber-800': return ['#78350f', '#b45309', '#78350f'];
        case 'border-slate-400': return ['#64748b', '#cbd5e1', '#64748b'];
        case 'border-yellow-500': return ['#eab308', '#f59e0b', '#d97706'];
        case 'border-sky-500': return ['#0ea5e9', '#3b82f6', '#6366f1'];
        case 'border-purple-600': return ['#7c3aed', '#a855f7', '#ec4899'];
        case 'border-neon-cyber': return ['#06b6d4', '#ec4899', '#a855f7', '#06b6d4'];
        default: return tier.stops;
      }
    }

    switch (borderTheme) {
      case 'neon':
        return ['#06b6d4', '#ec4899', '#a855f7'];
      case 'holographic':
        return ['#cbd5e1', '#f472b6', '#38bdf8', '#fbbf24', '#cbd5e1'];
      case 'cosmic':
        return ['#8b5cf6', '#d946ef', '#f43f5e'];
      default:
        return tier.stops;
    }
  };

  // Determina o fundo recortado baseado no cosmético equipado
  const getCardBgClass = () => {
    if (equippedBg) {
      switch (equippedBg) {
        case 'bg-nebula':
          return 'bg-gradient-to-br from-[#0c0a24] via-[#1c0d3a] to-black';
        case 'bg-cyber-city':
          return 'bg-gradient-to-br from-slate-950 via-[#1e0735] to-black';
        case 'bg-matrix-core':
          return 'bg-gradient-to-b from-[#010903] via-[#041d08] to-[#010702]';
        case 'bg-dark-matter':
          return 'bg-gradient-to-br from-neutral-950 via-[#0d0d0f] to-neutral-950';
        case 'bg-space-station':
          return 'bg-gradient-to-br from-[#0b0f19] via-[#0d1627] to-black';
        case 'bg-terminal-hacker':
          return 'bg-black border border-emerald-900/10';
        case 'bg-aurora':
          return 'bg-gradient-to-br from-[#031c15] via-[#0c223a] to-[#12082b]';
        case 'bg-volcanic':
          return 'bg-gradient-to-br from-[#270c0c] via-[#241503] to-neutral-950';
        case 'bg-quantum':
          return 'bg-gradient-to-br from-[#031d24] via-[#1a0f30] to-black';
        default:
          return equippedBg;
      }
    }
    return tier.bg;
  };

  // Efeitos holográficos adicionais (Foil) - reativos ao movimento do mouse
  const renderFoilSheen = () => {
    if (foilEffect === 'none') return null;

    let bgStyle = '';
    let opacity = 'opacity-40';
    let blend = 'mix-blend-overlay';

    if (foilEffect === 'chrome') {
      bgStyle =
        'linear-gradient(115deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.55) 45%, rgba(203,213,225,0.35) 50%, rgba(255,255,255,0.55) 55%, rgba(255,255,255,0) 80%)';
      opacity = 'opacity-30';
      blend = 'mix-blend-soft-light';
    } else if (foilEffect === 'gold') {
      bgStyle =
        'linear-gradient(115deg, rgba(251,191,36,0) 20%, rgba(253,224,71,0.6) 42%, rgba(217,119,6,0.45) 52%, rgba(253,224,71,0.6) 60%, rgba(251,191,36,0) 82%)';
      opacity = 'opacity-45';
      blend = 'mix-blend-color-dodge';
    } else if (foilEffect === 'diamond') {
      bgStyle =
        'linear-gradient(115deg, rgba(165,243,252,0) 15%, rgba(165,243,252,0.55) 38%, rgba(99,102,241,0.4) 50%, rgba(244,114,182,0.45) 62%, rgba(165,243,252,0) 85%)';
      opacity = 'opacity-50';
      blend = 'mix-blend-color-dodge';
    }

    return (
      <motion.div
        className={`absolute inset-0 pointer-events-none ${blend} transition-opacity duration-300 z-[22] ${opacity}`}
        style={{
          backgroundImage: bgStyle,
          backgroundSize: '250% 250%',
          backgroundPositionX: foilShineX,
          backgroundPositionY: foilShineY,
        }}
      />
    );
  };

  // Efeitos visuais adicionais (Glow/Particles/Lightning/Flame)
  const renderCardEffect = () => {
    if (!equippedEffect) return null;

    switch (equippedEffect) {
      case 'effect-glow':
        return (
          <div className="absolute inset-0 rounded-[22px] pointer-events-none z-30 ring-2 ring-violet-500/40 animate-pulse shadow-[0_0_30px_rgba(139,92,246,0.35)]" />
        );
      case 'effect-particles':
        return (
          <div className="absolute inset-0 rounded-[22px] pointer-events-none overflow-hidden z-25 opacity-40">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white"
                initial={{ x: Math.random() * 260 + 30, y: 440, scale: Math.random() * 0.8 + 0.4 }}
                animate={{ y: -20, opacity: [0, 1, 1, 0] }}
                transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: i * 0.5, ease: "linear" }}
              />
            ))}
          </div>
        );
      case 'effect-lightning':
        return (
          <div className="absolute inset-0 rounded-[22px] pointer-events-none overflow-hidden z-25 opacity-25 bg-gradient-to-t from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 mix-blend-color-dodge animate-pulse" />
        );
      case 'effect-floating-code':
        const codeChars = ['{ }', '< />', '=>', '01', 'git', 'JS', 'PHP'];
        return (
          <div className="absolute inset-0 rounded-[22px] pointer-events-none overflow-hidden z-25 opacity-20 font-mono text-[9px] text-emerald-400 select-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ x: Math.random() * 260 + 30, y: 440 }}
                animate={{ y: -20, opacity: [0, 0.8, 0.8, 0] }}
                transition={{ duration: Math.random() * 4 + 3, repeat: Infinity, delay: i * 0.7, ease: "linear" }}
              >
                {codeChars[i % codeChars.length]}
              </motion.div>
            ))}
          </div>
        );
      case 'effect-hologram':
        return (
          <div className="absolute inset-0 rounded-[22px] pointer-events-none overflow-hidden z-25 opacity-30 mix-blend-overlay bg-gradient-to-b from-indigo-500/10 via-cyan-500/20 to-pink-500/10 animate-pulse" />
        );
      case 'effect-fire-aura':
        return (
          <div className="absolute inset-0 rounded-[22px] pointer-events-none overflow-hidden z-25 opacity-40">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-amber-500"
                initial={{ x: Math.random() * 260 + 30, y: 440, scale: Math.random() * 1.2 + 0.4 }}
                animate={{ y: -20, opacity: [0, 1, 1, 0], scale: [1, 1.5, 0.5] }}
                transition={{ duration: Math.random() * 2.5 + 1.5, repeat: Infinity, delay: i * 0.4, ease: "linear" }}
              />
            ))}
          </div>
        );
      case 'effect-ice-aura':
        return (
          <div className="absolute inset-0 rounded-[22px] pointer-events-none overflow-hidden z-25 opacity-40">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-sm rotate-45 bg-cyan-200"
                initial={{ x: Math.random() * 260 + 30, y: -10, scale: Math.random() * 0.8 + 0.4 }}
                animate={{ y: 470, opacity: [0, 1, 1, 0] }}
                transition={{ duration: Math.random() * 4 + 2, repeat: Infinity, delay: i * 0.6, ease: "linear" }}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  // Efeito extra para terminal CRT hacker
  const renderThemeOverlay = () => {
    if (equippedBg === 'bg-terminal-hacker') {
      return (
        <div className="absolute inset-0 pointer-events-none z-20 opacity-15 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px]" />
      );
    }
    return null;
  };

  // Calcula a pontuação detalhada dos 7 Atributos técnicos do portfólio
  const getAttributes = () => {
    const stats = (profile as any).stats;
    const skills = (profile as any).skills || [];
    const projectsList = projects.length > 0 ? projects : (profile as any).projects || [];
    const expList = experiences.length > 0 ? experiences : (profile as any).experiences || [];
    const eduList = educations.length > 0 ? educations : (profile as any).educations || [];

    // Mapeamento de Skills
    const bckSkillNames = ['PHP', 'Laravel', 'Node.js', 'Go', 'Python', 'Ruby', 'C#', 'Java', 'NestJS', 'Express', 'SQL'];
    const frtSkillNames = ['React', 'Next.js', 'TypeScript', 'JavaScript', 'TailwindCSS', 'CSS', 'HTML', 'Vue', 'Angular', 'Svelte'];
    const datSkillNames = ['Docker', 'AWS', 'Cloudflare', 'GitHub Actions', 'Nginx', 'PostgreSQL', 'Redis', 'MySQL', 'MongoDB', 'CI/CD', 'Kubernetes'];

    const bckSkills = skills.filter((s: any) => bckSkillNames.includes(s.name));
    const frtSkills = skills.filter((s: any) => frtSkillNames.includes(s.name));
    const datSkills = skills.filter((s: any) => datSkillNames.includes(s.name));

    // BCK Score
    const bckBase = bckSkills.length === 0 ? 10 : bckSkills.reduce((acc: number, curr: any) => acc + (curr.pivot?.proficiency_level ?? curr.proficiency_level ?? 0), 0) / bckSkills.length;
    let bckProjCount = 0;
    projectsList.forEach((p: any) => {
      const match = bckSkillNames.some(term => 
        (p.title && p.title.toLowerCase().includes(term.toLowerCase())) || 
        (p.description && p.description.toLowerCase().includes(term.toLowerCase()))
      );
      if (match) bckProjCount++;
    });
    const bckScore = Math.min(100, Math.round(bckBase + Math.min(30, bckProjCount * 5)));

    // FRT Score
    const frtBase = frtSkills.length === 0 ? 10 : frtSkills.reduce((acc: number, curr: any) => acc + (curr.pivot?.proficiency_level ?? curr.proficiency_level ?? 0), 0) / frtSkills.length;
    let frtProjCount = 0;
    projectsList.forEach((p: any) => {
      const match = frtSkillNames.some(term => 
        (p.title && p.title.toLowerCase().includes(term.toLowerCase())) || 
        (p.description && p.description.toLowerCase().includes(term.toLowerCase()))
      );
      if (match) frtProjCount++;
    });
    const frtScore = Math.min(100, Math.round(frtBase + Math.min(30, frtProjCount * 5)));

    // DAT Score
    const datBase = datSkills.length === 0 ? 10 : datSkills.reduce((acc: number, curr: any) => acc + (curr.pivot?.proficiency_level ?? curr.proficiency_level ?? 0), 0) / datSkills.length;
    let dockerCount = 0;
    projectsList.forEach((p: any) => {
      const desc = (p.description || '').toLowerCase();
      if (desc.includes('docker') || desc.includes('k8s') || desc.includes('kubernetes')) {
        dockerCount++;
      }
    });
    const datBonus = Math.min(15, dockerCount * 5) + (profile.github_url ? 15 : 0);
    const datScore = Math.min(100, Math.round(datBase + datBonus));

    // OSS Score (Open Source / GitHub activity)
    let ossScore = 0;
    if (profile.github_url) {
      const commits = stats?.github_commits || 0;
      const repos = stats?.github_repositories || 0;
      const stars = stats?.github_stars || 0;
      ossScore = Math.min(100, 20 + Math.min(40, Math.floor(commits / 10)) + Math.min(20, repos * 5) + Math.min(20, stars * 2));
      if (ossScore === 20) {
        const ghProjects = projectsList.filter((p: any) => p.repository_url && p.repository_url.includes('github.com')).length;
        ossScore = Math.min(100, 25 + (ghProjects * 15));
      }
    } else {
      ossScore = Math.min(100, projectsList.filter((p: any) => p.repository_url).length * 10);
    }

    // COM Score (Community / Views)
    const views = stats?.profile_views || 0;
    const shares = stats?.profile_shares || 0;
    const points = stats?.community_points || 0;
    let comScore = Math.min(100, 10 + Math.min(40, Math.floor(views / 15)) + Math.min(30, shares * 10) + Math.min(20, points));
    if (comScore === 10) {
      comScore = Math.round((profile.profile_completeness || 0) * 0.8 + 20);
    }

    // EXP Score
    let totalMonths = 0;
    expList.forEach((exp: any) => {
      const start = new Date(exp.start_date);
      const end = exp.is_current || !exp.end_date ? new Date() : new Date(exp.end_date);
      const diff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      totalMonths += Math.max(1, diff);
    });
    const expScore = Math.min(100, Math.round((totalMonths / 60) * 100));

    // EDU Score
    const eduScore = Math.min(100, eduList.length * 40);

    return {
      bck: bckScore,
      frt: frtScore,
      dat: datScore,
      oss: ossScore,
      com: comScore,
      exp: expScore,
      edu: eduScore
    };
  };

  const attrs = getAttributes();
  const borderGradientClass = getCardBorderClass();

  // --- CÁLCULO DINÂMICO DE SLOTS (TECH DNA) ---
  const techScores = profile.technology_scores || [];
  const sortedTechScores = [...techScores].sort((a, b) => b.score - a.score);
  const hasScores = sortedTechScores.length > 0;

  // Slot 1: Foco de Skill
  const slot1Option = cardSlots?.slot_1 || 'top_technology';
  let slot1Text = '';
  if (slot1Option === 'top_technology') {
    const topTech = sortedTechScores[0];
    if (topTech) {
      slot1Text = `${topTech.technology?.name || 'Tech'} ${topTech.score} (${topTech.confidence_level})`;
    } else {
      slot1Text = profile.role || 'Developer';
    }
  } else {
    slot1Text = profile.role || 'Generalist Developer';
  }

  // Slot 2: Stack Principal
  const slot2Option = cardSlots?.slot_2 || 'top_3_technologies';
  let slot2Text = '';
  if (slot2Option === 'top_3_technologies') {
    const top3 = sortedTechScores.slice(0, 3);
    if (top3.length > 0) {
      slot2Text = top3.map(t => `${t.technology?.name || 'Tech'} ${t.score}`).join(' | ');
    } else {
      const legacySkills = (profile as any).skills || [];
      slot2Text = legacySkills.slice(0, 3).map((s: any) => s.name).join(' | ') || 'Full Stack';
    }
  } else {
    const topTech = sortedTechScores[0];
    slot2Text = topTech ? `${topTech.technology?.name || 'Tech'} Specialist` : 'Software Developer';
  }

  // Slot 3: Métricas de Experiência
  const slot3Option = cardSlots?.slot_3 || 'experience_years';
  let slot3Text = '';
  const expList = experiences.length > 0 ? experiences : (profile as any).experiences || [];
  let expTotalMonths = 0;
  expList.forEach((exp: any) => {
    const start = new Date(exp.start_date);
    const end = exp.is_current || !exp.end_date ? new Date() : new Date(exp.end_date);
    const diff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    expTotalMonths += Math.max(1, diff);
  });
  const expYears = (expTotalMonths / 12).toFixed(1);
  if (slot3Option === 'experience_years') {
    slot3Text = parseFloat(expYears) > 0 ? `${expYears} Anos Verificados` : 'Iniciante no Mercado';
  } else {
    const projCount = projects.length > 0 ? projects.length : (profile as any).projects?.length || 0;
    slot3Text = `${projCount} Projetos Entregues`;
  }

  // Slot 4: Credenciais
  const slot4Option = cardSlots?.slot_4 || 'education_degree';
  let slot4Text = '';
  const eduList = educations.length > 0 ? educations : (profile as any).educations || [];
  if (slot4Option === 'education_degree') {
    slot4Text = eduList[0]?.course || 'Formação Autodidata';
  } else {
    slot4Text = eduList[0]?.institution || 'Certificações Diversas';
  }

  // Slot 5: Indicadores Sociais
  const slot5Option = cardSlots?.slot_5 || 'github_combined';
  let slot5Text = '';
  const stats = (profile as any).stats;
  if (slot5Option === 'github_combined') {
    if (stats?.github_connected || profile.github_url) {
      const commits = stats?.github_commits || 0;
      const stars = stats?.github_stars || 0;
      slot5Text = `${commits >= 1000 ? (commits/1000).toFixed(1) + 'k' : commits} Commits / ${stars} Stars`;
    } else {
      slot5Text = 'GitHub Não Conectado';
    }
  } else {
    const views = stats?.profile_views || 0;
    const shares = stats?.profile_shares || 0;
    slot5Text = `${views} Visualizações / ${shares} Shares`;
  }

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
          className={`absolute -inset-1 w-[336px] h-[476px] pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity duration-500 ${tier.hasPulseGlow ? 'animate-pulse' : ''}`}
          viewBox="-8 -8 336 476"
          fill="none"
          aria-hidden="true"
        >
          <path d={SHIELD_PATH} stroke={`url(#${gradientId})`} strokeWidth="6" className="blur-[14px]" />
          {(tier.hasHoloEffect || tier.hasPulseGlow) && (
            <path d={SHIELD_PATH} stroke={`url(#${gradientId})`} strokeWidth="10" className="blur-[28px] opacity-60" />
          )}
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
                {getCardBorderStops().map((color, idx, arr) => (
                  <stop 
                    key={idx} 
                    offset={`${(idx / (arr.length - 1)) * 100}%`} 
                    stopColor={color} 
                  />
                ))}
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
              className={`absolute inset-0 ${getCardBgClass()} overflow-hidden text-white`}
              style={{ clipPath: `url(#${clipId})`, WebkitClipPath: `url(#${clipId})` }}
            >
              {/* Aurora de fundo */}
              <div className={`absolute top-6 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-gradient-to-br ${borderGradientClass} blur-[55px] opacity-40 pointer-events-none`} />
              <div className="absolute bottom-0 left-[-30px] w-40 h-40 rounded-full bg-indigo-500/15 blur-[45px] pointer-events-none" />
              {renderFoilSheen()}
              {renderCardEffect()}
              {renderThemeOverlay()}
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

              {/* Nome, Título Equipado & Cargo */}
              <div className="shrink-0 flex flex-col items-center max-w-full text-center">
                <h3 className="text-2xl font-black tracking-tight text-white max-w-full truncate drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.8)] leading-tight px-2">
                  {profile.name}
                </h3>
                {equippedTitle && (
                  <span className="text-[8px] font-black tracking-[0.18em] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full uppercase mt-1 shadow-[0_0_10px_rgba(245,158,11,0.15)] animate-pulse">
                    ★ {equippedTitle} ★
                  </span>
                )}
                <p className="text-xs font-semibold tracking-wide mt-1 text-white/60">
                  {profile.role || "Developer"}
                </p>
              </div>

              {/* Divider */}
              <div className="shrink-0 w-[78%] h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent mt-3 mb-2.5" />

              {/* SLOTS TÉCNICOS OU GRID DE ATRIBUTOS (DEPENDENDO DO SCORE) */}
              {hasScores ? (
                <div className="shrink-0 flex flex-col gap-1.5 w-[82%] bg-black/35 backdrop-blur-xs border border-white/5 rounded-xl p-2.5 mb-2 text-[9.5px] font-mono select-none text-left justify-center min-h-[128px]">
                  <div className="flex items-center gap-1.5 text-white">
                    <span className="text-white/40 font-bold shrink-0">FOCUS:</span>
                    <span className="font-extrabold truncate text-amber-300" title={slot1Text}>{slot1Text}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white">
                    <span className="text-white/40 font-bold shrink-0">STACK:</span>
                    <span className="font-extrabold truncate text-cyan-400" title={slot2Text}>{slot2Text}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white">
                    <span className="text-white/40 font-bold shrink-0">WORK :</span>
                    <span className="font-extrabold truncate text-indigo-200" title={slot3Text}>{slot3Text}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white">
                    <span className="text-white/40 font-bold shrink-0">CRED :</span>
                    <span className="font-extrabold truncate text-emerald-300" title={slot4Text}>{slot4Text}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white">
                    <span className="text-white/40 font-bold shrink-0">STATS:</span>
                    <span className="font-extrabold truncate text-pink-300" title={slot5Text}>{slot5Text}</span>
                  </div>
                </div>
              ) : (
                <div className="shrink-0 grid grid-cols-2 gap-x-4 gap-y-1 w-[82%] bg-black/35 backdrop-blur-xs border border-white/5 rounded-xl p-2 mb-2 text-[10px] font-mono select-none min-h-[128px]">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-white/40 font-bold tracking-wider">BCK</span>
                    <span className="font-extrabold text-white">{attrs.bck}</span>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-white/40 font-bold tracking-wider">EXP</span>
                    <span className="font-extrabold text-white">{attrs.exp}</span>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-white/40 font-bold tracking-wider">FRT</span>
                    <span className="font-extrabold text-white">{attrs.frt}</span>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-white/40 font-bold tracking-wider">EDU</span>
                    <span className="font-extrabold text-white">{attrs.edu}</span>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-white/40 font-bold tracking-wider">DAT</span>
                    <span className="font-extrabold text-white">{attrs.dat}</span>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-white/40 font-bold tracking-wider">COM</span>
                    <span className="font-extrabold text-white">{attrs.com}</span>
                  </div>
                  <div className="flex justify-between items-center col-span-2 border-t border-white/5 pt-1 mt-0.5 px-1">
                    <span className="text-white/40 font-bold tracking-wider">OSS (OPEN SOURCE)</span>
                    <span className="font-extrabold text-cyan-400">{attrs.oss}</span>
                  </div>
                </div>
              )}

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
              className={`absolute inset-0 ${getCardBgClass()}`}
              style={{ clipPath: `url(#${clipId})`, WebkitClipPath: `url(#${clipId})` }}
            >
              <div className="absolute top-[-40px] left-[-40px] w-40 h-40 rounded-full bg-gradient-to-br from-violet-600/10 to-indigo-600/10 blur-[50px]" />
              {renderCardEffect()}
              {renderThemeOverlay()}
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
            <div className="flex-1 flex flex-col justify-start gap-2.5 py-3 z-10 overflow-hidden">
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

              {/* DETALHAMENTO DE ATRIBUTOS (7 BAR GRAPHS) */}
              <div className="border-t border-white/5 pt-2">
                <span className="text-[8px] uppercase font-black text-neutral-500 tracking-widest block mb-1.5">Atributos Técnicos</span>
                <div className="flex flex-col gap-1">
                  {[
                    { label: "BCK - Backend", value: attrs.bck },
                    { label: "FRT - Frontend", value: attrs.frt },
                    { label: "DAT - DevOps & DB", value: attrs.dat },
                    { label: "OSS - Open Source", value: attrs.oss },
                    { label: "COM - Comunidade", value: attrs.com },
                    { label: "EXP - Experiência", value: attrs.exp },
                    { label: "EDU - Educação", value: attrs.edu },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-2">
                      <span className="text-[8px] font-semibold text-neutral-400 w-24 shrink-0 truncate">{s.label}</span>
                      <div className="flex-1 h-1.5 bg-neutral-950 border border-white/5 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${borderGradientClass} rounded-full`} style={{ width: `${Math.min(100, s.value)}%` }} />
                      </div>
                      <span className="text-[9px] font-mono font-bold text-white w-6 text-right shrink-0">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumo + links */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-medium border-t border-white/5 pt-2">
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
                <div className="flex items-center gap-2 border-t border-white/5 pt-2">
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
