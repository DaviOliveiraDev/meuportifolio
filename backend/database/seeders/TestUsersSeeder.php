<?php

namespace Database\Seeders;

use App\Infrastructure\Models\User;
use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\Evidence;
use App\Infrastructure\Models\EvidenceProject;
use App\Infrastructure\Models\EvidenceExperience;
use App\Infrastructure\Models\EvidenceTechnology;
use App\Infrastructure\Models\Technology;
use App\Domain\Gamification\Services\Reputation\ScorePipeline;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TestUsersSeeder extends Seeder
{
    public function run(): void
    {
        $pipeline = app(ScorePipeline::class);

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

        // Evidência de Experiência
        $juniorExpEv = Evidence::create([
            'user_id' => $juniorUser->id,
            'evidence_type' => 'experience',
            'verification_level' => 'self_declared',
            'verification_source' => 'self',
            'start_date' => now()->subMonths(6),
            'is_current' => true,
            'is_active' => true,
        ]);

        EvidenceExperience::create([
            'evidence_id' => $juniorExpEv->id,
            'company_name' => 'Startup Começo',
            'role_title' => 'Junior Frontend Developer',
            'employment_type' => 'full_time',
            'company_tier' => 'company',
        ]);

        if ($html) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $juniorExpEv->id, 'technology_id' => $html->id, 'usage_depth' => 'primary', 'is_primary' => true]);
        }
        if ($css) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $juniorExpEv->id, 'technology_id' => $css->id, 'usage_depth' => 'primary', 'is_primary' => true]);
        }
        if ($javascript) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $juniorExpEv->id, 'technology_id' => $javascript->id, 'usage_depth' => 'used', 'is_primary' => false]);
        }

        // Evidência de Projeto
        $juniorProjEv = Evidence::create([
            'user_id' => $juniorUser->id,
            'evidence_type' => 'project',
            'verification_level' => 'self_declared',
            'verification_source' => 'self',
            'start_date' => now()->subMonths(3),
            'is_current' => false,
            'is_active' => true,
        ]);

        EvidenceProject::create([
            'evidence_id' => $juniorProjEv->id,
            'title' => 'Personal Portfolio Webpage',
            'is_production' => false,
            'user_scale' => 'personal',
        ]);

        if ($html) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $juniorProjEv->id, 'technology_id' => $html->id, 'usage_depth' => 'primary', 'is_primary' => true]);
        }
        if ($css) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $juniorProjEv->id, 'technology_id' => $css->id, 'usage_depth' => 'used', 'is_primary' => false]);
        }

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

        // Evidência de Experiência Atual (Plena)
        $plenoExpEv1 = Evidence::create([
            'user_id' => $plenoUser->id,
            'evidence_type' => 'experience',
            'verification_level' => 'auto_verified',
            'verification_source' => 'linkedin_oauth',
            'start_date' => now()->subYears(2),
            'is_current' => true,
            'is_active' => true,
        ]);

        EvidenceExperience::create([
            'evidence_id' => $plenoExpEv1->id,
            'company_name' => 'Empresa Crescimento',
            'role_title' => 'Full Stack Developer Pleno',
            'employment_type' => 'full_time',
            'company_tier' => 'startup_funded',
        ]);

        if ($laravel) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $plenoExpEv1->id, 'technology_id' => $laravel->id, 'usage_depth' => 'primary', 'is_primary' => true]);
        }
        if ($react) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $plenoExpEv1->id, 'technology_id' => $react->id, 'usage_depth' => 'primary', 'is_primary' => true]);
        }
        if ($postgresql) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $plenoExpEv1->id, 'technology_id' => $postgresql->id, 'usage_depth' => 'used', 'is_primary' => false]);
        }

        // Evidência de Experiência Passada (Júnior)
        $plenoExpEv2 = Evidence::create([
            'user_id' => $plenoUser->id,
            'evidence_type' => 'experience',
            'verification_level' => 'self_declared',
            'verification_source' => 'self',
            'start_date' => now()->subYears(3)->subMonths(6),
            'end_date' => now()->subYears(2),
            'is_current' => false,
            'is_active' => true,
        ]);

        EvidenceExperience::create([
            'evidence_id' => $plenoExpEv2->id,
            'company_name' => 'Agência Digital local',
            'role_title' => 'Junior Web Developer',
            'employment_type' => 'full_time',
            'company_tier' => 'company',
        ]);

        if ($php) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $plenoExpEv2->id, 'technology_id' => $php->id, 'usage_depth' => 'primary', 'is_primary' => true]);
        }
        if ($javascript) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $plenoExpEv2->id, 'technology_id' => $javascript->id, 'usage_depth' => 'used', 'is_primary' => false]);
        }

        // Evidência de Projeto
        $plenoProjEv = Evidence::create([
            'user_id' => $plenoUser->id,
            'evidence_type' => 'project',
            'verification_level' => 'auto_verified',
            'verification_source' => 'github_oauth',
            'start_date' => now()->subYear(),
            'is_current' => false,
            'is_active' => true,
        ]);

        EvidenceProject::create([
            'evidence_id' => $plenoProjEv->id,
            'title' => 'SaaS Task Management Platform',
            'is_production' => true,
            'user_scale' => 'medium',
        ]);

        if ($laravel) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $plenoProjEv->id, 'technology_id' => $laravel->id, 'usage_depth' => 'primary', 'is_primary' => true]);
        }
        if ($react) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $plenoProjEv->id, 'technology_id' => $react->id, 'usage_depth' => 'used', 'is_primary' => false]);
        }

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

        // Evidência de Experiência Atual (Tech Lead - Tier 1 Global)
        $seniorExpEv1 = Evidence::create([
            'user_id' => $seniorUser->id,
            'evidence_type' => 'experience',
            'verification_level' => 'auto_verified',
            'verification_source' => 'linkedin_oauth',
            'start_date' => now()->subYears(3),
            'is_current' => true,
            'is_active' => true,
        ]);

        EvidenceExperience::create([
            'evidence_id' => $seniorExpEv1->id,
            'company_name' => 'Big Tech Corporation',
            'role_title' => 'Tech Lead & Architect',
            'employment_type' => 'full_time',
            'company_tier' => 'tier1_global',
        ]);

        if ($laravel) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $seniorExpEv1->id, 'technology_id' => $laravel->id, 'usage_depth' => 'expert', 'is_primary' => true]);
        }
        if ($docker) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $seniorExpEv1->id, 'technology_id' => $docker->id, 'usage_depth' => 'expert', 'is_primary' => true]);
        }
        if ($typescript) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $seniorExpEv1->id, 'technology_id' => $typescript->id, 'usage_depth' => 'expert', 'is_primary' => false]);
        }

        // Evidência de Experiência Passada (Senior Full Stack)
        $seniorExpEv2 = Evidence::create([
            'user_id' => $seniorUser->id,
            'evidence_type' => 'experience',
            'verification_level' => 'auto_verified',
            'verification_source' => 'linkedin_oauth',
            'start_date' => now()->subYears(6),
            'end_date' => now()->subYears(3),
            'is_current' => false,
            'is_active' => true,
        ]);

        EvidenceExperience::create([
            'evidence_id' => $seniorExpEv2->id,
            'company_name' => 'Fast Growth Startup',
            'role_title' => 'Senior Full Stack Developer',
            'employment_type' => 'full_time',
            'company_tier' => 'startup_funded',
        ]);

        if ($typescript) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $seniorExpEv2->id, 'technology_id' => $typescript->id, 'usage_depth' => 'expert', 'is_primary' => true]);
        }
        if ($react) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $seniorExpEv2->id, 'technology_id' => $react->id, 'usage_depth' => 'expert', 'is_primary' => true]);
        }

        // Evidência de Projeto 1 (Escala Massiva)
        $seniorProjEv1 = Evidence::create([
            'user_id' => $seniorUser->id,
            'evidence_type' => 'project',
            'verification_level' => 'auto_verified',
            'verification_source' => 'github_oauth',
            'start_date' => now()->subYears(2),
            'is_current' => false,
            'is_active' => true,
        ]);

        EvidenceProject::create([
            'evidence_id' => $seniorProjEv1->id,
            'title' => 'High-throughput Notification Service',
            'is_production' => true,
            'user_scale' => 'massive',
        ]);

        if ($docker) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $seniorProjEv1->id, 'technology_id' => $docker->id, 'usage_depth' => 'expert', 'is_primary' => true]);
        }
        if ($postgresql) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $seniorProjEv1->id, 'technology_id' => $postgresql->id, 'usage_depth' => 'expert', 'is_primary' => true]);
        }

        // Evidência de Projeto 2 (Código Aberto)
        $seniorProjEv2 = Evidence::create([
            'user_id' => $seniorUser->id,
            'evidence_type' => 'project',
            'verification_level' => 'auto_verified',
            'verification_source' => 'github_oauth',
            'start_date' => now()->subYear(),
            'is_current' => false,
            'is_active' => true,
        ]);

        EvidenceProject::create([
            'evidence_id' => $seniorProjEv2->id,
            'title' => 'Laravel Advanced Caching Package',
            'is_production' => false,
            'user_scale' => 'large',
        ]);

        if ($laravel) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $seniorProjEv2->id, 'technology_id' => $laravel->id, 'usage_depth' => 'expert', 'is_primary' => true]);
        }
        if ($php) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $seniorProjEv2->id, 'technology_id' => $php->id, 'usage_depth' => 'expert', 'is_primary' => true]);
        }


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

        // Evidência de Experiência 1 (Backend, DevOps-Cloud, Database)
        $legendExp1 = Evidence::create([
            'user_id' => $legendUser->id,
            'evidence_type' => 'experience',
            'verification_level' => 'auto_verified',
            'verification_source' => 'linkedin_oauth',
            'start_date' => now()->subYears(4),
            'is_current' => true,
            'is_active' => true,
        ]);

        EvidenceExperience::create([
            'evidence_id' => $legendExp1->id,
            'company_name' => 'Global Tech Giant',
            'role_title' => 'Principal Systems Architect',
            'employment_type' => 'full_time',
            'company_tier' => 'tier1_global',
        ]);

        if ($laravel) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $legendExp1->id, 'technology_id' => $laravel->id, 'usage_depth' => 'expert', 'is_primary' => true]);
        }
        if ($kubernetes) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $legendExp1->id, 'technology_id' => $kubernetes->id, 'usage_depth' => 'expert', 'is_primary' => true]);
        }
        if ($postgresql) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $legendExp1->id, 'technology_id' => $postgresql->id, 'usage_depth' => 'expert', 'is_primary' => false]);
        }

        // Evidência de Experiência 2 (Systems & Embedded, Mobile)
        $legendExp2 = Evidence::create([
            'user_id' => $legendUser->id,
            'evidence_type' => 'experience',
            'verification_level' => 'auto_verified',
            'verification_source' => 'linkedin_oauth',
            'start_date' => now()->subYears(8),
            'end_date' => now()->subYears(4),
            'is_current' => false,
            'is_active' => true,
        ]);

        EvidenceExperience::create([
            'evidence_id' => $legendExp2->id,
            'company_name' => 'IoT & Devices Inc',
            'role_title' => 'Embedded Systems Lead',
            'employment_type' => 'full_time',
            'company_tier' => 'startup_funded',
        ]);

        if ($cLang) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $legendExp2->id, 'technology_id' => $cLang->id, 'usage_depth' => 'expert', 'is_primary' => true]);
        }
        if ($rust) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $legendExp2->id, 'technology_id' => $rust->id, 'usage_depth' => 'expert', 'is_primary' => true]);
        }
        if ($flutter) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $legendExp2->id, 'technology_id' => $flutter->id, 'usage_depth' => 'primary', 'is_primary' => false]);
        }

        // Evidência de Experiência 3 (Segurança / AppSec) - Completa o domínio de Security
        $legendExp3 = Evidence::create([
            'user_id' => $legendUser->id,
            'evidence_type' => 'experience',
            'verification_level' => 'auto_verified',
            'verification_source' => 'linkedin_oauth',
            'start_date' => now()->subYears(5),
            'end_date' => now()->subYears(3),
            'is_current' => false,
            'is_active' => true,
        ]);

        EvidenceExperience::create([
            'evidence_id' => $legendExp3->id,
            'company_name' => 'Cyber Defense LLC',
            'role_title' => 'Security Architect & Consultant',
            'employment_type' => 'contract',
            'company_tier' => 'startup_funded',
        ]);

        if ($hashicorpVault) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $legendExp3->id, 'technology_id' => $hashicorpVault->id, 'usage_depth' => 'expert', 'is_primary' => true]);
        }
        if ($sonarQube) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $legendExp3->id, 'technology_id' => $sonarQube->id, 'usage_depth' => 'expert', 'is_primary' => true]);
        }
        if ($kaliLinux) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $legendExp3->id, 'technology_id' => $kaliLinux->id, 'usage_depth' => 'primary', 'is_primary' => false]);
        }

        // Evidência de Projeto 1 (AI-ML)
        $legendProj1 = Evidence::create([
            'user_id' => $legendUser->id,
            'evidence_type' => 'project',
            'verification_level' => 'auto_verified',
            'verification_source' => 'github_oauth',
            'start_date' => now()->subYears(2),
            'is_current' => false,
            'is_active' => true,
        ]);

        EvidenceProject::create([
            'evidence_id' => $legendProj1->id,
            'title' => 'AI Automated Agent Stock Predictor',
            'is_production' => true,
            'user_scale' => 'large',
        ]);

        if ($python) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $legendProj1->id, 'technology_id' => $python->id, 'usage_depth' => 'expert', 'is_primary' => true]);
        }
        if ($tensorflow) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $legendProj1->id, 'technology_id' => $tensorflow->id, 'usage_depth' => 'expert', 'is_primary' => true]);
        }
        if ($pytorch) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $legendProj1->id, 'technology_id' => $pytorch->id, 'usage_depth' => 'used', 'is_primary' => false]);
        }

        // Evidência de Projeto 2 (Web3 & Blockchain, Frontend)
        $legendProj2 = Evidence::create([
            'user_id' => $legendUser->id,
            'evidence_type' => 'project',
            'verification_level' => 'auto_verified',
            'verification_source' => 'github_oauth',
            'start_date' => now()->subYear(),
            'is_current' => false,
            'is_active' => true,
        ]);

        EvidenceProject::create([
            'evidence_id' => $legendProj2->id,
            'title' => 'Multi-chain DAO dApp UI',
            'is_production' => true,
            'user_scale' => 'medium',
        ]);

        if ($solidity) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $legendProj2->id, 'technology_id' => $solidity->id, 'usage_depth' => 'expert', 'is_primary' => true]);
        }
        if ($react) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $legendProj2->id, 'technology_id' => $react->id, 'usage_depth' => 'primary', 'is_primary' => true]);
        }
        if ($typescript) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $legendProj2->id, 'technology_id' => $typescript->id, 'usage_depth' => 'primary', 'is_primary' => false]);
        }

        // Evidência de Projeto 3 (QA & Testing)
        $legendProj3 = Evidence::create([
            'user_id' => $legendUser->id,
            'evidence_type' => 'project',
            'verification_level' => 'auto_verified',
            'verification_source' => 'github_oauth',
            'start_date' => now()->subMonths(8),
            'is_current' => false,
            'is_active' => true,
        ]);

        EvidenceProject::create([
            'evidence_id' => $legendProj3->id,
            'title' => 'Continuous E2E Integration Testing Framework',
            'is_production' => false,
            'user_scale' => 'large',
        ]);

        if ($cypress) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $legendProj3->id, 'technology_id' => $cypress->id, 'usage_depth' => 'expert', 'is_primary' => true]);
        }
        if ($jest) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $legendProj3->id, 'technology_id' => $jest->id, 'usage_depth' => 'expert', 'is_primary' => true]);
        }

        // Evidência de Projeto 4 (Engenharia de Dados) - Completa o domínio de Data Engineering
        $legendProj4 = Evidence::create([
            'user_id' => $legendUser->id,
            'evidence_type' => 'project',
            'verification_level' => 'auto_verified',
            'verification_source' => 'github_oauth',
            'start_date' => now()->subYears(2),
            'is_current' => false,
            'is_active' => true,
        ]);

        EvidenceProject::create([
            'evidence_id' => $legendProj4->id,
            'title' => 'Big Data Processing Pipeline',
            'is_production' => true,
            'user_scale' => 'massive',
        ]);

        if ($apacheSpark) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $legendProj4->id, 'technology_id' => $apacheSpark->id, 'usage_depth' => 'expert', 'is_primary' => true]);
        }
        if ($apacheAirflow) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $legendProj4->id, 'technology_id' => $apacheAirflow->id, 'usage_depth' => 'expert', 'is_primary' => true]);
        }
        if ($snowflake) {
            EvidenceTechnology::create(['id' => (string) Str::uuid(), 'evidence_id' => $legendProj4->id, 'technology_id' => $snowflake->id, 'usage_depth' => 'primary', 'is_primary' => false]);
        }

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
                    'employment_type' => 'full_time',
                    'company_tier' => 'tier1_br',
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
                    'user_scale' => 'large',
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
                    'employment_type' => 'full_time',
                    'company_tier' => 'startup_funded',
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
                    'employment_type' => 'full_time',
                    'company_tier' => 'tier1_global',
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
                    'user_scale' => 'massive',
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
                    'user_scale' => 'medium',
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
                    'employment_type' => 'full_time',
                    'company_tier' => 'tier1_br',
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
                    'user_scale' => 'large',
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
                    'employment_type' => 'full_time',
                    'company_tier' => 'startup_funded',
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
                    'user_scale' => 'large',
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

            // Criar evidência correspondente
            $evidence = Evidence::create([
                'user_id' => $user->id,
                'evidence_type' => $specData['type'],
                'verification_level' => 'auto_verified',
                'verification_source' => 'linkedin_oauth',
                'start_date' => now()->subYears(2),
                'is_current' => $specData['type'] === 'experience',
                'is_active' => true,
            ]);

            if ($specData['type'] === 'experience') {
                EvidenceExperience::create(array_merge(
                    ['evidence_id' => $evidence->id],
                    $specData['detail_data']
                ));
            } else {
                EvidenceProject::create(array_merge(
                    ['evidence_id' => $evidence->id],
                    $specData['detail_data']
                ));
            }

            // Associar tecnologias com suas profundidades
            foreach ($specData['techs'] as $tInfo) {
                if ($tInfo['tech']) {
                    EvidenceTechnology::create([
                        'id' => (string) Str::uuid(),
                        'evidence_id' => $evidence->id,
                        'technology_id' => $tInfo['tech']->id,
                        'usage_depth' => $tInfo['depth'],
                        'is_primary' => $tInfo['primary']
                    ]);
                }
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
