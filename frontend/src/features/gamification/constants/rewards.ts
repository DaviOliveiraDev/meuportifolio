/**
 * Constantes de Recompensas de XP para ações na plataforma DevFolio.
 * Mantém o alinhamento com as regras de completude e engajamento do backend.
 */
export const XP_REWARDS = {
  // Quests de Perfil (Onboarding)
  ADD_BIO: 150,
  ADD_AVATAR: 150,
  CONNECT_GITHUB: 500,
  GENERATE_PDF: 100,

  // Conteúdo do Desenvolvedor
  ADD_PROJECT: 200,
  ADD_EXPERIENCE: 200,
  ADD_EDUCATION: 150,
  ADD_SKILLS: 100, // Recompensado ao cadastrar pelo menos 3 skills

  // Engajamento Diário
  DAILY_SYNC: 50,
  PEER_RECOMMENDATION: 30,
  SHARE_CARD: 30,
} as const;

export type XpRewardType = keyof typeof XP_REWARDS;

/**
 * Mapeia as chaves de recompensa para rótulos legíveis
 */
export const XP_REWARD_LABELS: Record<XpRewardType, string> = {
  ADD_BIO: 'Adicionar biografia ao perfil',
  ADD_AVATAR: 'Carregar foto de perfil (avatar)',
  CONNECT_GITHUB: 'Conectar conta do GitHub',
  GENERATE_PDF: 'Gerar currículo em PDF otimizado',
  ADD_PROJECT: 'Adicionar projeto ao portfólio',
  ADD_EXPERIENCE: 'Adicionar experiência profissional',
  ADD_EDUCATION: 'Adicionar formação acadêmica',
  ADD_SKILLS: 'Adicionar pelo menos 3 habilidades',
  DAILY_SYNC: 'Sincronização diária de commits',
  PEER_RECOMMENDATION: 'Recomendar um colega de trabalho',
  SHARE_CARD: 'Compartilhar Developer Card nas redes sociais',
};
