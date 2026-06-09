import { XP_REWARDS } from '../constants/rewards';

export interface OvrWeights {
  experience: number;
  projects: number;
  skills_badges: number;
  github: number;
  education: number;
  completeness: number;
}

export const DEFAULT_OVR_WEIGHTS: OvrWeights = {
  experience: 30,
  projects: 25,
  skills_badges: 15,
  github: 15,
  education: 10,
  completeness: 5,
};

export interface ProfileDataForOvr {
  profile_completeness?: number;
  github_url?: string | null;
  experiences?: Array<{
    start_date: string;
    end_date?: string | null;
    is_current?: boolean;
  }>;
  projects?: Array<{
    is_featured?: boolean;
    repository_url?: string | null;
    demo_url?: string | null;
    cover_image_url?: string | null;
  }>;
  skills?: Array<{
    pivot?: {
      proficiency_level?: number;
    };
  }>;
  badges?: Array<unknown>;
}

/**
 * Calcula a pontuação de Experiência (Base: 5 anos / 60 meses = 100 pontos)
 */
export function calculateExperienceScore(experiences: ProfileDataForOvr['experiences']): number {
  if (!experiences || experiences.length === 0) return 0;

  let totalMonths = 0;
  for (const exp of experiences) {
    const start = new Date(exp.start_date);
    const end = exp.is_current || !exp.end_date ? new Date() : new Date(exp.end_date);
    
    const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    totalMonths += Math.max(1, diffMonths);
  }

  return Math.min(100, Math.round((totalMonths / 60) * 100));
}

/**
 * Calcula a pontuação de Projetos (Base: completude individual de cada projeto)
 */
export function calculateProjectsScore(projects: ProfileDataForOvr['projects']): number {
  if (!projects || projects.length === 0) return 0;

  let totalScore = 0;
  for (const proj of projects) {
    let score = 10; // Base por existir
    if (proj.is_featured) score += 10;
    if (proj.repository_url) score += 10;
    if (proj.demo_url) score += 10;
    if (proj.cover_image_url) score += 10;
    totalScore += score;
  }

  return Math.min(100, totalScore);
}

/**
 * Calcula a pontuação de Habilidades e Conquistas (Médias de proficiência + bônus de badges)
 */
export function calculateSkillsBadgesScore(
  skills: ProfileDataForOvr['skills'],
  badgesCount: number
): number {
  let skillsAvg = 0;
  if (skills && skills.length > 0) {
    const sum = skills.reduce((acc, curr) => acc + (curr.pivot?.proficiency_level ?? 0), 0);
    skillsAvg = sum / skills.length;
  }

  // Média de skills representa 70% da pontuação, e badges 30% (cada badge dá +10 pontos, max 30)
  const score = (skillsAvg * 0.7) + Math.min(30, badgesCount * 10);
  return Math.min(100, Math.round(score));
}

/**
 * Calcula a pontuação de Atividade do GitHub
 */
export function calculateGithubScore(
  githubUrl: string | null | undefined,
  projects: ProfileDataForOvr['projects']
): number {
  if (!githubUrl) return 0;

  const githubProjectsCount = projects
    ? projects.filter(p => p.repository_url && p.repository_url.includes('github.com')).length
    : 0;

  // 15 pontos por projeto sincronizado + 25 pontos fixos por ter a URL conectada
  const score = (githubProjectsCount * 15) + 25;
  return Math.min(100, score);
}

/**
 * Calcula a pontuação de Formação Acadêmica (Cada entrada vale 50 pontos)
 */
export function calculateEducationScore(educationsCount: number): number {
  return Math.min(100, educationsCount * 50);
}

/**
 * Calcula o OVR e retorna o detalhamento completo dos sub-scores.
 */
export function calculateOvr(
  profile: ProfileDataForOvr,
  educationsCount: number = 0,
  customWeights?: Partial<OvrWeights>
): {
  ovr: number;
  breakdown: OvrWeights;
} {
  const weights = { ...DEFAULT_OVR_WEIGHTS, ...customWeights };

  const expScore = calculateExperienceScore(profile.experiences);
  const projScore = calculateProjectsScore(profile.projects);
  const skillBadgeScore = calculateSkillsBadgesScore(profile.skills, profile.badges?.length ?? 0);
  const githubScore = calculateGithubScore(profile.github_url, profile.projects);
  const eduScore = calculateEducationScore(educationsCount);
  const completenessScore = profile.profile_completeness ?? 0;

  const weightedSum =
    (expScore * weights.experience) +
    (projScore * weights.projects) +
    (skillBadgeScore * weights.skills_badges) +
    (githubScore * weights.github) +
    (eduScore * weights.education) +
    (completenessScore * weights.completeness);

  const totalWeight =
    weights.experience +
    weights.projects +
    weights.skills_badges +
    weights.github +
    weights.education +
    weights.completeness;

  const ovr = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 1;
  const boundedOvr = Math.max(1, Math.min(99, ovr));

  return {
    ovr: boundedOvr,
    breakdown: {
      experience: expScore,
      projects: projScore,
      skills_badges: skillBadgeScore,
      github: githubScore,
      education: eduScore,
      completeness: completenessScore,
    },
  };
}
