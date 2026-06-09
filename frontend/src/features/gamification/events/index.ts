import { useEffect } from 'react';

export type GamificationEventMap = {
  'xp_gain': {
    xpEarned: number;
    actionLabel: string;
    newXp: number;
    level: number;
  };
  'level_up': {
    newLevel: number;
    oldLevel: number;
    profileName: string;
  };
};

export type GamificationEventType = keyof GamificationEventMap;

/**
 * Emite um evento de gamificação para escuta global na aplicação.
 */
export function emitGamificationEvent<K extends GamificationEventType>(
  type: K,
  detail: GamificationEventMap[K]
): void {
  if (typeof window === 'undefined') return;
  const event = new CustomEvent(`devfolio_gamification:${type}`, { detail });
  window.dispatchEvent(event);
}

/**
 * Hook do React para escutar com segurança eventos de gamificação e limpar os listeners ao desmontar.
 */
export function useGamificationListener<K extends GamificationEventType>(
  type: K,
  callback: (detail: GamificationEventMap[K]) => void
): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleEvent = (event: Event) => {
      const customEvent = event as CustomEvent<GamificationEventMap[K]>;
      callback(customEvent.detail);
    };

    window.addEventListener(`devfolio_gamification:${type}`, handleEvent);
    return () => {
      window.removeEventListener(`devfolio_gamification:${type}`, handleEvent);
    };
  }, [type, callback]);
}
