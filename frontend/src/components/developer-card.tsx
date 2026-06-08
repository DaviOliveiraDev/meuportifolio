"use client";

import { Award, Briefcase, Calendar, GraduationCap, Code } from "lucide-react";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
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
};

interface DeveloperCardProps {
  profile: ProfileType;
  showDetails?: boolean;
}

export function getRarityTier(ovr: number) {
  if (ovr >= 95) return { name: "Legendary", color: "from-purple-600 via-pink-600 to-amber-500", text: "text-amber-300", border: "border-pink-500", bg: "bg-neutral-950/90", glow: "shadow-[0_0_25px_rgba(236,72,153,0.5)]" };
  if (ovr >= 85) return { name: "Diamond", color: "from-cyan-400 via-indigo-500 to-purple-600", text: "text-cyan-300", border: "border-indigo-500", bg: "bg-slate-900/90", glow: "shadow-[0_0_20px_rgba(99,102,241,0.4)]" };
  if (ovr >= 75) return { name: "Gold", color: "from-amber-400 via-yellow-500 to-amber-600", text: "text-amber-400", border: "border-amber-500", bg: "bg-neutral-900/95", glow: "shadow-[0_0_15px_rgba(245,158,11,0.3)]" };
  if (ovr >= 65) return { name: "Silver", color: "from-slate-300 via-zinc-400 to-slate-500", text: "text-slate-300", border: "border-slate-400", bg: "bg-zinc-900/95", glow: "shadow-[0_0_10px_rgba(148,163,184,0.2)]" };
  return { name: "Bronze", color: "from-amber-700 via-orange-800 to-amber-900", text: "text-orange-300", border: "border-amber-800", bg: "bg-stone-900/95", glow: "shadow-none" };
}

export default function DeveloperCard({ profile, showDetails = false }: DeveloperCardProps) {
  const ovr = profile.ovr || 1;
  const level = profile.level || 1;
  const xp = profile.xp || 0;
  const badges = profile.badges || [];

  const tier = getRarityTier(ovr);

  // Calcula o XP necessário para o próximo nível
  // Fórmula backend: XP necessário = 100 * (Level ^ 1.5)
  const getXpThresholds = (currentLevel: number) => {
    let accXpForCurrent = 0;
    for (let l = 1; l < currentLevel; l++) {
      accXpForCurrent += Math.floor(100 * Math.pow(l, 1.5));
    }
    const xpForNext = Math.floor(100 * Math.pow(currentLevel, 1.5));
    return {
      accXpForCurrent,
      xpForNext,
    };
  };

  const { accXpForCurrent, xpForNext } = getXpThresholds(level);
  const xpInCurrentLevel = xp - accXpForCurrent;
  const xpProgressPercentage = Math.min(100, Math.max(0, (xpInCurrentLevel / xpForNext) * 100));

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
      {/* CARD FÍSICO */}
      <div
        className={`relative w-80 h-[450px] rounded-3xl p-1 bg-gradient-to-br ${tier.color} ${tier.glow} transition-all duration-500 hover:scale-105 select-none`}
      >
        <div className={`w-full h-full rounded-[22px] ${tier.bg} flex flex-col p-6 overflow-hidden relative text-white`}>
          {/* Luzes de Fundo para Glassmorphism */}
          <div className={`absolute top-[-50px] right-[-50px] w-40 h-40 rounded-full bg-gradient-to-br ${tier.color} blur-[50px] opacity-30`} />
          <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 blur-[50px] opacity-20" />

          {/* Cabeçalho do Card */}
          <div className="flex justify-between items-start z-10">
            {/* Nível e Raridade */}
            <div className="flex flex-col">
              <span className={`text-[10px] font-bold tracking-widest uppercase ${tier.text}`}>
                {tier.name}
              </span>
              <span className="text-[12px] text-neutral-400 font-semibold mt-0.5">
                LVL {level}
              </span>
            </div>

            {/* OVR Principal */}
            <div className="flex flex-col items-end">
              <span className={`text-4xl font-extrabold tracking-tighter bg-gradient-to-br ${tier.color} bg-clip-text text-transparent filter drop-shadow`}>
                {ovr}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold">
                OVR
              </span>
            </div>
          </div>

          {/* Corpo do Card (Avatar e Bio) */}
          <div className="flex flex-col items-center mt-6 flex-grow z-10">
            <div className={`relative w-28 h-28 rounded-full p-1 bg-gradient-to-br ${tier.color} ${tier.glow}`}>
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.name}
                  className="w-full h-full rounded-full object-cover bg-neutral-900 border border-neutral-800"
                  draggable={false}
                />
              ) : (
                <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center text-2xl font-bold uppercase border border-neutral-800">
                  {profile.name.substring(0, 2)}
                </div>
              )}
            </div>

            <h3 className="text-xl font-bold mt-4 text-center tracking-tight truncate max-w-full">
              {profile.name}
            </h3>

            <p className={`text-[11px] font-medium tracking-wide uppercase ${tier.text} text-center mt-1`}>
              {profile.role || "Developer"}
            </p>

            <p className="text-xs text-neutral-400 text-center mt-3 line-clamp-3 px-2 leading-relaxed italic">
              "{profile.bio || "No biography provided yet."}"
            </p>
          </div>

          {/* Badges / Medalhas no Rodapé */}
          <div className="mt-auto z-10 border-t border-neutral-800/60 pt-4 flex flex-col items-center">
            <div className="flex gap-2 justify-center items-center h-8">
              {badges.slice(0, 5).map((badge) => (
                <div
                  key={badge.id}
                  className="relative group cursor-help"
                  title={`${badge.name}: ${badge.description}`}
                >
                  <div className="w-7 h-7 rounded-full bg-neutral-900/80 border border-neutral-800 flex items-center justify-center transition-all hover:scale-110 hover:border-amber-500">
                    {getBadgeIcon(badge.icon_path)}
                  </div>
                </div>
              ))}
              {badges.length === 0 && (
                <span className="text-[10px] text-neutral-500 font-medium tracking-wide">
                  No achievements unlocked
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DETALHES DE XP & COMPLETUDE */}
      {showDetails && (
        <div className="w-full bg-neutral-900/40 dark:bg-neutral-950/40 backdrop-blur-md border border-neutral-200/10 dark:border-neutral-800/40 rounded-2xl p-5 flex flex-col gap-4">
          {/* XP Progress */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-end text-xs font-semibold text-neutral-400">
              <span>Nível {level}</span>
              <span className="text-white">{xpInCurrentLevel} / {xpForNext} XP</span>
            </div>
            <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${tier.color} rounded-full transition-all duration-1000`}
                style={{ width: `${xpProgressPercentage}%` }}
              />
            </div>
          </div>

          {/* Completude do Perfil */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-end text-xs font-semibold text-neutral-400">
              <span>Perfil Completo</span>
              <span className="text-violet-400">{profile.profile_completeness || 0}%</span>
            </div>
            <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
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
