/**
 * Calcula os limites de XP para o nível atual do desenvolvedor.
 * Fórmula: XP necessário para subir do nível L para L+1 = 100 * (L ^ 1.5)
 */
export interface LevelProgress {
  currentLevel: number;
  nextLevel: number;
  totalXp: number;
  accXpForCurrent: number; // XP acumulado até o início do nível atual
  xpInCurrentLevel: number; // XP ganho apenas no nível atual
  xpForNext: number;        // XP total necessário para passar para o próximo nível
  percentage: number;       // Progresso percentual (0 a 100)
}

export function calculateLevelProgress(level: number = 1, xp: number = 0): LevelProgress {
  const currentLevel = Math.max(1, level);
  const nextLevel = currentLevel + 1;
  const totalXp = Math.max(0, xp);

  // Calcula o XP acumulativo necessário para alcançar o início do nível atual
  let accXpForCurrent = 0;
  for (let l = 1; l < currentLevel; l++) {
    accXpForCurrent += Math.floor(100 * Math.pow(l, 1.5));
  }

  // XP necessário para subir do nível atual para o próximo
  const xpForNext = Math.floor(100 * Math.pow(currentLevel, 1.5));

  // XP ganho desde o início do nível atual
  const xpInCurrentLevel = Math.max(0, totalXp - accXpForCurrent);

  // Percentual de progresso
  const percentage = xpForNext > 0 
    ? Math.min(100, Math.max(0, (xpInCurrentLevel / xpForNext) * 100))
    : 0;

  return {
    currentLevel,
    nextLevel,
    totalXp,
    accXpForCurrent,
    xpInCurrentLevel,
    xpForNext,
    percentage,
  };
}
