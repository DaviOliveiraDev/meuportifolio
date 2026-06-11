<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TechDnaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Categorias do Tech DNA
        $categories = [
            [
                'name' => 'Linguagens',
                'slug' => 'linguagens',
                'description' => 'Linguagens de programação e marcação principais.'
            ],
            [
                'name' => 'Frameworks',
                'slug' => 'frameworks',
                'description' => 'Frameworks de frontend, backend e bibliotecas de desenvolvimento.'
            ],
            [
                'name' => 'Bancos de Dados',
                'slug' => 'bancos-de-dados',
                'description' => 'Sistemas de gerenciamento de banco de dados relacionais, NoSQL e caches.'
            ],
            [
                'name' => 'Cloud & Infraestrutura',
                'slug' => 'cloud-infraestrutura',
                'description' => 'Provedores de nuvem, hospedagem e serviços serverless.'
            ],
            [
                'name' => 'DevOps & Ferramentas',
                'slug' => 'devops-ferramentas',
                'description' => 'Containerização, automação de CI/CD, servidores web e message brokers.'
            ],
            [
                'name' => 'Desenvolvimento Mobile',
                'slug' => 'desenvolvimento-mobile',
                'description' => 'Tecnologias, SDKs e frameworks voltados para plataformas móveis.'
            ],
            [
                'name' => 'IA & Machine Learning',
                'slug' => 'ia-machine-learning',
                'description' => 'Bibliotecas de computação científica, inteligência artificial e LLMs.'
            ],
            [
                'name' => 'Segurança',
                'slug' => 'seguranca',
                'description' => 'Padrões de autorização, criptografia, auditoria e ferramentas de segurança.'
            ],
        ];

        $categoryMap = [];

        foreach ($categories as $cat) {
            $existing = DB::table('technology_categories')->where('slug', $cat['slug'])->first();
            if ($existing) {
                $categoryMap[$cat['slug']] = $existing->id;
            } else {
                $id = Str::uuid()->toString();
                DB::table('technology_categories')->insert([
                    'id' => $id,
                    'name' => $cat['name'],
                    'slug' => $cat['slug'],
                    'description' => $cat['description'],
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
                $categoryMap[$cat['slug']] = $id;
            }
        }

        // 2. Tecnologias a serem semeadas (120 no total)
        $techs = [
            // --- Linguagens ---
            ['name' => 'PHP', 'category' => 'linguagens'],
            ['name' => 'JavaScript', 'category' => 'linguagens'],
            ['name' => 'TypeScript', 'category' => 'linguagens'],
            ['name' => 'Python', 'category' => 'linguagens'],
            ['name' => 'Ruby', 'category' => 'linguagens'],
            ['name' => 'Go', 'category' => 'linguagens'],
            ['name' => 'Rust', 'category' => 'linguagens'],
            ['name' => 'C#', 'category' => 'linguagens'],
            ['name' => 'Java', 'category' => 'linguagens'],
            ['name' => 'C++', 'category' => 'linguagens'],
            ['name' => 'C', 'category' => 'linguagens'],
            ['name' => 'Swift', 'category' => 'linguagens'],
            ['name' => 'Kotlin', 'category' => 'linguagens'],
            ['name' => 'Dart', 'category' => 'linguagens'],
            ['name' => 'Scala', 'category' => 'linguagens'],
            ['name' => 'Elixir', 'category' => 'linguagens'],
            ['name' => 'HTML', 'category' => 'linguagens'],
            ['name' => 'CSS', 'category' => 'linguagens'],
            ['name' => 'SQL', 'category' => 'linguagens'],
            ['name' => 'Shell Script', 'category' => 'linguagens'],
            ['name' => 'R', 'category' => 'linguagens'],
            ['name' => 'Julia', 'category' => 'linguagens'],

            // --- Frameworks ---
            ['name' => 'Laravel', 'category' => 'frameworks'],
            ['name' => 'Symfony', 'category' => 'frameworks'],
            ['name' => 'React', 'category' => 'frameworks'],
            ['name' => 'Next.js', 'category' => 'frameworks'],
            ['name' => 'Vue.js', 'category' => 'frameworks'],
            ['name' => 'Nuxt.js', 'category' => 'frameworks'],
            ['name' => 'Angular', 'category' => 'frameworks'],
            ['name' => 'NestJS', 'category' => 'frameworks'],
            ['name' => 'Express.js', 'category' => 'frameworks'],
            ['name' => 'Django', 'category' => 'frameworks'],
            ['name' => 'Flask', 'category' => 'frameworks'],
            ['name' => 'FastAPI', 'category' => 'frameworks'],
            ['name' => 'Spring Boot', 'category' => 'frameworks'],
            ['name' => 'ASP.NET Core', 'category' => 'frameworks'],
            ['name' => 'Ruby on Rails', 'category' => 'frameworks'],
            ['name' => 'Phoenix', 'category' => 'frameworks'],
            ['name' => 'Svelte', 'category' => 'frameworks'],
            ['name' => 'Remix', 'category' => 'frameworks'],
            ['name' => 'SolidJS', 'category' => 'frameworks'],
            ['name' => 'Gin', 'category' => 'frameworks'],
            ['name' => 'Fiber', 'category' => 'frameworks'],
            ['name' => 'Laravel Livewire', 'category' => 'frameworks'],
            ['name' => 'Inertia.js', 'category' => 'frameworks'],
            ['name' => 'Django REST Framework', 'category' => 'frameworks'],

            // --- Bancos de Dados ---
            ['name' => 'PostgreSQL', 'category' => 'bancos-de-dados'],
            ['name' => 'MySQL', 'category' => 'bancos-de-dados'],
            ['name' => 'MariaDB', 'category' => 'bancos-de-dados'],
            ['name' => 'SQLite', 'category' => 'bancos-de-dados'],
            ['name' => 'MongoDB', 'category' => 'bancos-de-dados'],
            ['name' => 'Redis', 'category' => 'bancos-de-dados'],
            ['name' => 'Elasticsearch', 'category' => 'bancos-de-dados'],
            ['name' => 'DynamoDB', 'category' => 'bancos-de-dados'],
            ['name' => 'Oracle DB', 'category' => 'bancos-de-dados'],
            ['name' => 'MS SQL Server', 'category' => 'bancos-de-dados'],
            ['name' => 'Cassandra', 'category' => 'bancos-de-dados'],
            ['name' => 'Firebase Firestore', 'category' => 'bancos-de-dados'],
            ['name' => 'Neo4j', 'category' => 'bancos-de-dados'],
            ['name' => 'InfluxDB', 'category' => 'bancos-de-dados'],
            ['name' => 'ClickHouse', 'category' => 'bancos-de-dados'],
            ['name' => 'Memcached', 'category' => 'bancos-de-dados'],

            // --- Cloud ---
            ['name' => 'AWS', 'category' => 'cloud-infraestrutura'],
            ['name' => 'Google Cloud Platform', 'category' => 'cloud-infraestrutura'],
            ['name' => 'Microsoft Azure', 'category' => 'cloud-infraestrutura'],
            ['name' => 'Cloudflare', 'category' => 'cloud-infraestrutura'],
            ['name' => 'DigitalOcean', 'category' => 'cloud-infraestrutura'],
            ['name' => 'Heroku', 'category' => 'cloud-infraestrutura'],
            ['name' => 'Vercel', 'category' => 'cloud-infraestrutura'],
            ['name' => 'Netlify', 'category' => 'cloud-infraestrutura'],
            ['name' => 'Render', 'category' => 'cloud-infraestrutura'],
            ['name' => 'Linode', 'category' => 'cloud-infraestrutura'],
            ['name' => 'Supabase', 'category' => 'cloud-infraestrutura'],
            ['name' => 'Firebase', 'category' => 'cloud-infraestrutura'],

            // --- DevOps & Ferramentas ---
            ['name' => 'Docker', 'category' => 'devops-ferramentas'],
            ['name' => 'Kubernetes', 'category' => 'devops-ferramentas'],
            ['name' => 'Terraform', 'category' => 'devops-ferramentas'],
            ['name' => 'Ansible', 'category' => 'devops-ferramentas'],
            ['name' => 'Jenkins', 'category' => 'devops-ferramentas'],
            ['name' => 'GitHub Actions', 'category' => 'devops-ferramentas'],
            ['name' => 'GitLab CI/CD', 'category' => 'devops-ferramentas'],
            ['name' => 'Nginx', 'category' => 'devops-ferramentas'],
            ['name' => 'Apache HTTP Server', 'category' => 'devops-ferramentas'],
            ['name' => 'Prometheus', 'category' => 'devops-ferramentas'],
            ['name' => 'Grafana', 'category' => 'devops-ferramentas'],
            ['name' => 'Webpack', 'category' => 'devops-ferramentas'],
            ['name' => 'Vite', 'category' => 'devops-ferramentas'],
            ['name' => 'Git', 'category' => 'devops-ferramentas'],
            ['name' => 'RabbitMQ', 'category' => 'devops-ferramentas'],
            ['name' => 'Apache Kafka', 'category' => 'devops-ferramentas'],
            ['name' => 'Helm', 'category' => 'devops-ferramentas'],
            ['name' => 'ArgoCD', 'category' => 'devops-ferramentas'],

            // --- Mobile ---
            ['name' => 'React Native', 'category' => 'desenvolvimento-mobile'],
            ['name' => 'Flutter', 'category' => 'desenvolvimento-mobile'],
            ['name' => 'Swift (iOS)', 'category' => 'desenvolvimento-mobile'],
            ['name' => 'Kotlin (Android)', 'category' => 'desenvolvimento-mobile'],
            ['name' => 'Ionic', 'category' => 'desenvolvimento-mobile'],
            ['name' => 'Jetpack Compose', 'category' => 'desenvolvimento-mobile'],
            ['name' => 'SwiftUI', 'category' => 'desenvolvimento-mobile'],
            ['name' => 'Android SDK', 'category' => 'desenvolvimento-mobile'],

            // --- IA ---
            ['name' => 'PyTorch', 'category' => 'ia-machine-learning'],
            ['name' => 'TensorFlow', 'category' => 'ia-machine-learning'],
            ['name' => 'Scikit-learn', 'category' => 'ia-machine-learning'],
            ['name' => 'OpenAI API', 'category' => 'ia-machine-learning'],
            ['name' => 'LangChain', 'category' => 'ia-machine-learning'],
            ['name' => 'Hugging Face', 'category' => 'ia-machine-learning'],
            ['name' => 'NumPy', 'category' => 'ia-machine-learning'],
            ['name' => 'SciPy', 'category' => 'ia-machine-learning'],
            ['name' => 'Pandas', 'category' => 'ia-machine-learning'],
            ['name' => 'Keras', 'category' => 'ia-machine-learning'],

            // --- Segurança ---
            ['name' => 'OWASP Top 10', 'category' => 'seguranca'],
            ['name' => 'Kali Linux', 'category' => 'seguranca'],
            ['name' => 'Wireshark', 'category' => 'seguranca'],
            ['name' => 'Metasploit', 'category' => 'seguranca'],
            ['name' => 'HashiCorp Vault', 'category' => 'seguranca'],
            ['name' => 'OAuth 2.0', 'category' => 'seguranca'],
            ['name' => 'JWT (JSON Web Tokens)', 'category' => 'seguranca'],
            ['name' => 'TLS/SSL', 'category' => 'seguranca'],
            ['name' => 'SAML', 'category' => 'seguranca'],
            ['name' => 'SonarQube', 'category' => 'seguranca'],
        ];

        foreach ($techs as $tech) {
            $catId = $categoryMap[$tech['category']];
            $slug = Str::slug($tech['name']);
            if ($tech['name'] === 'C++') {
                $slug = 'c-plus-plus';
            } elseif ($tech['name'] === 'C#') {
                $slug = 'c-sharp';
            }

            $exists = DB::table('technologies')->where('slug', $slug)->exists();
            if (!$exists) {
                DB::table('technologies')->insert([
                    'id' => Str::uuid()->toString(),
                    'category_id' => $catId,
                    'name' => $tech['name'],
                    'slug' => $slug,
                    'logo_url' => null,
                    'is_verified' => true,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
        }

        // Limpa o cache de tecnologias para garantir que a lista seja recarregada
        \Illuminate\Support\Facades\Cache::forget('technologies:list');
    }
}
