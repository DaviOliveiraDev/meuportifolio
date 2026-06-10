export interface TierConfig {
  name: string;
  color: string;   // Classes do Tailwind para o gradiente de raridade (from-via-to)
  text: string;    // Classe do Tailwind para a cor de destaque do texto
  border: string;  // Classe do Tailwind para a cor de borda principal
  bg: string;      // Classe do Tailwind para a cor de fundo do card
  glow: string;    // Classes CSS de sombra com brilho néon
  stops: [string, string, string]; // Cores hex para gradientes SVG (moldura/escudo)
  hasHoloEffect: boolean; // Indica se aplica overlay de refração de luz
  hasPulseGlow: boolean;  // Indica se aplica pulsação animada da aura
}

export function getRarityTier(ovr: number = 1): TierConfig {
  const currentOvr = Math.max(1, Math.min(99, ovr));

  if (currentOvr >= 95) {
    return {
      name: "Legendary",
      color: "from-purple-600 via-pink-600 to-amber-500",
      text: "text-amber-350",
      border: "border-pink-500",
      bg: "bg-[#07050a]/95",
      glow: "shadow-[0_0_35px_6px_rgba(236,72,153,0.65)]",
      stops: ["#9333ea", "#db2777", "#f59e0b"],
      hasHoloEffect: true,
      hasPulseGlow: true,
    };
  }

  if (currentOvr >= 85) {
    return {
      name: "Diamond",
      color: "from-cyan-400 via-indigo-500 to-purple-600",
      text: "text-cyan-300",
      border: "border-indigo-500",
      bg: "bg-[#09090f]/95",
      glow: "shadow-[0_0_25px_4px_rgba(99,102,241,0.50)]",
      stops: ["#22d3ee", "#6366f1", "#9333ea"],
      hasHoloEffect: true,
      hasPulseGlow: false,
    };
  }

  if (currentOvr >= 75) {
    return {
      name: "Gold",
      color: "from-amber-400 via-yellow-500 to-amber-600",
      text: "text-amber-300",
      border: "border-amber-500",
      bg: "bg-[#12100a]/95",
      glow: "shadow-[0_0_20px_2px_rgba(245,158,11,0.35)]",
      stops: ["#fbbf24", "#eab308", "#d97706"],
      hasHoloEffect: false,
      hasPulseGlow: false,
    };
  }

  if (currentOvr >= 65) {
    return {
      name: "Silver",
      color: "from-slate-300 via-zinc-400 to-slate-500",
      text: "text-slate-200",
      border: "border-slate-400",
      bg: "bg-[#16191d]/95",
      glow: "shadow-[0_0_15px_0px_rgba(184,197,214,0.15)]",
      stops: ["#cbd5e1", "#a1a1aa", "#64748b"],
      hasHoloEffect: false,
      hasPulseGlow: false,
    };
  }

  return {
    name: "Bronze",
    color: "from-amber-700 via-orange-800 to-amber-900",
    text: "text-orange-350",
    border: "border-amber-800",
    bg: "bg-[#1c1613]/95",
    glow: "shadow-none",
    stops: ["#b45309", "#9a3412", "#78350f"],
    hasHoloEffect: false,
    hasPulseGlow: false,
  };
}
