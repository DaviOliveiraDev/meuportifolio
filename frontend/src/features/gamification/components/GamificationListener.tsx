'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useQueryClient } from '@tanstack/react-query';
import { initEcho, disconnectEcho } from '@/lib/echo';
import { emitGamificationEvent } from '@/features/gamification/events';
import { showAchievementToast } from '@/lib/toast-gamified';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

/**
 * Componente global de escuta para eventos WebSocket de gamificação (via Laravel Echo/Reverb).
 * Deve ser instanciado próximo à raiz do aplicativo, abaixo do provedor de autenticação.
 */
export function GamificationListener() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const subscribedProfileId = useRef<string | null>(null);

  useEffect(() => {
    // Se o usuário deslogou ou não possui perfil ativo, encerra a conexão WebSocket
    if (!user || !user.profile?.id) {
      if (subscribedProfileId.current) {
        disconnectEcho();
        subscribedProfileId.current = null;
      }
      return;
    }

    const profileId = user.profile.id;

    // Se já estivermos inscritos no canal privado deste perfil específico, evita reconectar
    if (subscribedProfileId.current === profileId) {
      return;
    }

    // Inicializa ou reaproveita o Laravel Echo
    const echo = initEcho();
    if (!echo) return;

    subscribedProfileId.current = profileId;

    const channelName = `profile.${profileId}`;
    const channel = echo.private(channelName);

    console.log(`[WebSocket] Subscribing to channel: ${channelName}`);

    // Nomes das classes de evento PHP transmitidas pelo Laravel
    const achievementEvent = 'App\\Domain\\Gamification\\Events\\AchievementUnlockedEvent';
    const levelUpEvent = 'App\\Domain\\Gamification\\Events\\LevelUpEvent';
    const ovrUpdatedEvent = 'App\\Domain\\Gamification\\Events\\OvrUpdatedEvent';

    // 1. Tratamento de Conquistas Desbloqueadas (Badge Unlock)
    const handleAchievement = (data: any) => {
      console.log('[WebSocket] Achievement Unlocked:', data);
      
      const badge = data.achievement;
      
      // Efeito visual festivo (confetti)
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.65 }
      });

      // Toast estilizado com a raridade do Badge
      showAchievementToast({
        name: badge.name,
        description: badge.description,
        rarity: badge.rarity,
        xp_reward: badge.xp_reward,
        icon_path: badge.icon_path
      });

      // Emite evento para listeners locais no React
      emitGamificationEvent('achievement_unlocked', data);

      // Invalida consultas para atualizar os dados de conquistas/badges na UI
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
    };

    // 2. Tratamento de Level Up do usuário
    const handleLevelUp = (data: any) => {
      console.log('[WebSocket] Level Up Event:', data);
      
      // Chuva intensa de confete lateral
      const duration = 2.5 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 6,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.8 }
        });
        confetti({
          particleCount: 6,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.8 }
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      // Emite o evento local que o modal LevelUpModal escuta
      emitGamificationEvent('level_up', {
        newLevel: data.level_up.new_level,
        oldLevel: data.level_up.old_level,
        profileName: user.profile?.name || user.email
      });

      // Invalida consultas do perfil
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
    };

    // 3. Tratamento de Alteração/Upgrade de OVR (Overall Rating)
    const handleOvrUpdated = (data: any) => {
      console.log('[WebSocket] OVR Updated Event:', data);

      const newOvr = data.ovr_update.new_ovr;
      const oldOvr = data.ovr_update.old_ovr;

      // Alerta informativo com design néon/destaque
      toast.info(`Evolução Técnica! Seu OVR subiu de ${oldOvr} para ${newOvr} 🚀`, {
        duration: 5000,
      });

      emitGamificationEvent('ovr_updated', {
        newOvr,
        oldOvr,
        profile: data.profile
      });

      // Atualiza os componentes que mostram pontuações de OVR e habilidades
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
    };

    // Registra ouvintes com e sem o ponto prefixado para evitar problemas com diferentes configurações do Echo/Pusher
    channel
      .listen(achievementEvent, handleAchievement)
      .listen(`.${achievementEvent}`, handleAchievement)
      
      .listen(levelUpEvent, handleLevelUp)
      .listen(`.${levelUpEvent}`, handleLevelUp)
      
      .listen(ovrUpdatedEvent, handleOvrUpdated)
      .listen(`.${ovrUpdatedEvent}`, handleOvrUpdated);

    return () => {
      console.log(`[WebSocket] Unsubscribing from channel: ${channelName}`);
      channel
        .stopListening(achievementEvent)
        .stopListening(`.${achievementEvent}`)
        .stopListening(levelUpEvent)
        .stopListening(`.${levelUpEvent}`)
        .stopListening(ovrUpdatedEvent)
        .stopListening(`.${ovrUpdatedEvent}`);
    };
  }, [user, queryClient]);

  return null;
}
