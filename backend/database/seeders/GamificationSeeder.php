<?php

namespace Database\Seeders;

use App\Infrastructure\Models\Badge;
use App\Infrastructure\Models\Cosmetic;
use App\Infrastructure\Models\Season;
use App\Infrastructure\Models\Title;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class GamificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Seed Active Season
        $season = Season::firstOrCreate(
            ['name' => 'Temporada Beta 1'],
            [
                'start_date' => now(),
                'end_date' => now()->addMonths(3),
                'is_active' => true,
            ]
        );

        // 2. Seed Badges (Achievements)
        $badges = [
            // Category: Onboarding & Profile (10)
            [
                'name' => 'Primeira Peça',
                'description' => 'Escreva sua biografia profissional (Bio).',
                'category' => 'Onboarding',
                'rarity' => 'comum',
                'xp_reward' => 100,
                'is_secret' => false,
                'icon_path' => 'user-check',
                'rules_criteria' => ['type' => 'bio_filled', 'value' => 1]
            ],
            [
                'name' => 'Estilo Próprio',
                'description' => 'Escolha e salve um tema visual para o seu portfólio.',
                'category' => 'Onboarding',
                'rarity' => 'comum',
                'xp_reward' => 100,
                'is_secret' => false,
                'icon_path' => 'palette',
                'rules_criteria' => ['type' => 'theme_changed', 'value' => 1]
            ],
            [
                'name' => 'Identidade Digital',
                'description' => 'Adicione links para LinkedIn, GitHub e Site Pessoal.',
                'category' => 'Onboarding',
                'rarity' => 'comum',
                'xp_reward' => 100,
                'is_secret' => false,
                'icon_path' => 'globe',
                'rules_criteria' => ['type' => 'networks_filled', 'value' => 1]
            ],
            [
                'name' => 'Geolocalizado',
                'description' => 'Adicione sua localização no perfil.',
                'category' => 'Onboarding',
                'rarity' => 'comum',
                'xp_reward' => 100,
                'is_secret' => false,
                'icon_path' => 'map-pin',
                'rules_criteria' => ['type' => 'location_filled', 'value' => 1]
            ],
            [
                'name' => 'Fotogenia Dev',
                'description' => 'Faça upload de um avatar de perfil personalizado.',
                'category' => 'Onboarding',
                'rarity' => 'comum',
                'xp_reward' => 100,
                'is_secret' => false,
                'icon_path' => 'camera',
                'rules_criteria' => ['type' => 'avatar_filled', 'value' => 1]
            ],
            [
                'name' => 'Perfil Estrela',
                'description' => 'Atingiu 100% de completude do perfil profissional.',
                'category' => 'Onboarding',
                'rarity' => 'epica',
                'xp_reward' => 500,
                'is_secret' => false,
                'icon_path' => 'star',
                'rules_criteria' => ['type' => 'completeness', 'value' => 100]
            ],
            [
                'name' => 'Impecável',
                'description' => 'Mantenha seu perfil em 100% de completude por 30 dias.',
                'category' => 'Onboarding',
                'rarity' => 'rara',
                'xp_reward' => 250,
                'is_secret' => false,
                'icon_path' => 'award',
                'rules_criteria' => ['type' => 'completeness_30_days', 'value' => 1]
            ],
            [
                'name' => 'Modo Escuro Ativo',
                'description' => 'Escolha um tema escuro para o seu card.',
                'category' => 'Onboarding',
                'rarity' => 'comum',
                'xp_reward' => 100,
                'is_secret' => false,
                'icon_path' => 'moon',
                'rules_criteria' => ['type' => 'dark_mode', 'value' => 1]
            ],
            [
                'name' => 'Primeira Impressão',
                'description' => 'Escreva um título/tagline personalizado.',
                'category' => 'Onboarding',
                'rarity' => 'comum',
                'xp_reward' => 100,
                'is_secret' => false,
                'icon_path' => 'heading',
                'rules_criteria' => ['type' => 'role_filled', 'value' => 1]
            ],
            [
                'name' => 'Open To Work',
                'description' => 'Ative a disponibilidade de contratação no perfil.',
                'category' => 'Onboarding',
                'rarity' => 'comum',
                'xp_reward' => 100,
                'is_secret' => false,
                'icon_path' => 'briefcase',
                'rules_criteria' => ['type' => 'open_to_work', 'value' => 1]
            ],

            // Category: Projects Showcase (10)
            [
                'name' => 'Primeiro Tijolo',
                'description' => 'Cadastre o primeiro projeto no portfólio.',
                'category' => 'Projects',
                'rarity' => 'comum',
                'xp_reward' => 100,
                'is_secret' => false,
                'icon_path' => 'folder-plus',
                'rules_criteria' => ['type' => 'projects_count', 'value' => 1]
            ],
            [
                'name' => 'Portfólio Ativo',
                'description' => 'Cadastre pelo menos 3 projetos no portfólio.',
                'category' => 'Projects',
                'rarity' => 'comum',
                'xp_reward' => 100,
                'is_secret' => false,
                'icon_path' => 'folder-kanban',
                'rules_criteria' => ['type' => 'projects_count', 'value' => 3]
            ],
            [
                'name' => 'Galeria de Elite',
                'description' => 'Cadastre 10 ou mais projetos.',
                'category' => 'Projects',
                'rarity' => 'epica',
                'xp_reward' => 500,
                'is_secret' => false,
                'icon_path' => 'layers',
                'rules_criteria' => ['type' => 'projects_count', 'value' => 10]
            ],
            [
                'name' => 'Grande Museu',
                'description' => 'Cadastre 25 ou mais projetos.',
                'category' => 'Projects',
                'rarity' => 'lendaria',
                'xp_reward' => 1000,
                'is_secret' => false,
                'icon_path' => 'box',
                'rules_criteria' => ['type' => 'projects_count', 'value' => 25]
            ],
            [
                'name' => 'Destaque Visual',
                'description' => 'Adicione imagens de capa para pelo menos 3 projetos.',
                'category' => 'Projects',
                'rarity' => 'rara',
                'xp_reward' => 250,
                'is_secret' => false,
                'icon_path' => 'image',
                'rules_criteria' => ['type' => 'cover_image_count', 'value' => 3]
            ],
            [
                'name' => 'Show and Tell',
                'description' => 'Insira links de demonstração ativos em 3 projetos.',
                'category' => 'Projects',
                'rarity' => 'rara',
                'xp_reward' => 250,
                'is_secret' => false,
                'icon_path' => 'eye',
                'rules_criteria' => ['type' => 'demo_url_count', 'value' => 3]
            ],
            [
                'name' => 'Curador',
                'description' => 'Marque pelo menos 2 projetos como Destaque.',
                'category' => 'Projects',
                'rarity' => 'rara',
                'xp_reward' => 250,
                'is_secret' => false,
                'icon_path' => 'pin',
                'rules_criteria' => ['type' => 'featured_projects', 'value' => 2]
            ],
            [
                'name' => 'Documentador',
                'description' => 'Escreva descrições detalhadas (200+ palavras) para 3 projetos.',
                'category' => 'Projects',
                'rarity' => 'rara',
                'xp_reward' => 250,
                'is_secret' => false,
                'icon_path' => 'file-text',
                'rules_criteria' => ['type' => 'detailed_projects_count', 'value' => 3]
            ],
            [
                'name' => 'Portfólio Completo',
                'description' => 'Preencha repo, demo, tags e imagens em 5 projetos.',
                'category' => 'Projects',
                'rarity' => 'epica',
                'xp_reward' => 500,
                'is_secret' => false,
                'icon_path' => 'gem',
                'rules_criteria' => ['type' => 'complete_projects_count', 'value' => 5]
            ],
            [
                'name' => 'Bug Slayer',
                'description' => 'Cadastre 10 versões/releases de um mesmo projeto.',
                'category' => 'Projects',
                'rarity' => 'rara',
                'xp_reward' => 250,
                'is_secret' => false,
                'icon_path' => 'bug',
                'rules_criteria' => ['type' => 'project_versions_count', 'value' => 10]
            ],

            // Category: GitHub & Integrations (10)
            [
                'name' => 'Octocat Connect',
                'description' => 'Conecte a conta do GitHub ao portfólio.',
                'category' => 'GitHub',
                'rarity' => 'comum',
                'xp_reward' => 100,
                'is_secret' => false,
                'icon_path' => 'github',
                'rules_criteria' => ['type' => 'github_connected', 'value' => 1]
            ],
            [
                'name' => 'Primeiro Sync',
                'description' => 'Execute sua primeira sincronização de repositórios.',
                'category' => 'GitHub',
                'rarity' => 'comum',
                'xp_reward' => 100,
                'is_secret' => false,
                'icon_path' => 'refresh-cw',
                'rules_criteria' => ['type' => 'projects_count', 'value' => 1]
            ],
            [
                'name' => 'Commit Inicial',
                'description' => 'Sincronize um repositório com pelo menos 1 commit.',
                'category' => 'GitHub',
                'rarity' => 'comum',
                'xp_reward' => 100,
                'is_secret' => false,
                'icon_path' => 'git-commit',
                'rules_criteria' => ['type' => 'github_commits', 'value' => 1]
            ],
            [
                'name' => 'Sua Primeira Centena',
                'description' => 'Sincronize 100+ commits acumulados.',
                'category' => 'GitHub',
                'rarity' => 'rara',
                'xp_reward' => 250,
                'is_secret' => false,
                'icon_path' => 'activity',
                'rules_criteria' => ['type' => 'github_commits', 'value' => 100]
            ],
            [
                'name' => 'Maquinista de Código',
                'description' => 'Sincronize 500+ commits acumulados.',
                'category' => 'GitHub',
                'rarity' => 'epica',
                'xp_reward' => 500,
                'is_secret' => false,
                'icon_path' => 'server',
                'rules_criteria' => ['type' => 'github_commits', 'value' => 500]
            ],
            [
                'name' => 'Forjador de Ferro',
                'description' => 'Sincronize 1000+ commits acumulados.',
                'category' => 'GitHub',
                'rarity' => 'lendaria',
                'xp_reward' => 1000,
                'is_secret' => false,
                'icon_path' => 'hammer',
                'rules_criteria' => ['type' => 'github_commits', 'value' => 1000]
            ],
            [
                'name' => 'Open Source Advocate',
                'description' => 'Sincronize um projeto que possui pelo menos 5 estrelas.',
                'category' => 'GitHub',
                'rarity' => 'rara',
                'xp_reward' => 250,
                'is_secret' => false,
                'icon_path' => 'star-half',
                'rules_criteria' => ['type' => 'github_stars', 'value' => 5]
            ],
            [
                'name' => 'Lenda Open Source',
                'description' => 'Sincronize um projeto com mais de 100 estrelas.',
                'category' => 'GitHub',
                'rarity' => 'lendaria',
                'xp_reward' => 1000,
                'is_secret' => false,
                'icon_path' => 'flame',
                'rules_criteria' => ['type' => 'github_stars', 'value' => 100]
            ],
            [
                'name' => 'Deploy Automático',
                'description' => 'Configure um webhook de atualização do GitHub.',
                'category' => 'GitHub',
                'rarity' => 'epica',
                'xp_reward' => 500,
                'is_secret' => false,
                'icon_path' => 'zap',
                'rules_criteria' => ['type' => 'github_webhook', 'value' => 1]
            ],
            [
                'name' => 'Monstro do Git',
                'description' => 'Sincronize 10 ou mais repositórios ativos.',
                'category' => 'GitHub',
                'rarity' => 'epica',
                'xp_reward' => 500,
                'is_secret' => false,
                'icon_path' => 'git-branch',
                'rules_criteria' => ['type' => 'github_repos', 'value' => 10]
            ],

            // Category: Developer Tools & Stack (10)
            [
                'name' => 'Laravel Master',
                'description' => 'Projetos ou habilidades contendo Laravel com proficiência 80+.',
                'category' => 'Developer Stack',
                'rarity' => 'rara',
                'xp_reward' => 250,
                'is_secret' => false,
                'icon_path' => 'flame',
                'rules_criteria' => ['type' => 'tech_skill', 'skill' => 'Laravel', 'value' => 80]
            ],
            [
                'name' => 'React Specialist',
                'description' => 'Projetos ou habilidades utilizando React ou Next.js.',
                'category' => 'Developer Stack',
                'rarity' => 'rara',
                'xp_reward' => 250,
                'is_secret' => false,
                'icon_path' => 'atom',
                'rules_criteria' => ['type' => 'tech_skill', 'skill' => 'React', 'value' => 80]
            ],
            [
                'name' => 'Docker Commander',
                'description' => 'Associe a tecnologia Docker a pelo menos 2 projetos.',
                'category' => 'Developer Stack',
                'rarity' => 'rara',
                'xp_reward' => 250,
                'is_secret' => false,
                'icon_path' => 'box',
                'rules_criteria' => ['type' => 'docker_projects', 'value' => 2]
            ],
            [
                'name' => 'Docker Captain',
                'description' => 'Docker detectado em projetos com docker-compose.yml.',
                'category' => 'Developer Stack',
                'rarity' => 'epica',
                'xp_reward' => 500,
                'is_secret' => false,
                'icon_path' => 'ship',
                'rules_criteria' => ['type' => 'docker_compose', 'value' => 1]
            ],
            [
                'name' => 'GitFlow Disciple',
                'description' => 'Repositório sincronizado com main, develop e feature/*.',
                'category' => 'Developer Stack',
                'rarity' => 'epica',
                'xp_reward' => 500,
                'is_secret' => false,
                'icon_path' => 'git-merge',
                'rules_criteria' => ['type' => 'gitflow', 'value' => 1]
            ],
            [
                'name' => 'CI/CD Warrior',
                'description' => 'Projeto configurado com GitHub Actions.',
                'category' => 'Developer Stack',
                'rarity' => 'epica',
                'xp_reward' => 500,
                'is_secret' => false,
                'icon_path' => 'workflow',
                'rules_criteria' => ['type' => 'github_actions', 'value' => 1]
            ],
            [
                'name' => 'Cloud Explorer',
                'description' => 'Projeto com deploys na AWS ou Cloudflare.',
                'category' => 'Developer Stack',
                'rarity' => 'rara',
                'xp_reward' => 250,
                'is_secret' => false,
                'icon_path' => 'cloud',
                'rules_criteria' => ['type' => 'cloud_deploy', 'value' => 1]
            ],
            [
                'name' => 'Full Cycle Developer',
                'description' => 'Projeto contendo Frontend, Backend, Banco e Deploy.',
                'category' => 'Developer Stack',
                'rarity' => 'lendaria',
                'xp_reward' => 1000,
                'is_secret' => false,
                'icon_path' => 'layers',
                'rules_criteria' => ['type' => 'full_cycle', 'value' => 1]
            ],
            [
                'name' => 'Polyglot Engineer',
                'description' => 'Cadastre habilidades em 5 linguagens diferentes.',
                'category' => 'Developer Stack',
                'rarity' => 'epica',
                'xp_reward' => 500,
                'is_secret' => false,
                'icon_path' => 'binary',
                'rules_criteria' => ['type' => 'polyglot', 'value' => 5]
            ],
            [
                'name' => 'SaaS Founder',
                'description' => 'Cadastre um projeto marcado com a tag "SaaS".',
                'category' => 'Developer Stack',
                'rarity' => 'rara',
                'xp_reward' => 250,
                'is_secret' => false,
                'icon_path' => 'building-2',
                'rules_criteria' => ['type' => 'saas_tag', 'value' => 1]
            ],

            // Category: Career & Experience (10)
            [
                'name' => 'Ponto de Partida',
                'description' => 'Adicione sua primeira experiência profissional.',
                'category' => 'Career',
                'rarity' => 'comum',
                'xp_reward' => 100,
                'is_secret' => false,
                'icon_path' => 'briefcase',
                'rules_criteria' => ['type' => 'experiences_count', 'value' => 1]
            ],
            [
                'name' => 'Carreira em Foco',
                'description' => 'Adicione pelo menos 2 experiências profissionais.',
                'category' => 'Career',
                'rarity' => 'comum',
                'xp_reward' => 100,
                'is_secret' => false,
                'icon_path' => 'building',
                'rules_criteria' => ['type' => 'experiences_count', 'value' => 2]
            ],
            [
                'name' => 'Histórico de Respeito',
                'description' => 'Adicione 5 ou mais experiências de carreira.',
                'category' => 'Career',
                'rarity' => 'rara',
                'xp_reward' => 250,
                'is_secret' => false,
                'icon_path' => 'history',
                'rules_criteria' => ['type' => 'experiences_count', 'value' => 5]
            ],
            [
                'name' => 'Fidelidade',
                'description' => 'Uma experiência com mais de 2 anos na mesma empresa.',
                'category' => 'Career',
                'rarity' => 'rara',
                'xp_reward' => 250,
                'is_secret' => false,
                'icon_path' => 'clock',
                'rules_criteria' => ['type' => 'experience_years', 'value' => 2]
            ],
            [
                'name' => 'Liderança Técnica',
                'description' => 'Adicione cargo de Tech Lead, Arquiteto ou Gerente.',
                'category' => 'Career',
                'rarity' => 'epica',
                'xp_reward' => 500,
                'is_secret' => false,
                'icon_path' => 'shield-alert',
                'rules_criteria' => ['type' => 'leadership_role', 'value' => 1]
            ],
            [
                'name' => 'Carreira Global',
                'description' => 'Adicione uma experiência internacional.',
                'category' => 'Career',
                'rarity' => 'epica',
                'xp_reward' => 500,
                'is_secret' => false,
                'icon_path' => 'globe-2',
                'rules_criteria' => ['type' => 'international_experience', 'value' => 1]
            ],
            [
                'name' => 'Veterano de Guerra',
                'description' => 'Acumule mais de 10 anos de experiência profissional.',
                'category' => 'Career',
                'rarity' => 'lendaria',
                'xp_reward' => 1000,
                'is_secret' => false,
                'icon_path' => 'crown',
                'rules_criteria' => ['type' => 'experience_months', 'value' => 120]
            ],

            // Category: Empregabilidade & Currículo (10)
            [
                'name' => 'Currículo Exportado',
                'description' => 'Gere seu primeiro currículo em PDF otimizado para ATS.',
                'category' => 'Resume',
                'rarity' => 'comum',
                'xp_reward' => 100,
                'is_secret' => false,
                'icon_path' => 'file-down',
                'rules_criteria' => ['type' => 'pdf_exports', 'value' => 1]
            ],
            [
                'name' => 'Pronto para Vagas',
                'description' => 'Preencha Educação, Idiomas e Certificações.',
                'category' => 'Resume',
                'rarity' => 'rara',
                'xp_reward' => 250,
                'is_secret' => false,
                'icon_path' => 'check-square',
                'rules_criteria' => ['type' => 'resume_completed', 'value' => 1]
            ],
            [
                'name' => 'Sempre Pronto',
                'description' => 'Exporte o PDF do currículo 5+ vezes.',
                'category' => 'Resume',
                'rarity' => 'rara',
                'xp_reward' => 250,
                'is_secret' => false,
                'icon_path' => 'refresh-cw',
                'rules_criteria' => ['type' => 'pdf_exports', 'value' => 5]
            ],
            [
                'name' => 'Padrão Ouro ATS',
                'description' => 'Pontuação de legibilidade ATS acima de 95%.',
                'category' => 'Resume',
                'rarity' => 'epica',
                'xp_reward' => 500,
                'is_secret' => false,
                'icon_path' => 'sparkles',
                'rules_criteria' => ['type' => 'pdf_ats_score', 'value' => 95]
            ],

            // Category: Consistência & Streaks (10)
            [
                'name' => '🔥 Warm Up',
                'description' => 'Acesse a plataforma por 3 dias consecutivos.',
                'category' => 'Streaks',
                'rarity' => 'comum',
                'xp_reward' => 100,
                'is_secret' => false,
                'icon_path' => 'flame',
                'rules_criteria' => ['type' => 'streak', 'value' => 3]
            ],
            [
                'name' => '🔥 Consistente',
                'description' => 'Acesse a plataforma por 7 dias consecutivos.',
                'category' => 'Streaks',
                'rarity' => 'rara',
                'xp_reward' => 250,
                'is_secret' => false,
                'icon_path' => 'flame',
                'rules_criteria' => ['type' => 'streak', 'value' => 7]
            ],
            [
                'name' => '🔥 Incansável',
                'description' => 'Acesse a plataforma por 15 dias consecutivos.',
                'category' => 'Streaks',
                'rarity' => 'rara',
                'xp_reward' => 250,
                'is_secret' => false,
                'icon_path' => 'flame',
                'rules_criteria' => ['type' => 'streak', 'value' => 15]
            ],
            [
                'name' => '🔥 Obsessivo',
                'description' => 'Acesse a plataforma por 30 dias consecutivos.',
                'category' => 'Streaks',
                'rarity' => 'epica',
                'xp_reward' => 500,
                'is_secret' => false,
                'icon_path' => 'flame',
                'rules_criteria' => ['type' => 'streak', 'value' => 30]
            ],
            [
                'name' => '🔥 Monge do Código',
                'description' => 'Acesse a plataforma por 60 dias consecutivos.',
                'category' => 'Streaks',
                'rarity' => 'epica',
                'xp_reward' => 500,
                'is_secret' => false,
                'icon_path' => 'flame',
                'rules_criteria' => ['type' => 'streak', 'value' => 60]
            ],
            [
                'name' => '🔥 Sem Limites',
                'description' => 'Acesse a plataforma por 100 dias consecutivos.',
                'category' => 'Streaks',
                'rarity' => 'lendaria',
                'xp_reward' => 1000,
                'is_secret' => false,
                'icon_path' => 'flame',
                'rules_criteria' => ['type' => 'streak', 'value' => 100]
            ],
            [
                'name' => '🔥 Imparável',
                'description' => 'Acesse a plataforma por 365 dias consecutivos.',
                'category' => 'Streaks',
                'rarity' => 'mitica',
                'xp_reward' => 2500,
                'is_secret' => false,
                'icon_path' => 'flame',
                'rules_criteria' => ['type' => 'streak', 'value' => 365]
            ],

            // Category: Card & OVR (10)
            [
                'name' => 'Meu Primeiro Card',
                'description' => 'Acesse e configure a foto do seu Developer Card.',
                'category' => 'Card',
                'rarity' => 'comum',
                'xp_reward' => 100,
                'is_secret' => false,
                'icon_path' => 'contact',
                'rules_criteria' => ['type' => 'card_accessed', 'value' => 1]
            ],
            [
                'name' => 'Em Evolução',
                'description' => 'Alcance OVR 60+ no Developer Card.',
                'category' => 'Card',
                'rarity' => 'comum',
                'xp_reward' => 100,
                'is_secret' => false,
                'icon_path' => 'trending-up',
                'rules_criteria' => ['type' => 'ovr', 'value' => 60]
            ],
            [
                'name' => 'Elite Developer',
                'description' => 'Alcance OVR 85+ no Developer Card.',
                'category' => 'Card',
                'rarity' => 'epica',
                'xp_reward' => 500,
                'is_secret' => false,
                'icon_path' => 'crown',
                'rules_criteria' => ['type' => 'ovr', 'value' => 85]
            ],
            [
                'name' => 'Inquebrável',
                'description' => 'Alcance OVR 90+ no Developer Card.',
                'category' => 'Card',
                'rarity' => 'lendaria',
                'xp_reward' => 1000,
                'is_secret' => false,
                'icon_path' => 'shield',
                'rules_criteria' => ['type' => 'ovr', 'value' => 90]
            ],
            [
                'name' => 'Lenda Suprema',
                'description' => 'Alcance OVR 95+ no Developer Card.',
                'category' => 'Card',
                'rarity' => 'mitica',
                'xp_reward' => 2500,
                'is_secret' => false,
                'icon_path' => 'zap-off',
                'rules_criteria' => ['type' => 'ovr', 'value' => 95]
            ],

            // Category: Community (10)
            [
                'name' => 'Alô Mundo',
                'description' => 'Compartilhe seu link DevFolio no LinkedIn ou Twitter.',
                'category' => 'Community',
                'rarity' => 'comum',
                'xp_reward' => 100,
                'is_secret' => false,
                'icon_path' => 'share-2',
                'rules_criteria' => ['type' => 'shares', 'value' => 1]
            ],
            [
                'name' => 'Vitrine Pública',
                'description' => 'Alcance 100 visualizações únicas em seu portfólio.',
                'category' => 'Community',
                'rarity' => 'rara',
                'xp_reward' => 250,
                'is_secret' => false,
                'icon_path' => 'users',
                'rules_criteria' => ['type' => 'views', 'value' => 100]
            ],
            [
                'name' => 'Popularidade',
                'description' => 'Alcance 1000 visualizações únicas.',
                'category' => 'Community',
                'rarity' => 'epica',
                'xp_reward' => 500,
                'is_secret' => false,
                'icon_path' => 'compass',
                'rules_criteria' => ['type' => 'views', 'value' => 1000]
            ],
            [
                'name' => 'Estrela da Comunidade',
                'description' => 'Alcance 5000 visualizações únicas.',
                'category' => 'Community',
                'rarity' => 'lendaria',
                'xp_reward' => 1000,
                'is_secret' => false,
                'icon_path' => 'heart',
                'rules_criteria' => ['type' => 'views', 'value' => 5000]
            ],
            [
                'name' => 'Viralizou',
                'description' => 'Obtenha mais de 100 visualizações em um único dia.',
                'category' => 'Community',
                'rarity' => 'epica',
                'xp_reward' => 500,
                'is_secret' => false,
                'icon_path' => 'flame-kindling',
                'rules_criteria' => ['type' => 'views_one_day', 'value' => 100]
            ],

            // Category: Secrets (10)
            [
                'name' => 'Café com Código',
                'description' => 'Salve dados do perfil exatamente às 04:04 da manhã.',
                'category' => 'Secrets',
                'rarity' => 'rara',
                'xp_reward' => 250,
                'is_secret' => true,
                'icon_path' => 'coffee',
                'rules_criteria' => ['type' => 'secret_time_0404', 'value' => 1]
            ],
            [
                'name' => 'Recursão Infinita',
                'description' => 'Cadastre o próprio DevFolio como um projeto do seu portfólio.',
                'category' => 'Secrets',
                'rarity' => 'epica',
                'xp_reward' => 500,
                'is_secret' => true,
                'icon_path' => 'infinity',
                'rules_criteria' => ['type' => 'secret_own_url', 'value' => 1]
            ],
            [
                'name' => 'Easter Egg Hunter',
                'description' => 'Clique 10 vezes seguidas no avatar do seu Developer Card.',
                'category' => 'Secrets',
                'rarity' => 'rara',
                'xp_reward' => 250,
                'is_secret' => true,
                'icon_path' => 'mouse-pointer-click',
                'rules_criteria' => ['type' => 'secret_clicks', 'value' => 10]
            ],
            [
                'name' => 'Quebrando a Matriz',
                'description' => 'Insira o Konami Code no teclado dentro do Dashboard.',
                'category' => 'Secrets',
                'rarity' => 'epica',
                'xp_reward' => 500,
                'is_secret' => true,
                'icon_path' => 'gamepad-2',
                'rules_criteria' => ['type' => 'secret_konami', 'value' => 1]
            ],
            [
                'name' => 'PHP Forever',
                'description' => 'Cadastre PHP e não possua JS por 24h consecutivas.',
                'category' => 'Secrets',
                'rarity' => 'epica',
                'xp_reward' => 500,
                'is_secret' => true,
                'icon_path' => 'heart-handshake',
                'rules_criteria' => ['type' => 'secret_php_only', 'value' => 1]
            ],
            [
                'name' => 'Perfeccionista',
                'description' => 'Mude o tema visual do portfólio 10 vezes em 10 minutos.',
                'category' => 'Secrets',
                'rarity' => 'rara',
                'xp_reward' => 250,
                'is_secret' => true,
                'icon_path' => 'refresh-cw',
                'rules_criteria' => ['type' => 'secret_theme_spam', 'value' => 10]
            ],
            [
                'name' => 'Sem Filtros',
                'description' => 'Gere um currículo em PDF na primeira tentativa sem preencher a bio.',
                'category' => 'Secrets',
                'rarity' => 'rara',
                'xp_reward' => 250,
                'is_secret' => true,
                'icon_path' => 'alert-triangle',
                'rules_criteria' => ['type' => 'secret_pdf_no_bio', 'value' => 1]
            ],
            [
                'name' => 'Deus do Código',
                'description' => 'Alcance o nível 50 no DevFolio.',
                'category' => 'Secrets',
                'rarity' => 'mitica',
                'xp_reward' => 2500,
                'is_secret' => true,
                'icon_path' => 'shield-alert',
                'rules_criteria' => ['type' => 'level', 'value' => 50]
            ],
            [
                'name' => 'Night Owl',
                'description' => 'Faça um commit ou sync de GitHub entre 00:00 e 05:00.',
                'category' => 'Secrets',
                'rarity' => 'rara',
                'xp_reward' => 250,
                'is_secret' => true,
                'icon_path' => 'moon-star',
                'rules_criteria' => ['type' => 'secret_night_commits', 'value' => 1]
            ],
            [
                'name' => 'Weekend Builder',
                'description' => 'Faça commits ou atualizações em finais de semana.',
                'category' => 'Secrets',
                'rarity' => 'rara',
                'xp_reward' => 250,
                'is_secret' => true,
                'icon_path' => 'calendar-days',
                'rules_criteria' => ['type' => 'secret_weekend_commits', 'value' => 1]
            ],
        ];

        foreach ($badges as $badgeData) {
            Badge::firstOrCreate(
                ['name' => $badgeData['name']],
                [
                    'description' => $badgeData['description'],
                    'category' => $badgeData['category'],
                    'rarity' => $badgeData['rarity'],
                    'xp_reward' => $badgeData['xp_reward'],
                    'is_secret' => $badgeData['is_secret'],
                    'icon_path' => $badgeData['icon_path'],
                    'rules_criteria' => $badgeData['rules_criteria'],
                    'is_active' => true,
                ]
            );
        }

        // 3. Link progressive parents
        $badge1 = Badge::where('name', 'Primeiro Tijolo')->first();
        $badge2 = Badge::where('name', 'Portfólio Ativo')->first();
        $badge3 = Badge::where('name', 'Galeria de Elite')->first();
        $badge4 = Badge::where('name', 'Grande Museu')->first();

        if ($badge1 && $badge2) {
            $badge2->update(['parent_badge_id' => $badge1->id]);
        }
        if ($badge2 && $badge3) {
            $badge3->update(['parent_badge_id' => $badge2->id]);
        }
        if ($badge3 && $badge4) {
            $badge4->update(['parent_badge_id' => $badge3->id]);
        }

        // 4. Seed Titles
        $titles = [
            ['name' => 'Dev Rookie', 'unlock_badge_name' => 'Primeiro Tijolo'],
            ['name' => 'Bug Hunter', 'unlock_badge_name' => 'Bug Slayer'],
            ['name' => 'Code Alchemist', 'unlock_badge_name' => 'Polyglot Engineer'],
            ['name' => 'Cloud Explorer', 'unlock_badge_name' => 'Cloud Explorer'],
            ['name' => 'Infrastructure Mage', 'unlock_badge_name' => 'Docker Captain'],
            ['name' => 'Docker Captain', 'unlock_badge_name' => 'Docker Captain'],
            ['name' => 'CI/CD Warrior', 'unlock_badge_name' => 'CI/CD Warrior'],
            ['name' => 'SaaS Builder', 'unlock_badge_name' => 'SaaS Founder'],
            ['name' => 'Tech Lead', 'unlock_badge_name' => 'Liderança Técnica'],
            ['name' => 'Principal Engineer', 'unlock_badge_name' => 'Veterano de Guerra'],
            ['name' => 'Architect Supreme', 'unlock_badge_name' => 'Deus do Código'],
        ];

        foreach ($titles as $titleData) {
            $badge = Badge::where('name', $titleData['unlock_badge_name'])->first();
            Title::firstOrCreate(
                ['name' => $titleData['name']],
                [
                    'unlock_badge_id' => $badge?->id,
                    'is_active' => true,
                ]
            );
        }

        // 5. Seed Cosmetics
        $cosmetics = [
            // Borders
            ['name' => 'Moldura Bronze', 'type' => 'border', 'value' => 'border-amber-800', 'unlock_badge_name' => 'Meu Primeiro Card'],
            ['name' => 'Moldura Silver', 'type' => 'border', 'value' => 'border-slate-400', 'unlock_badge_name' => 'Em Evolução'],
            ['name' => 'Moldura Gold', 'type' => 'border', 'value' => 'border-yellow-500', 'unlock_badge_name' => null],
            ['name' => 'Moldura Diamond', 'type' => 'border', 'value' => 'border-sky-500', 'unlock_badge_name' => 'Elite Developer'],
            ['name' => 'Moldura Legendary', 'type' => 'border', 'value' => 'border-purple-600', 'unlock_badge_name' => 'Inquebrável'],
            ['name' => 'Neon Cyberpunk', 'type' => 'border', 'value' => 'border-neon-cyber', 'unlock_badge_name' => 'CI/CD Warrior'],

            // Backgrounds
            ['name' => 'Nebula', 'type' => 'background', 'value' => 'bg-nebula', 'unlock_badge_name' => null],
            ['name' => 'Cyber City', 'type' => 'background', 'value' => 'bg-cyber-city', 'unlock_badge_name' => null],
            ['name' => 'Matrix Core', 'type' => 'background', 'value' => 'bg-matrix-core', 'unlock_badge_name' => 'Quebrando a Matriz'],
            ['name' => 'Dark Matter', 'type' => 'background', 'value' => 'bg-dark-matter', 'unlock_badge_name' => null],
            ['name' => 'Space Station', 'type' => 'background', 'value' => 'bg-space-station', 'unlock_badge_name' => null],
            ['name' => 'Terminal Hacker', 'type' => 'background', 'value' => 'bg-terminal-hacker', 'unlock_badge_name' => null],
            ['name' => 'Aurora', 'type' => 'background', 'value' => 'bg-aurora', 'unlock_badge_name' => null],
            ['name' => 'Volcanic', 'type' => 'background', 'value' => 'bg-volcanic', 'unlock_badge_name' => null],
            ['name' => 'Quantum', 'type' => 'background', 'value' => 'bg-quantum', 'unlock_badge_name' => null],

            // Effects
            ['name' => 'Glow', 'type' => 'effect', 'value' => 'effect-glow', 'unlock_badge_name' => null],
            ['name' => 'Particles', 'type' => 'effect', 'value' => 'effect-particles', 'unlock_badge_name' => null],
            ['name' => 'Lightning', 'type' => 'effect', 'value' => 'effect-lightning', 'unlock_badge_name' => null],
            ['name' => 'Floating Code', 'type' => 'effect', 'value' => 'effect-floating-code', 'unlock_badge_name' => null],
            ['name' => 'Hologram', 'type' => 'effect', 'value' => 'effect-hologram', 'unlock_badge_name' => 'Recursão Infinita'],
            ['name' => 'Fire Aura', 'type' => 'effect', 'value' => 'effect-fire-aura', 'unlock_badge_name' => 'Laravel Master'],
            ['name' => 'Ice Aura', 'type' => 'effect', 'value' => 'effect-ice-aura', 'unlock_badge_name' => null],
        ];

        foreach ($cosmetics as $cosm) {
            $badge = $cosm['unlock_badge_name'] ? Badge::where('name', $cosm['unlock_badge_name'])->first() : null;
            Cosmetic::firstOrCreate(
                ['name' => $cosm['name']],
                [
                    'type' => $cosm['type'],
                    'value' => $cosm['value'],
                    'unlock_badge_id' => $badge?->id,
                ]
            );
        }
    }
}
