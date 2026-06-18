<?php

namespace Database\Seeders;

use App\Infrastructure\Models\User;
use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\Project;
use App\Infrastructure\Models\Experience;
use App\Infrastructure\Models\Education;
use App\Infrastructure\Models\Evidence;
use App\Infrastructure\Models\Technology;
use App\Domain\Gamification\Services\Reputation\ScorePipeline;
use App\Domain\Gamification\Services\Reputation\EvidenceSyncService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TestUsersSeeder extends Seeder
{
    public function run(): void
    {
        $pipeline = app(ScorePipeline::class);
        $syncService = app(EvidenceSyncService::class);

        // Buscar tecnologias principais
        $laravel = Technology::where('slug', 'laravel')->first();
        $php = Technology::where('slug', 'php')->first();
        $react = Technology::where('slug', 'react')->orWhere('slug', 'react-js')->orWhere('slug', 'reactjs')->first();
        $typescript = Technology::where('slug', 'typescript')->first();
        $javascript = Technology::where('slug', 'javascript')->first();
        $html = Technology::where('slug', 'html')->first();
        $css = Technology::where('slug', 'css')->first();
        $docker = Technology::where('slug', 'docker')->first();
        $postgresql = Technology::where('slug', 'postgresql')->orWhere('slug', 'postgres')->first();

        // Tecnologias avançadas
        $python = Technology::where('slug', 'python')->first();
        $flutter = Technology::where('slug', 'flutter')->first();
        $kubernetes = Technology::where('slug', 'kubernetes')->first();
        $pytorch = Technology::where('slug', 'pytorch')->first();
        $tensorflow = Technology::where('slug', 'tensorflow')->first();
        $jest = Technology::where('slug', 'jest')->first();
        $cypress = Technology::where('slug', 'cypress')->first();
        $cLang = Technology::where('slug', 'c')->first();
        $rust = Technology::where('slug', 'rust')->first();
        $solidity = Technology::where('slug', 'solidity')->first();

        // Novas tecnologias de outros domínios para a seed completa
        $ansible = Technology::where('slug', 'ansible')->first();
        $nginx = Technology::where('slug', 'nginx')->first();
        $apacheSpark = Technology::where('slug', 'apache-spark')->first();
        $apacheAirflow = Technology::where('slug', 'apache-airflow')->first();
        $snowflake = Technology::where('slug', 'snowflake')->first();
        $kaliLinux = Technology::where('slug', 'kali-linux')->first();
        $hashicorpVault = Technology::where('slug', 'hashicorp-vault')->first();
        $sonarQube = Technology::where('slug', 'sonarqube')->first();
        $phpUnit = Technology::where('slug', 'phpunit')->first();
        $esp32 = Technology::where('slug', 'esp32')->first();
        $hardhat = Technology::where('slug', 'hardhat')->first();
        $ethersJs = Technology::where('slug', 'ethers-js')->orWhere('slug', 'ethersjs')->first();

        // -------------------------------------------------------------
        // 1. USUÁRIO JÚNIOR
        // -------------------------------------------------------------
        $this->command->info('Criando usuário Júnior...');
        $juniorUser = User::updateOrCreate(
            ['email' => 'junior@devfolio.com'],
            ['password' => Hash::make('password'), 'email_verified_at' => now()]
        );

        $juniorProfile = Profile::updateOrCreate(
            ['user_id' => $juniorUser->id],
            [
                'username' => 'junior',
                'name' => 'Júlia Júnior Dev',
                'avatar_url' => 'https://api.dicebear.com/7.x/adventurer/svg?seed=julia',
                'bio' => 'Desenvolvedora Frontend Júnior iniciando no ecossistema Web. Focada em HTML, CSS e JavaScript básico.',
                'role' => 'Junior Frontend Developer',
                'location' => 'Rio de Janeiro, Brasil',
                'github_url' => 'https://github.com/junior-julia',
                'theme_name' => 'minimalist',
                'is_active' => true,
            ]
        );

        // Experiência
        $juniorExp = Experience::create([
            'profile_id' => $juniorProfile->id,
            'company' => 'Startup Começo',
            'role' => 'Junior Frontend Developer',
            'description' => 'Manutenção de layouts responsivos e design de email marketing com HTML/CSS.',
            'start_date' => now()->subMonths(6)->toDateString(),
            'is_current' => true,
        ]);
        $syncService->syncExperience($juniorExp, [
            ['id' => $html->id, 'usage_depth' => 'primary', 'is_primary' => true],
            ['id' => $css->id, 'usage_depth' => 'primary', 'is_primary' => true],
            ['id' => $javascript->id, 'usage_depth' => 'used', 'is_primary' => false],
        ]);

        // Projeto
        $juniorProj = Project::create([
            'profile_id' => $juniorProfile->id,
            'title' => 'Personal Portfolio Webpage',
            'description' => 'Um portfólio pessoal construído com HTML5 e CSS3 sem frameworks, focado em semântica e acessibilidade.',
            'is_featured' => false,
            'order_weight' => 1,
        ]);
        $syncService->syncProject($juniorProj, [
            ['id' => $html->id, 'usage_depth' => 'primary', 'is_primary' => true],
            ['id' => $css->id, 'usage_depth' => 'used', 'is_primary' => false],
        ]);

        // Formação
        $juniorEdu = Education::create([
            'profile_id' => $juniorProfile->id,
            'institution' => 'Faculdade de Tecnologia Carioca',
            'course' => 'Análise e Desenvolvimento de Sistemas',
            'start_date' => now()->subYears(2)->toDateString(),
            'is_current' => true,
        ]);
        $syncService->syncEducation($juniorEdu, [
            ['id' => $html->id, 'usage_depth' => 'used', 'is_primary' => false],
            ['id' => $css->id, 'usage_depth' => 'used', 'is_primary' => false],
        ]);

        // -------------------------------------------------------------
        // 2. USUÁRIO PLENO
        // -------------------------------------------------------------
        $this->command->info('Criando usuário Pleno...');
        $plenoUser = User::updateOrCreate(
            ['email' => 'pleno@devfolio.com'],
            ['password' => Hash::make('password'), 'email_verified_at' => now()]
        );

        $plenoProfile = Profile::updateOrCreate(
            ['user_id' => $plenoUser->id],
            [
                'username' => 'pleno',
                'name' => 'Pedro Pleno Dev',
                'avatar_url' => 'https://api.dicebear.com/7.x/adventurer/svg?seed=pedro',
                'bio' => 'Desenvolvedor Full Stack Pleno. Trabalho diariamente com Laravel, React e PostgreSQL construindo aplicações SaaS estáveis.',
                'role' => 'Full Stack Developer',
                'location' => 'Belo Horizonte, Brasil',
                'github_url' => 'https://github.com/pleno-pedro',
                'theme_name' => 'modern',
                'is_active' => true,
            ]
        );

        // Experiência Atual (Plena)
        $plenoExp1 = Experience::create([
            'profile_id' => $plenoProfile->id,
            'company' => 'Empresa Crescimento',
            'role' => 'Full Stack Developer Pleno',
            'description' => 'Desenvolvimento de features ponta a ponta em SaaS financeiro usando Laravel com SPA em React.',
            'start_date' => now()->subYears(2)->toDateString(),
            'is_current' => true,
        ]);
        $syncService->syncExperience($plenoExp1, [
            ['id' => $laravel->id, 'usage_depth' => 'primary', 'is_primary' => true],
            ['id' => $react->id, 'usage_depth' => 'primary', 'is_primary' => true],
            ['id' => $postgresql->id, 'usage_depth' => 'used', 'is_primary' => false],
        ]);

        // Experiência Passada (Júnior)
        $plenoExp2 = Experience::create([
            'profile_id' => $plenoProfile->id,
            'company' => 'Agência Digital local',
            'role' => 'Junior Web Developer',
            'description' => 'Manutenção de CMSs, portais governamentais e criação de APIs REST simples em PHP puro.',
            'start_date' => now()->subYears(3)->subMonths(6)->toDateString(),
            'end_date' => now()->subYears(2)->toDateString(),
            'is_current' => false,
        ]);
        $syncService->syncExperience($plenoExp2, [
            ['id' => $php->id, 'usage_depth' => 'primary', 'is_primary' => true],
            ['id' => $javascript->id, 'usage_depth' => 'used', 'is_primary' => false],
        ]);

        // Projeto
        $plenoProj = Project::create([
            'profile_id' => $plenoProfile->id,
            'title' => 'SaaS Task Management Platform',
            'description' => 'Uma plataforma para acompanhamento de sprints e squads de desenvolvimento de produtos digitais.',
            'is_featured' => true,
            'order_weight' => 1,
        ]);
        $syncService->syncProject($plenoProj, [
            ['id' => $laravel->id, 'usage_depth' => 'primary', 'is_primary' => true],
            ['id' => $react->id, 'usage_depth' => 'used', 'is_primary' => false],
        ]);

        // -------------------------------------------------------------
        // 3. USUÁRIO SÊNIOR / TECH LEAD
        // -------------------------------------------------------------
        $this->command->info('Criando usuário Sênior...');
        $seniorUser = User::updateOrCreate(
            ['email' => 'senior@devfolio.com'],
            ['password' => Hash::make('password'), 'email_verified_at' => now()]
        );

        $seniorProfile = Profile::updateOrCreate(
            ['user_id' => $seniorUser->id],
            [
                'username' => 'senior',
                'name' => 'Sandra Sênior Dev & Tech Lead',
                'avatar_url' => 'https://api.dicebear.com/7.x/adventurer/svg?seed=sandra',
                'bio' => 'Tech Lead e Engenheira de Software Principal. Especialista na criação de arquiteturas escaláveis com Laravel, TypeScript, Docker e Kubernetes.',
                'role' => 'Tech Lead & Software Architect',
                'location' => 'Curitiba, Brasil',
                'github_url' => 'https://github.com/senior-sandra',
                'theme_name' => 'modern',
                'is_active' => true,
            ]
        );

        // Experiência Atual (Tech Lead)
        $seniorExp1 = Experience::create([
            'profile_id' => $seniorProfile->id,
            'company' => 'Big Tech Corporation',
            'role' => 'Tech Lead & Architect',
            'description' => 'Arquitetura e infraestrutura de APIs para processamento em larga escala. Liderança técnica de 8 desenvolvedores.',
            'start_date' => now()->subYears(3)->toDateString(),
            'is_current' => true,
        ]);
        $syncService->syncExperience($seniorExp1, [
            ['id' => $laravel->id, 'usage_depth' => 'expert', 'is_primary' => true],
            ['id' => $docker->id, 'usage_depth' => 'expert', 'is_primary' => true],
            ['id' => $typescript->id, 'usage_depth' => 'expert', 'is_primary' => false],
        ]);

        // Experiência Passada (Senior Full Stack)
        $seniorExp2 = Experience::create([
            'profile_id' => $seniorProfile->id,
            'company' => 'Fast Growth Startup',
            'role' => 'Senior Full Stack Developer',
            'description' => 'Criação da arquitetura frontend baseada em Next.js e design systems reutilizáveis.',
            'start_date' => now()->subYears(6)->toDateString(),
            'end_date' => now()->subYears(3)->toDateString(),
            'is_current' => false,
        ]);
        $syncService->syncExperience($seniorExp2, [
            ['id' => $typescript->id, 'usage_depth' => 'expert', 'is_primary' => true],
            ['id' => $react->id, 'usage_depth' => 'expert', 'is_primary' => true],
        ]);

        // Projeto 1
        $seniorProj1 = Project::create([
            'profile_id' => $seniorProfile->id,
            'title' => 'High-throughput Notification Service',
            'description' => 'Microsserviço responsável pelo disparo de push notifications e e-mails com capacidade de 50.000 requisições por segundo.',
            'is_featured' => true,
            'order_weight' => 1,
        ]);
        $syncService->syncProject($seniorProj1, [
            ['id' => $docker->id, 'usage_depth' => 'expert', 'is_primary' => true],
            ['id' => $postgresql->id, 'usage_depth' => 'expert', 'is_primary' => true],
        ]);

        // Projeto 2
        $seniorProj2 = Project::create([
            'profile_id' => $seniorProfile->id,
            'title' => 'Laravel Advanced Caching Package',
            'description' => 'Biblioteca open source em PHP para implementar estratégias complexas de cache tag e lock atômico distribuído.',
            'is_featured' => false,
            'order_weight' => 2,
        ]);
        $syncService->syncProject($seniorProj2, [
            ['id' => $laravel->id, 'usage_depth' => 'expert', 'is_primary' => true],
            ['id' => $php->id, 'usage_depth' => 'expert', 'is_primary' => true],
        ]);


        // -------------------------------------------------------------
        // 4. USUÁRIO LENDÁRIO / POLIGLOTA (POPULA OS 10 DOMÍNIOS COMPLETOS)
        // -------------------------------------------------------------
        $this->command->info('Criando usuário Lendário (Completo nos 10 domínios)...');
        $legendUser = User::updateOrCreate(
            ['email' => 'legend@devfolio.com'],
            ['password' => Hash::make('password'), 'email_verified_at' => now()]
        );

        $legendProfile = Profile::updateOrCreate(
            ['user_id' => $legendUser->id],
            [
                'username' => 'legend',
                'name' => 'Leandro Legend Dev',
                'avatar_url' => 'https://api.dicebear.com/7.x/adventurer/svg?seed=leandro',
                'bio' => 'Engenheiro de Software Lendário e Poliglota. Especialista multidisciplinar cobrindo todos os eixos: sistemas de alta escala, IA, Web3, Embarcados, DevOps, Mobile, QA e Segurança.',
                'role' => 'Principal Polyglot Architect',
                'location' => 'Florianópolis, Brasil',
                'github_url' => 'https://github.com/legend-leandro',
                'theme_name' => 'modern',
                'is_active' => true,
            ]
        );

        // Experiência 1 (Backend, DevOps-Cloud, Database)
        $legendExp1 = Experience::create([
            'profile_id' => $legendProfile->id,
            'company' => 'Global Tech Giant',
            'role' => 'Principal Systems Architect',
            'description' => 'Arquitetura e design de infraestrutura e serviços core. Orquestração com Kubernetes e gerenciamento de bancos de dados relacionais gigantes.',
            'start_date' => now()->subYears(4)->toDateString(),
            'is_current' => true,
        ]);
        $syncService->syncExperience($legendExp1, [
            ['id' => $laravel->id, 'usage_depth' => 'expert', 'is_primary' => true],
            ['id' => $kubernetes->id, 'usage_depth' => 'expert', 'is_primary' => true],
            ['id' => $postgresql->id, 'usage_depth' => 'expert', 'is_primary' => false],
        ]);

        // Experiência 2 (Systems & Embedded, Mobile)
        $legendExp2 = Experience::create([
            'profile_id' => $legendProfile->id,
            'company' => 'IoT & Devices Inc',
            'role' => 'Embedded Systems Lead',
            'description' => 'Desenvolvimento de firmware robusto e drivers de baixo nível em Rust/C. Aplicativos mobile embarcados em Flutter.',
            'start_date' => now()->subYears(8)->toDateString(),
            'end_date' => now()->subYears(4)->toDateString(),
            'is_current' => false,
        ]);
        $syncService->syncExperience($legendExp2, [
            ['id' => $cLang->id, 'usage_depth' => 'expert', 'is_primary' => true],
            ['id' => $rust->id, 'usage_depth' => 'expert', 'is_primary' => true],
            ['id' => $flutter->id, 'usage_depth' => 'primary', 'is_primary' => false],
        ]);

        // Experiência 3 (Segurança / AppSec) - Completa o domínio de Security
        $legendExp3 = Experience::create([
            'profile_id' => $legendProfile->id,
            'company' => 'Cyber Defense LLC',
            'role' => 'Security Architect & Consultant',
            'description' => 'Auditorias de segurança de código e implementação de infraestruturas de proteção de segredos com HashiCorp Vault e SonarQube.',
            'start_date' => now()->subYears(5)->toDateString(),
            'end_date' => now()->subYears(3)->toDateString(),
            'is_current' => false,
        ]);
        $syncService->syncExperience($legendExp3, [
            ['id' => $hashicorpVault->id, 'usage_depth' => 'expert', 'is_primary' => true],
            ['id' => $sonarQube->id, 'usage_depth' => 'expert', 'is_primary' => true],
            ['id' => $kaliLinux->id, 'usage_depth' => 'primary', 'is_primary' => false],
        ]);

        // Projeto 1 (AI-ML)
        $legendProj1 = Project::create([
            'profile_id' => $legendProfile->id,
            'title' => 'AI Automated Agent Stock Predictor',
            'description' => 'Agente inteligente para predição de mercado utilizando PyTorch e processando dados históricos em tempo real.',
            'is_featured' => true,
            'order_weight' => 1,
        ]);
        $syncService->syncProject($legendProj1, [
            ['id' => $python->id, 'usage_depth' => 'expert', 'is_primary' => true],
            ['id' => $tensorflow->id, 'usage_depth' => 'expert', 'is_primary' => true],
            ['id' => $pytorch->id, 'usage_depth' => 'used', 'is_primary' => false],
        ]);

        // Projeto 2 (Web3 & Blockchain, Frontend)
        $legendProj2 = Project::create([
            'profile_id' => $legendProfile->id,
            'title' => 'Multi-chain DAO dApp UI',
            'description' => 'Protocolo DeFi yielding completo com smart contracts em Solidity e dApp integrado com React/TypeScript.',
            'is_featured' => true,
            'order_weight' => 2,
        ]);
        $syncService->syncProject($legendProj2, [
            ['id' => $solidity->id, 'usage_depth' => 'expert', 'is_primary' => true],
            ['id' => $react->id, 'usage_depth' => 'primary', 'is_primary' => true],
            ['id' => $typescript->id, 'usage_depth' => 'primary', 'is_primary' => false],
        ]);

        // Projeto 3 (QA & Testing)
        $legendProj3 = Project::create([
            'profile_id' => $legendProfile->id,
            'title' => 'Continuous E2E Integration Testing Framework',
            'description' => 'Ferramenta corporativa para automação de testes de ponta a ponta e integração contínua (CI) usando Jest e Cypress.',
            'is_featured' => false,
            'order_weight' => 3,
        ]);
        $syncService->syncProject($legendProj3, [
            ['id' => $cypress->id, 'usage_depth' => 'expert', 'is_primary' => true],
            ['id' => $jest->id, 'usage_depth' => 'expert', 'is_primary' => true],
        ]);

        // Projeto 4 (Engenharia de Dados) - Completa o domínio de Data Engineering
        $legendProj4 = Project::create([
            'profile_id' => $legendProfile->id,
            'title' => 'Big Data Processing Pipeline',
            'description' => 'Pipeline de orquestração de processamento de Big Data em cluster Apache Spark e orquestrado por Apache Airflow.',
            'is_featured' => false,
            'order_weight' => 4,
        ]);
        $syncService->syncProject($legendProj4, [
            ['id' => $apacheSpark->id, 'usage_depth' => 'expert', 'is_primary' => true],
            ['id' => $apacheAirflow->id, 'usage_depth' => 'expert', 'is_primary' => true],
            ['id' => $snowflake->id, 'usage_depth' => 'primary', 'is_primary' => false],
        ]);

        // -------------------------------------------------------------
        // 5. CRIAÇÃO DE USUÁRIOS ESPECIALISTAS (1 PARA CADA DOMÍNIO)
        // -------------------------------------------------------------
        $this->command->info('Configurando dados para os usuários especialistas...');
        
        $specialists = [
            [
                'email' => 'backend@devfolio.com',
                'username' => 'backend_spec',
                'name' => 'Bianca Backend',
                'bio' => 'Especialista em Backend. Foco em arquiteturas de microsserviços de alta performance e bancos de dados relacionais.',
                'role' => 'Senior Backend Engineer',
                'avatar' => 'https://api.dicebear.com/7.x/adventurer/svg?seed=bianca',
                'type' => 'experience',
                'detail_data' => [
                    'company_name' => 'Backend Solutions Corp',
                    'role_title' => 'Senior Backend Developer',
                ],
                'techs' => [
                    ['tech' => $laravel, 'depth' => 'expert', 'primary' => true],
                    ['tech' => $php, 'depth' => 'expert', 'primary' => true],
                    ['tech' => $postgresql, 'depth' => 'expert', 'primary' => false],
                ]
            ],
            [
                'email' => 'frontend@devfolio.com',
                'username' => 'frontend_spec',
                'name' => 'Fabio Frontend',
                'bio' => 'Especialista em Frontend. Foco em UX/UI responsivas, design systems e otimização de Core Web Vitals.',
                'role' => 'Senior Frontend Engineer',
                'avatar' => 'https://api.dicebear.com/7.x/adventurer/svg?seed=fabio',
                'type' => 'project',
                'detail_data' => [
                    'title' => 'Design System Core UI',
                    'is_production' => true,
                ],
                'techs' => [
                    ['tech' => $react, 'depth' => 'expert', 'primary' => true],
                    ['tech' => $typescript, 'depth' => 'expert', 'primary' => true],
                    ['tech' => $html, 'depth' => 'primary', 'primary' => false],
                    ['tech' => $css, 'depth' => 'primary', 'primary' => false],
                    ['tech' => $javascript, 'depth' => 'primary', 'primary' => false],
                ]
            ],
            [
                'email' => 'mobile@devfolio.com',
                'username' => 'mobile_spec',
                'name' => 'Murilo Mobile',
                'bio' => 'Especialista em Mobile. Foco no desenvolvimento cross-platform com Flutter e animações fluidas.',
                'role' => 'Senior Mobile Developer',
                'avatar' => 'https://api.dicebear.com/7.x/adventurer/svg?seed=murilo',
                'type' => 'experience',
                'detail_data' => [
                    'company_name' => 'Mobile First Inc',
                    'role_title' => 'Senior Mobile Engineer',
                ],
                'techs' => [
                    ['tech' => $flutter, 'depth' => 'expert', 'primary' => true],
                ]
            ],
            [
                'email' => 'devops@devfolio.com',
                'username' => 'devops_spec',
                'name' => 'Daniel DevOps',
                'bio' => 'Especialista em DevOps & Cloud. Foco em infraestrutura como código (IaC), orquestração de containers e pipelines CI/CD.',
                'role' => 'Cloud & DevOps Architect',
                'avatar' => 'https://api.dicebear.com/7.x/adventurer/svg?seed=daniel',
                'type' => 'experience',
                'detail_data' => [
                    'company_name' => 'CloudOps Global',
                    'role_title' => 'DevOps Architect',
                ],
                'techs' => [
                    ['tech' => $kubernetes, 'depth' => 'expert', 'primary' => true],
                    ['tech' => $docker, 'depth' => 'expert', 'primary' => true],
                    ['tech' => $ansible, 'depth' => 'primary', 'primary' => false],
                    ['tech' => $nginx, 'depth' => 'primary', 'primary' => false],
                ]
            ],
            [
                'email' => 'data@devfolio.com',
                'username' => 'data_spec',
                'name' => 'Darlan Data',
                'bio' => 'Especialista em Engenharia de Dados. Foco em data lakes, ETL pipelines robustos e processamento distribuído.',
                'role' => 'Senior Data Engineer',
                'avatar' => 'https://api.dicebear.com/7.x/adventurer/svg?seed=darlan',
                'type' => 'project',
                'detail_data' => [
                    'title' => 'Distributed Data Lake Pipeline',
                    'is_production' => true,
                ],
                'techs' => [
                    ['tech' => $apacheSpark, 'depth' => 'expert', 'primary' => true],
                    ['tech' => $apacheAirflow, 'depth' => 'expert', 'primary' => true],
                    ['tech' => $snowflake, 'depth' => 'primary', 'primary' => false],
                ]
            ],
            [
                'email' => 'ai@devfolio.com',
                'username' => 'ai_spec',
                'name' => 'Aline AI',
                'bio' => 'Especialista em Inteligência Artificial e Machine Learning. Foco em Deep Learning, Visão Computacional e Large Language Models.',
                'role' => 'AI Research Scientist',
                'avatar' => 'https://api.dicebear.com/7.x/adventurer/svg?seed=aline',
                'type' => 'project',
                'detail_data' => [
                    'title' => 'Visual QA LLM Agent',
                    'is_production' => true,
                ],
                'techs' => [
                    ['tech' => $python, 'depth' => 'expert', 'primary' => true],
                    ['tech' => $pytorch, 'depth' => 'expert', 'primary' => true],
                    ['tech' => $tensorflow, 'depth' => 'primary', 'primary' => false],
                ]
            ],
            [
                'email' => 'security@devfolio.com',
                'username' => 'security_spec',
                'name' => 'Samuel Security',
                'bio' => 'Especialista em Segurança & DevSecOps. Foco em OWASP Top 10, testes de penetração e infraestruturas seguras.',
                'role' => 'DevSecOps & Security Engineer',
                'avatar' => 'https://api.dicebear.com/7.x/adventurer/svg?seed=samuel',
                'type' => 'experience',
                'detail_data' => [
                    'company_name' => 'SecureNet Defense',
                    'role_title' => 'Senior AppSec Engineer',
                ],
                'techs' => [
                    ['tech' => $hashicorpVault, 'depth' => 'expert', 'primary' => true],
                    ['tech' => $sonarQube, 'depth' => 'expert', 'primary' => true],
                    ['tech' => $kaliLinux, 'depth' => 'primary', 'primary' => false],
                ]
            ],
            [
                'email' => 'qa@devfolio.com',
                'username' => 'qa_spec',
                'name' => 'Quiteria QA',
                'bio' => 'Especialista em QA & Testes. Foco em pirâmide de testes, automação de ponta-a-ponta e testes de carga.',
                'role' => 'QA & Test Automation Lead',
                'avatar' => 'https://api.dicebear.com/7.x/adventurer/svg?seed=quiteria',
                'type' => 'project',
                'detail_data' => [
                    'title' => 'Global End-to-End Test Suite',
                    'is_production' => true,
                ],
                'techs' => [
                    ['tech' => $cypress, 'depth' => 'expert', 'primary' => true],
                    ['tech' => $jest, 'depth' => 'expert', 'primary' => true],
                    ['tech' => $phpUnit, 'depth' => 'primary', 'primary' => false],
                ]
            ],
            [
                'email' => 'embedded@devfolio.com',
                'username' => 'embedded_spec',
                'name' => 'Enzo Embedded',
                'bio' => 'Especialista em Sistemas Embarcados & IoT. Programação de baixo nível em firmware e design de hardware embarcado.',
                'role' => 'Embedded Systems Engineer',
                'avatar' => 'https://api.dicebear.com/7.x/adventurer/svg?seed=enzo',
                'type' => 'experience',
                'detail_data' => [
                    'company_name' => 'IoT Devices Corp',
                    'role_title' => 'Hardware & Firmware Developer',
                ],
                'techs' => [
                    ['tech' => $cLang, 'depth' => 'expert', 'primary' => true],
                    ['tech' => $rust, 'depth' => 'expert', 'primary' => true],
                    ['tech' => $esp32, 'depth' => 'primary', 'primary' => false],
                ]
            ],
            [
                'email' => 'web3@devfolio.com',
                'username' => 'web3_spec',
                'name' => 'Walter Web3',
                'bio' => 'Especialista em Web3 & Blockchain. Criação de Smart Contracts auditados e interfaces descentralizadas (dApps).',
                'role' => 'Blockchain Developer',
                'avatar' => 'https://api.dicebear.com/7.x/adventurer/svg?seed=walter',
                'type' => 'project',
                'detail_data' => [
                    'title' => 'DeFi Yield Aggregator Protocol',
                    'is_production' => true,
                ],
                'techs' => [
                    ['tech' => $solidity, 'depth' => 'expert', 'primary' => true],
                    ['tech' => $hardhat, 'depth' => 'expert', 'primary' => true],
                    ['tech' => $ethersJs, 'depth' => 'primary', 'primary' => false],
                ]
            ],
        ];

        $this->command->info('Criando os usuários especialistas no banco...');
        foreach ($specialists as $specData) {
            $user = User::updateOrCreate(
                ['email' => $specData['email']],
                ['password' => Hash::make('password'), 'email_verified_at' => now()]
            );

            $profile = Profile::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'username' => $specData['username'],
                    'name' => $specData['name'],
                    'avatar_url' => $specData['avatar'],
                    'bio' => $specData['bio'],
                    'role' => $specData['role'],
                    'location' => 'São Paulo, Brasil',
                    'theme_name' => 'modern',
                    'is_active' => true,
                ]
            );

            // Preparar a lista de tecnologias para a sincronização
            $techsInput = [];
            foreach ($specData['techs'] as $tInfo) {
                if ($tInfo['tech']) {
                    $techsInput[] = [
                        'id' => $tInfo['tech']->id,
                        'usage_depth' => $tInfo['depth'],
                        'is_primary' => $tInfo['primary']
                    ];
                }
            }

            if ($specData['type'] === 'experience') {
                $experience = Experience::create([
                    'profile_id' => $profile->id,
                    'company' => $specData['detail_data']['company_name'],
                    'role' => $specData['detail_data']['role_title'],
                    'description' => "Trabalho como especialista de " . $specData['role'] . " utilizando tecnologias modernas.",
                    'start_date' => now()->subYears(2)->toDateString(),
                    'is_current' => true,
                ]);

                // Sincroniza a evidência automaticamente
                $syncService->syncExperience($experience, $techsInput);
            } else {
                $project = Project::create([
                    'profile_id' => $profile->id,
                    'title' => $specData['detail_data']['title'],
                    'description' => "Projeto voltado para " . $specData['role'] . " utilizando boas práticas e padrões da indústria.",
                    'is_featured' => $specData['detail_data']['is_production'],
                    'order_weight' => 1,
                ]);

                $syncService->syncProject($project, $techsInput);
            }

            // Executar pipeline de recalculo de score para o especialista
            $pipeline->execute($user->id);
        }

        // -------------------------------------------------------------
        // Executar o ScorePipeline para os usuários principais
        // -------------------------------------------------------------
        $this->command->info('Calculando scores iniciais no ScorePipeline para os usuários base...');
        $pipeline->execute($juniorUser->id);
        $pipeline->execute($plenoUser->id);
        $pipeline->execute($seniorUser->id);
        $pipeline->execute($legendUser->id);

        $this->command->info('Usuários testes e especialistas criados com sucesso!');
        $this->command->info('Emails de acesso (senha: password):');
        $this->command->info(' - junior@devfolio.com (Júnior)');
        $this->command->info(' - pleno@devfolio.com (Pleno)');
        $this->command->info(' - senior@devfolio.com (Sênior/Tech Lead)');
        $this->command->info(' - legend@devfolio.com (Lendário/Poliglota - 10 Domínios)');
        foreach ($specialists as $specData) {
            $this->command->info(" - {$specData['email']} ({$specData['name']} - Especialista)");
        }
    }
}
