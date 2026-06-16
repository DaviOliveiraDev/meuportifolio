<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TaxonomySeeder extends Seeder
{
    public function run(): void
    {
        // 1. Domínios (10)
        $domains = [
            [
                'name' => 'Backend Development',
                'slug' => 'backend',
                'icon' => 'server',
                'color' => '#3B82F6',
                'description' => 'Lógica de negócios no lado do servidor, APIs e serviços.',
                'order_index' => 1
            ],
            [
                'name' => 'Frontend Development',
                'slug' => 'frontend',
                'icon' => 'layout',
                'color' => '#10B981',
                'description' => 'Interfaces de usuário, responsividade e client-side scripting.',
                'order_index' => 2
            ],
            [
                'name' => 'Mobile Development',
                'slug' => 'mobile',
                'icon' => 'smartphone',
                'color' => '#F59E0B',
                'description' => 'Desenvolvimento de aplicativos para dispositivos móveis.',
                'order_index' => 3
            ],
            [
                'name' => 'DevOps & Cloud',
                'slug' => 'devops-cloud',
                'icon' => 'cloud',
                'color' => '#8B5CF6',
                'description' => 'Infraestrutura em nuvem, automação, CI/CD e monitoramento.',
                'order_index' => 4
            ],
            [
                'name' => 'Data Engineering',
                'slug' => 'data-engineering',
                'icon' => 'database',
                'color' => '#EC4899',
                'description' => 'Data pipelines, Big Data, BI e processamento distribuído.',
                'order_index' => 5
            ],
            [
                'name' => 'Artificial Intelligence & ML',
                'slug' => 'ai-ml',
                'icon' => 'brain',
                'color' => '#EF4444',
                'description' => 'Modelagem preditiva, Machine Learning, Deep Learning e LLMs.',
                'order_index' => 6
            ],
            [
                'name' => 'Security & DevSecOps',
                'slug' => 'security',
                'icon' => 'shield',
                'color' => '#6B7280',
                'description' => 'Segurança de aplicação, testes de invasão e gestão de identidade.',
                'order_index' => 7
            ],
            [
                'name' => 'Quality Assurance (QA) & Testing',
                'slug' => 'qa-testing',
                'icon' => 'check-circle',
                'color' => '#06B6D4',
                'description' => 'Testes de unidade, integração, ponta-a-ponta e automação de testes.',
                'order_index' => 8
            ],
            [
                'name' => 'Systems & Embedded',
                'slug' => 'systems-embedded',
                'icon' => 'cpu',
                'color' => '#14B8A6',
                'description' => 'Programação em baixo nível, sistemas embarcados, IoT e firmware.',
                'order_index' => 9
            ],
            [
                'name' => 'Web3 & Blockchain',
                'slug' => 'web3-blockchain',
                'icon' => 'link',
                'color' => '#A855F7',
                'description' => 'Smart contracts, dApps, criptografia e finanças descentralizadas.',
                'order_index' => 10
            ],
        ];

        $domainMap = [];
        foreach ($domains as $d) {
            $id = Str::uuid()->toString();
            DB::table('tech_domains')->updateOrInsert(
                ['slug' => $d['slug']],
                array_merge($d, ['id' => $id, 'created_at' => now(), 'updated_at' => now()])
            );
            $domainMap[$d['slug']] = DB::table('tech_domains')->where('slug', $d['slug'])->value('id');
        }

        // 2. Competências (60 - 6 por domínio)
        $competencies = [
            // Backend
            ['domain' => 'backend', 'name' => 'API Design', 'slug' => 'api-design', 'weight' => 1.00, 'description' => 'REST, GraphQL, gRPC e design de contratos.'],
            ['domain' => 'backend', 'name' => 'Relational Databases', 'slug' => 'relational-db', 'weight' => 0.90, 'description' => 'Modelagem de dados, SQL, índices e transações.'],
            ['domain' => 'backend', 'name' => 'NoSQL & Key-Value', 'slug' => 'nosql-keyvalue', 'weight' => 0.80, 'description' => 'Bancos NoSQL, caches e armazenamento em memória.'],
            ['domain' => 'backend', 'name' => 'Messaging & Queues', 'slug' => 'messaging-queues', 'weight' => 0.80, 'description' => 'Processamento assíncrono, mensageria e brokers.'],
            ['domain' => 'backend', 'name' => 'Design Patterns & Architecture', 'slug' => 'design-patterns-arch', 'weight' => 0.95, 'description' => 'Arquitetura limpa, SOLID, MVC e DDD.'],
            ['domain' => 'backend', 'name' => 'Authentication & Authz', 'slug' => 'auth-backend', 'weight' => 0.85, 'description' => 'JWT, OAuth2, sessões e controle de acesso.'],

            // Frontend
            ['domain' => 'frontend', 'name' => 'UI & Component Development', 'slug' => 'ui-components', 'weight' => 1.00, 'description' => 'Construção de componentes reutilizáveis, React, Vue, Angular.'],
            ['domain' => 'frontend', 'name' => 'Styling & Design Systems', 'slug' => 'styling-design-systems', 'weight' => 0.85, 'description' => 'Tailwind, CSS-in-JS, pre-processadores e design systems.'],
            ['domain' => 'frontend', 'name' => 'State Management', 'slug' => 'state-management', 'weight' => 0.90, 'description' => 'Redux, Zustand, Pinia, Context API.'],
            ['domain' => 'frontend', 'name' => 'Server-Side Rendering (SSR)', 'slug' => 'ssr-ssg', 'weight' => 0.95, 'description' => 'Next.js, Nuxt.js, SSR, SSG e rotas dinâmicas.'],
            ['domain' => 'frontend', 'name' => 'Build Tools & Bundling', 'slug' => 'build-tools', 'weight' => 0.80, 'description' => 'Webpack, Vite, Rollup, transpilação.'],
            ['domain' => 'frontend', 'name' => 'Web Performance & Core Web Vitals', 'slug' => 'web-performance', 'weight' => 0.90, 'description' => 'Otimização de carregamento, SEO técnico e performance.'],

            // Mobile
            ['domain' => 'mobile', 'name' => 'Cross-Platform Apps', 'slug' => 'cross-platform', 'weight' => 1.00, 'description' => 'Flutter, React Native e desenvolvimento híbrido.'],
            ['domain' => 'mobile', 'name' => 'Native iOS Development', 'slug' => 'native-ios', 'weight' => 0.95, 'description' => 'Swift, SwiftUI, Objective-C.'],
            ['domain' => 'mobile', 'name' => 'Native Android Development', 'slug' => 'native-android', 'weight' => 0.95, 'description' => 'Kotlin, Java, Jetpack Compose.'],
            ['domain' => 'mobile', 'name' => 'Mobile UI & Animations', 'slug' => 'mobile-ui-animations', 'weight' => 0.85, 'description' => 'Gestos, animações fluidas e layouts mobile.'],
            ['domain' => 'mobile', 'name' => 'App Store Deployment', 'slug' => 'app-store-deploy', 'weight' => 0.80, 'description' => 'Publicação na App Store, Google Play Store e code signing.'],
            ['domain' => 'mobile', 'name' => 'Offline Storage & Sync', 'slug' => 'offline-sync', 'weight' => 0.90, 'description' => 'SQLite local, Realm e sincronização de dados.'],

            // DevOps & Cloud
            ['domain' => 'devops-cloud', 'name' => 'Cloud Infrastructure Providers', 'slug' => 'cloud-providers', 'weight' => 1.00, 'description' => 'AWS, GCP, Azure, infraestrutura como serviço.'],
            ['domain' => 'devops-cloud', 'name' => 'Container Orchestration', 'slug' => 'container-orchestration', 'weight' => 0.95, 'description' => 'Docker, Kubernetes, Helm, ArgoCD.'],
            ['domain' => 'devops-cloud', 'name' => 'CI/CD Pipelines', 'slug' => 'cicd-pipelines', 'weight' => 0.90, 'description' => 'GitHub Actions, GitLab CI, Jenkins, pipelines automáticas.'],
            ['domain' => 'devops-cloud', 'name' => 'Infrastructure as Code (IaC)', 'slug' => 'iac', 'weight' => 0.90, 'description' => 'Terraform, Ansible, CloudFormation.'],
            ['domain' => 'devops-cloud', 'name' => 'Server Administration & Proxy', 'slug' => 'server-admin', 'weight' => 0.80, 'description' => 'Nginx, Apache HTTP, roteamento e reverse proxy.'],
            ['domain' => 'devops-cloud', 'name' => 'Logging, Monitoring & Observability', 'slug' => 'observability', 'weight' => 0.85, 'description' => 'Prometheus, Grafana, ELK, Datadog.'],

            // Data Engineering
            ['domain' => 'data-engineering', 'name' => 'Data Warehousing & OLAP', 'slug' => 'data-warehousing', 'weight' => 1.00, 'description' => 'Snowflake, BigQuery, Redshift, modelagem dimensional.'],
            ['domain' => 'data-engineering', 'name' => 'ETL & Data Pipelines', 'slug' => 'etl-pipelines', 'weight' => 0.95, 'description' => 'Airflow, Spark, dbt, orquestração de dados.'],
            ['domain' => 'data-engineering', 'name' => 'Stream Processing', 'slug' => 'stream-processing', 'weight' => 0.90, 'description' => 'Kafka, Flink, Spark Streaming.'],
            ['domain' => 'data-engineering', 'name' => 'Distributed Computing', 'slug' => 'distributed-computing', 'weight' => 0.90, 'description' => 'Hadoop, Spark e processamento em clusters.'],
            ['domain' => 'data-engineering', 'name' => 'Data Lakes', 'slug' => 'data-lakes', 'weight' => 0.85, 'description' => 'S3, Parquet, Delta Lake.'],
            ['domain' => 'data-engineering', 'name' => 'Query Engines', 'slug' => 'query-engines', 'weight' => 0.80, 'description' => 'Presto, Athena, processamento ad-hoc.'],

            // AI/ML
            ['domain' => 'ai-ml', 'name' => 'Deep Learning', 'slug' => 'deep-learning', 'weight' => 1.00, 'description' => 'Redes neurais, PyTorch, TensorFlow.'],
            ['domain' => 'ai-ml', 'name' => 'Machine Learning Basics', 'slug' => 'ml-basics', 'weight' => 0.90, 'description' => 'Classificação, regressão, scikit-learn.'],
            ['domain' => 'ai-ml', 'name' => 'Large Language Models & GenAI', 'slug' => 'llm-genai', 'weight' => 0.95, 'description' => 'Prompting, RAG, LangChain, APIs de LLM.'],
            ['domain' => 'ai-ml', 'name' => 'AI Libraries & Data Prep', 'slug' => 'ai-data-prep', 'weight' => 0.80, 'description' => 'Pandas, NumPy, tratamento de dados para IA.'],
            ['domain' => 'ai-ml', 'name' => 'ML Ops', 'slug' => 'mlops', 'weight' => 0.85, 'description' => 'Implantação, versionamento e monitoramento de modelos.'],
            ['domain' => 'ai-ml', 'name' => 'NLP & Computer Vision', 'slug' => 'nlp-cv', 'weight' => 0.90, 'description' => 'Processamento de linguagem natural e processamento de imagem.'],

            // Security
            ['domain' => 'security', 'name' => 'Application Security (AppSec)', 'slug' => 'appsec', 'weight' => 1.00, 'description' => 'OWASP Top 10, análise SAST/DAST, segurança de código.'],
            ['domain' => 'security', 'name' => 'Network Security', 'slug' => 'network-security', 'weight' => 0.90, 'description' => 'Firewalls, criptografia de transporte, Wireshark.'],
            ['domain' => 'security', 'name' => 'Cryptography & Vaults', 'slug' => 'cryptography-vaults', 'weight' => 0.95, 'description' => 'HashiCorp Vault, chaves criptográficas, assinatura digital.'],
            ['domain' => 'security', 'name' => 'Penetration Testing', 'slug' => 'pentest', 'weight' => 0.85, 'description' => 'Kali Linux, Metasploit, testes de intrusão.'],
            ['domain' => 'security', 'name' => 'Compliance & Identity (IAM)', 'slug' => 'iam', 'weight' => 0.90, 'description' => 'Keycloak, Auth0, SAML, governança de acesso.'],
            ['domain' => 'security', 'name' => 'Vulnerability Management', 'slug' => 'vulnerability-management', 'weight' => 0.80, 'description' => 'Auditorias, patches e monitoramento de dependências vulneráveis.'],

            // QA & Testing
            ['domain' => 'qa-testing', 'name' => 'Unit Testing', 'slug' => 'unit-testing', 'weight' => 1.00, 'description' => 'PHPUnit, Jest, JUnit, escopo de unidade.'],
            ['domain' => 'qa-testing', 'name' => 'Integration & API Testing', 'slug' => 'integration-testing', 'weight' => 0.95, 'description' => 'Pest, Postman, testes de rotas e integração.'],
            ['domain' => 'qa-testing', 'name' => 'End-to-End (E2E) Testing', 'slug' => 'e2e-testing', 'weight' => 0.90, 'description' => 'Playwright, Cypress, simulação de navegador.'],
            ['domain' => 'qa-testing', 'name' => 'Load & Performance Testing', 'slug' => 'load-testing', 'weight' => 0.80, 'description' => 'k6, JMeter, testes de estresse.'],
            ['domain' => 'qa-testing', 'name' => 'Test Automation Frameworks', 'slug' => 'test-automation', 'weight' => 0.90, 'description' => 'Selenium, Appium, infraestrutura de testes automatizados.'],
            ['domain' => 'qa-testing', 'name' => 'CI Test Integration', 'slug' => 'ci-test-integration', 'weight' => 0.85, 'description' => 'Execução de testes na esteira de integração contínua.'],

            // Systems & Embedded
            ['domain' => 'systems-embedded', 'name' => 'Embedded C/C++', 'slug' => 'embedded-cpp', 'weight' => 1.00, 'description' => 'Firmware, Arduino, ESP32, C/C++ embarcado.'],
            ['domain' => 'systems-embedded', 'name' => 'Low-Level Systems Programming', 'slug' => 'low-level', 'weight' => 0.95, 'description' => 'Rust, Assembly, sistemas operacionais.'],
            ['domain' => 'systems-embedded', 'name' => 'Microcontrollers & IoT', 'slug' => 'microcontrollers-iot', 'weight' => 0.90, 'description' => 'ARM, Raspberry Pi, sensores e protocolos IoT (MQTT).'],
            ['domain' => 'systems-embedded', 'name' => 'Operating Systems Development', 'slug' => 'os-dev', 'weight' => 0.85, 'description' => 'Kernel hacking, drivers de dispositivo, concorrência.'],
            ['domain' => 'systems-embedded', 'name' => 'Hardware Description Languages (HDL)', 'slug' => 'hdl-hardware', 'weight' => 0.80, 'description' => 'VHDL, Verilog, design lógico de circuitos (FPGAs).'],
            ['domain' => 'systems-embedded', 'name' => 'Compiler Construction', 'slug' => 'compilers', 'weight' => 0.80, 'description' => 'Parsers, analisadores sintáticos e geração de código.'],

            // Web3 & Blockchain
            ['domain' => 'web3-blockchain', 'name' => 'Smart Contracts Development', 'slug' => 'smart-contracts', 'weight' => 1.00, 'description' => 'Solidity, Rust (Solana), Hardhat, compiladores de contratos.'],
            ['domain' => 'web3-blockchain', 'name' => 'Decentralized Applications (dApps)', 'slug' => 'dapps', 'weight' => 0.95, 'description' => 'Integração de frontend Web3 via Ethers.js ou Web3.js.'],
            ['domain' => 'web3-blockchain', 'name' => 'Blockchain Protocols', 'slug' => 'blockchain-protocols', 'weight' => 0.90, 'description' => 'Ethereum, Solana, Bitcoin, arquitetura de rede.'],
            ['domain' => 'web3-blockchain', 'name' => 'Tokenomics & DeFi', 'slug' => 'tokenomics-defi', 'weight' => 0.80, 'description' => 'Tokens ERC20/ERC721, swaps, liquidez e DeFi.'],
            ['domain' => 'web3-blockchain', 'name' => 'Web3 Wallets & Connectors', 'slug' => 'wallets-connectors', 'weight' => 0.85, 'description' => 'Metamask, WalletConnect, RainbowKit.'],
            ['domain' => 'web3-blockchain', 'name' => 'Zero-Knowledge Proofs', 'slug' => 'zkp', 'weight' => 0.90, 'description' => 'ZK-rollups, zk-SNARKs e privacidade.'],
        ];

        $competencyMap = [];
        foreach ($competencies as $c) {
            $domainId = $domainMap[$c['domain']];
            $id = Str::uuid()->toString();
            DB::table('tech_competencies')->updateOrInsert(
                ['slug' => $c['slug']],
                [
                    'id' => $id,
                    'domain_id' => $domainId,
                    'name' => $c['name'],
                    'slug' => $c['slug'],
                    'description' => $c['description'],
                    'weight_in_domain' => $c['weight'],
                    'created_at' => now()
                ]
            );
            $competencyMap[$c['slug']] = DB::table('tech_competencies')->where('slug', $c['slug'])->value('id');
        }

        // 3. Tecnologias (300) com Mapeamento de Competências
        // Estrutura: [name, category, competency_slug, is_primary, weight]
        $techsData = [
            // Backend (Relational / NoSQL / API / Auth / Queues / Design)
            ['PHP', 'language', 'design-patterns-arch', true, 1.0],
            ['Laravel', 'framework', 'design-patterns-arch', true, 1.0],
            ['Laravel Livewire', 'framework', 'ui-components', false, 0.7],
            ['Symfony', 'framework', 'design-patterns-arch', true, 1.0],
            ['Node.js', 'framework', 'api-design', true, 0.9],
            ['NestJS', 'framework', 'design-patterns-arch', true, 1.0],
            ['Express.js', 'framework', 'api-design', true, 1.0],
            ['Fastify', 'framework', 'api-design', true, 0.9],
            ['Go', 'language', 'api-design', true, 1.0],
            ['Gin', 'framework', 'api-design', true, 1.0],
            ['Fiber', 'framework', 'api-design', true, 0.9],
            ['Python', 'language', 'api-design', false, 0.8],
            ['Django', 'framework', 'design-patterns-arch', true, 1.0],
            ['Flask', 'framework', 'api-design', true, 0.8],
            ['FastAPI', 'framework', 'api-design', true, 1.0],
            ['Ruby', 'language', 'design-patterns-arch', false, 0.8],
            ['Ruby on Rails', 'framework', 'design-patterns-arch', true, 1.0],
            ['Java', 'language', 'design-patterns-arch', true, 0.9],
            ['Spring Boot', 'framework', 'design-patterns-arch', true, 1.0],
            ['C#', 'language', 'design-patterns-arch', true, 0.9],
            ['ASP.NET Core', 'framework', 'design-patterns-arch', true, 1.0],
            ['Elixir', 'language', 'messaging-queues', true, 0.9],
            ['Phoenix', 'framework', 'design-patterns-arch', true, 1.0],
            ['gRPC', 'protocol', 'api-design', true, 1.0],
            ['GraphQL', 'protocol', 'api-design', true, 1.0],
            ['Apollo Server', 'library', 'api-design', false, 0.8],
            ['RESTful APIs', 'protocol', 'api-design', true, 1.0],
            ['Swagger/OpenAPI', 'tool', 'api-design', false, 0.9],
            ['PostgreSQL', 'database', 'relational-db', true, 1.0],
            ['MySQL', 'database', 'relational-db', true, 1.0],
            ['MariaDB', 'database', 'relational-db', true, 0.9],
            ['SQLite', 'database', 'relational-db', true, 0.8],
            ['Oracle DB', 'database', 'relational-db', true, 1.0],
            ['MS SQL Server', 'database', 'relational-db', true, 1.0],
            ['Redis', 'database', 'nosql-keyvalue', true, 1.0],
            ['Memcached', 'database', 'nosql-keyvalue', false, 0.8],
            ['MongoDB', 'database', 'nosql-keyvalue', true, 1.0],
            ['Cassandra', 'database', 'nosql-keyvalue', true, 0.9],
            ['DynamoDB', 'database', 'nosql-keyvalue', true, 1.0],
            ['CouchDB', 'database', 'nosql-keyvalue', true, 0.8],
            ['Neo4j', 'database', 'nosql-keyvalue', true, 0.9],
            ['InfluxDB', 'database', 'nosql-keyvalue', true, 0.8],
            ['RabbitMQ', 'tool', 'messaging-queues', true, 1.0],
            ['Apache Kafka', 'tool', 'messaging-queues', true, 1.0],
            ['ActiveMQ', 'tool', 'messaging-queues', true, 0.7],
            ['BullMQ', 'library', 'messaging-queues', false, 0.8],
            ['OAuth 2.0', 'protocol', 'auth-backend', true, 1.0],
            ['JWT (JSON Web Tokens)', 'protocol', 'auth-backend', true, 1.0],
            ['SAML', 'protocol', 'auth-backend', false, 0.7],
            ['Passport.js', 'library', 'auth-backend', false, 0.8],
            ['Laravel Sanctum', 'library', 'auth-backend', false, 0.9],
            ['Keycloak', 'tool', 'iam', true, 1.0],
            ['Auth0', 'platform', 'iam', true, 1.0],
            ['Okta', 'platform', 'iam', true, 0.9],

            // Frontend
            ['JavaScript', 'language', 'ui-components', false, 0.7],
            ['TypeScript', 'language', 'ui-components', false, 0.9],
            ['HTML', 'language', 'ui-components', false, 0.5],
            ['CSS', 'language', 'styling-design-systems', false, 0.5],
            ['React', 'library', 'ui-components', true, 1.0],
            ['React Hooks', 'library', 'ui-components', false, 0.9],
            ['Vue.js', 'framework', 'ui-components', true, 1.0],
            ['Angular', 'framework', 'ui-components', true, 1.0],
            ['Svelte', 'framework', 'ui-components', true, 0.9],
            ['SolidJS', 'framework', 'ui-components', true, 0.8],
            ['Lit', 'library', 'ui-components', false, 0.7],
            ['Next.js', 'framework', 'ssr-ssg', true, 1.0],
            ['Nuxt.js', 'framework', 'ssr-ssg', true, 1.0],
            ['Gatsby', 'framework', 'ssr-ssg', true, 0.9],
            ['Astro', 'framework', 'ssr-ssg', true, 1.0],
            ['Remix', 'framework', 'ssr-ssg', true, 1.0],
            ['TailwindCSS', 'library', 'styling-design-systems', true, 1.0],
            ['Sass', 'library', 'styling-design-systems', false, 0.8],
            ['Less', 'library', 'styling-design-systems', false, 0.6],
            ['Styled Components', 'library', 'styling-design-systems', false, 0.9],
            ['Emotion', 'library', 'styling-design-systems', false, 0.8],
            ['CSS Modules', 'library', 'styling-design-systems', false, 0.7],
            ['Bootstrap', 'library', 'styling-design-systems', false, 0.8],
            ['Material UI', 'library', 'styling-design-systems', false, 0.9],
            ['Shadcn UI', 'library', 'styling-design-systems', true, 1.0],
            ['Base UI', 'library', 'styling-design-systems', false, 0.8],
            ['Ant Design', 'library', 'styling-design-systems', false, 0.7],
            ['Chakra UI', 'library', 'styling-design-systems', false, 0.8],
            ['Radix UI', 'library', 'styling-design-systems', false, 0.9],
            ['Redux', 'library', 'state-management', true, 1.0],
            ['Zustand', 'library', 'state-management', true, 1.0],
            ['MobX', 'library', 'state-management', false, 0.8],
            ['Pinia', 'library', 'state-management', true, 1.0],
            ['Recoil', 'library', 'state-management', false, 0.7],
            ['Webpack', 'tool', 'build-tools', true, 1.0],
            ['Vite', 'tool', 'build-tools', true, 1.0],
            ['Rollup', 'tool', 'build-tools', false, 0.8],
            ['Babel', 'tool', 'build-tools', false, 0.8],
            ['Esbuild', 'tool', 'build-tools', false, 0.9],
            ['Turbopack', 'tool', 'build-tools', false, 0.8],
            ['Lighthouse', 'tool', 'web-performance', false, 0.9],
            ['Google Analytics', 'platform', 'web-performance', false, 0.7],

            // Mobile
            ['React Native', 'framework', 'cross-platform', true, 1.0],
            ['Flutter', 'framework', 'cross-platform', true, 1.0],
            ['Swift', 'language', 'native-ios', true, 1.0],
            ['SwiftUI', 'framework', 'native-ios', true, 1.0],
            ['Objective-C', 'language', 'native-ios', false, 0.6],
            ['Kotlin', 'language', 'native-android', true, 1.0],
            ['Kotlin Multiplatform', 'framework', 'cross-platform', false, 0.8],
            ['Jetpack Compose', 'framework', 'native-android', true, 1.0],
            ['Android SDK', 'framework', 'native-android', false, 0.9],
            ['Ionic', 'framework', 'cross-platform', false, 0.7],
            ['Cordova', 'framework', 'cross-platform', false, 0.5],
            ['Fastlane', 'tool', 'app-store-deploy', true, 1.0],
            ['Realm', 'database', 'offline-sync', true, 0.9],

            // DevOps & Cloud
            ['AWS (Amazon Web Services)', 'platform', 'cloud-providers', true, 1.0],
            ['AWS Lambda', 'platform', 'cloud-providers', false, 0.9],
            ['AWS ECS Fargate', 'platform', 'cloud-providers', false, 0.9],
            ['AWS EC2', 'platform', 'cloud-providers', false, 0.8],
            ['AWS S3', 'platform', 'cloud-providers', false, 0.8],
            ['Google Cloud Platform', 'platform', 'cloud-providers', true, 1.0],
            ['Microsoft Azure', 'platform', 'cloud-providers', true, 1.0],
            ['Cloudflare', 'platform', 'cloud-providers', true, 0.9],
            ['DigitalOcean', 'platform', 'cloud-providers', false, 0.8],
            ['Heroku', 'platform', 'cloud-providers', false, 0.7],
            ['Vercel', 'platform', 'ssr-ssg', false, 0.8],
            ['Netlify', 'platform', 'ssr-ssg', false, 0.7],
            ['Render', 'platform', 'cloud-providers', false, 0.7],
            ['Docker', 'tool', 'container-orchestration', true, 1.0],
            ['Kubernetes', 'tool', 'container-orchestration', true, 1.0],
            ['Helm', 'tool', 'container-orchestration', false, 0.8],
            ['ArgoCD', 'tool', 'container-orchestration', false, 0.9],
            ['GitHub Actions', 'tool', 'cicd-pipelines', true, 1.0],
            ['GitLab CI/CD', 'tool', 'cicd-pipelines', true, 1.0],
            ['Jenkins', 'tool', 'cicd-pipelines', true, 0.9],
            ['CircleCI', 'tool', 'cicd-pipelines', false, 0.8],
            ['Terraform', 'tool', 'iac', true, 1.0],
            ['Ansible', 'tool', 'iac', true, 0.9],
            ['CloudFormation', 'tool', 'iac', false, 0.8],
            ['Nginx', 'tool', 'server-admin', true, 1.0],
            ['Apache HTTP Server', 'tool', 'server-admin', false, 0.7],
            ['Traefik', 'tool', 'server-admin', false, 0.8],
            ['Prometheus', 'tool', 'observability', true, 1.0],
            ['Grafana', 'tool', 'observability', true, 1.0],
            ['Datadog', 'platform', 'observability', true, 1.0],
            ['New Relic', 'platform', 'observability', false, 0.8],
            ['ELK Stack', 'tool', 'observability', false, 0.9],

            // Data Engineering
            ['Snowflake', 'database', 'data-warehousing', true, 1.0],
            ['Google BigQuery', 'database', 'data-warehousing', true, 1.0],
            ['AWS Redshift', 'database', 'data-warehousing', true, 1.0],
            ['Apache Spark', 'framework', 'distributed-computing', true, 1.0],
            ['Apache Airflow', 'tool', 'etl-pipelines', true, 1.0],
            ['dbt (data build tool)', 'tool', 'etl-pipelines', true, 1.0],
            ['Prefect', 'tool', 'etl-pipelines', false, 0.7],
            ['Apache Flink', 'framework', 'stream-processing', true, 0.9],
            ['Delta Lake', 'library', 'data-lakes', true, 0.9],
            ['Presto', 'tool', 'query-engines', true, 0.9],
            ['AWS Athena', 'platform', 'query-engines', false, 0.8],
            ['Hadoop', 'framework', 'distributed-computing', false, 0.7],
            ['Parquet', 'library', 'data-lakes', false, 0.8],

            // AI/ML
            ['PyTorch', 'library', 'deep-learning', true, 1.0],
            ['TensorFlow', 'library', 'deep-learning', true, 1.0],
            ['Scikit-learn', 'library', 'ml-basics', true, 1.0],
            ['NumPy', 'library', 'ai-data-prep', true, 1.0],
            ['Pandas', 'library', 'ai-data-prep', true, 1.0],
            ['Keras', 'library', 'deep-learning', false, 0.8],
            ['SciPy', 'library', 'ai-data-prep', false, 0.7],
            ['OpenAI API', 'platform', 'llm-genai', true, 1.0],
            ['LangChain', 'library', 'llm-genai', true, 1.0],
            ['LlamaIndex', 'library', 'llm-genai', false, 0.8],
            ['Hugging Face', 'platform', 'llm-genai', false, 0.9],
            ['MLflow', 'tool', 'mlops', true, 0.9],
            ['OpenCV', 'library', 'nlp-cv', true, 0.9],

            // Security
            ['Kali Linux', 'tool', 'pentest', true, 0.9],
            ['Wireshark', 'tool', 'network-security', true, 0.9],
            ['Metasploit', 'tool', 'pentest', true, 0.9],
            ['HashiCorp Vault', 'tool', 'cryptography-vaults', true, 1.0],
            ['SonarQube', 'tool', 'appsec', true, 1.0],
            ['OpenSSL', 'library', 'cryptography-vaults', false, 0.8],
            ['Nmap', 'tool', 'network-security', false, 0.8],
            ['OWASP ZAP', 'tool', 'pentest', false, 0.7],

            // QA & Testing
            ['Jest', 'library', 'unit-testing', true, 1.0],
            ['PHPUnit', 'library', 'unit-testing', true, 1.0],
            ['Pest', 'framework', 'integration-testing', true, 1.0],
            ['JUnit', 'library', 'unit-testing', true, 1.0],
            ['Mocha', 'library', 'unit-testing', false, 0.7],
            ['Chai', 'library', 'unit-testing', false, 0.6],
            ['Cypress', 'framework', 'e2e-testing', true, 1.0],
            ['Playwright', 'framework', 'e2e-testing', true, 1.0],
            ['Selenium', 'framework', 'test-automation', true, 0.9],
            ['Testing Library', 'library', 'unit-testing', false, 0.8],
            ['PyTest', 'framework', 'unit-testing', true, 0.9],
            ['Vitest', 'tool', 'unit-testing', false, 0.9],
            ['k6', 'tool', 'load-testing', true, 1.0],
            ['Apache JMeter', 'tool', 'load-testing', true, 0.8],

            // Systems & Embedded
            ['C', 'language', 'low-level', true, 0.8],
            ['C++', 'language', 'embedded-cpp', true, 0.9],
            ['Rust', 'language', 'low-level', true, 1.0],
            ['Arduino', 'platform', 'embedded-cpp', false, 0.8],
            ['ESP32', 'platform', 'microcontrollers-iot', true, 0.9],
            ['Raspberry Pi', 'platform', 'microcontrollers-iot', false, 0.7],
            ['Assembly', 'language', 'low-level', false, 0.5],
            ['VHDL', 'language', 'hdl-hardware', true, 0.9],
            ['Verilog', 'language', 'hdl-hardware', true, 0.9],

            // Web3 & Blockchain
            ['Solidity', 'language', 'smart-contracts', true, 1.0],
            ['Hardhat', 'tool', 'smart-contracts', true, 1.0],
            ['Truffle', 'tool', 'smart-contracts', false, 0.7],
            ['Ethers.js', 'library', 'dapps', true, 1.0],
            ['Web3.js', 'library', 'dapps', false, 0.8],
            ['Metamask', 'tool', 'wallets-connectors', true, 1.0],
            ['WalletConnect', 'tool', 'wallets-connectors', false, 0.9],
            ['IPFS', 'protocol', 'blockchain-protocols', true, 0.8],
            ['Alchemy', 'platform', 'dapps', false, 0.9],
            ['Infura', 'platform', 'dapps', false, 0.8],
            ['OpenZeppelin', 'library', 'smart-contracts', false, 0.9],
            ['Anchor Framework', 'framework', 'smart-contracts', true, 0.9],

            // Outras linguagens / ferramentas (mapeamento genérico)
            ['R', 'language', 'ai-data-prep', false, 0.7],
            ['Julia', 'language', 'ai-data-prep', false, 0.6],
            ['Scala', 'language', 'distributed-computing', false, 0.8],
            ['Perl', 'language', 'low-level', false, 0.5],
            ['Shell Script', 'language', 'server-admin', true, 0.9],
            ['PowerShell', 'language', 'server-admin', false, 0.7],
            ['Haskell', 'language', 'low-level', false, 0.6],
            ['Clojure', 'language', 'low-level', false, 0.6],
            ['Zig', 'language', 'low-level', false, 0.7],
            ['F#', 'language', 'low-level', false, 0.6],
            ['Objective-C', 'language', 'native-ios', false, 0.6],
            ['Lua', 'language', 'low-level', false, 0.7],
            ['Git', 'tool', 'build-tools', false, 0.9],
            ['GitHub', 'platform', 'build-tools', false, 0.9],
            ['GitLab', 'platform', 'build-tools', false, 0.8],
            ['Bitbucket', 'platform', 'build-tools', false, 0.7],
            ['JIRA', 'platform', 'build-tools', false, 0.6],
            ['Postman', 'tool', 'integration-testing', false, 0.8],
            ['Insomnia', 'tool', 'integration-testing', false, 0.7],
            ['VS Code', 'tool', 'build-tools', false, 0.5],
            ['PHPStorm', 'tool', 'build-tools', false, 0.6]
        ];

        // Seed das tecnologias e seus mapeamentos
        foreach ($techsData as $tData) {
            $name = $tData[0];
            $category = $tData[1];
            $compSlug = $tData[2];
            $isPrimary = $tData[3];
            $weight = $tData[4];

            $slug = Str::slug($name);
            if ($name === 'C++') {
                $slug = 'c-plus-plus';
            } elseif ($name === 'C#') {
                $slug = 'c-sharp';
            }

            // Inserir ou recuperar ID da tecnologia
            $tech = DB::table('technologies')->where('slug', $slug)->first();
            if ($tech) {
                $techId = $tech->id;
                // Atualizar atributos novos
                DB::table('technologies')->where('id', $techId)->update([
                    'category' => $category,
                    'status' => 'active',
                    'updated_at' => now()
                ]);
            } else {
                $techId = Str::uuid()->toString();
                DB::table('technologies')->insert([
                    'id' => $techId,
                    'name' => $name,
                    'slug' => $slug,
                    'category' => $category,
                    'status' => 'active',
                    'market_demand_score' => 1.00,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }

            // Inserir mapeamento com a competência
            $compId = $competencyMap[$compSlug] ?? null;
            if ($compId) {
                DB::table('tech_competency_mappings')->updateOrInsert(
                    ['technology_id' => $techId, 'competency_id' => $compId],
                    [
                        'is_primary' => $isPrimary,
                        'contribution_weight' => $weight
                    ]
                );
            }
        }

        // Limpa cache
        \Illuminate\Support\Facades\Cache::forget('technologies:list');
    }
}
