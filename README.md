# DevFolio 🚀 - Plataforma SaaS de Portfólios Automatizados

O **DevFolio** é uma plataforma SaaS premium que permite a desenvolvedores e profissionais de tecnologia criarem, gerenciarem e publicarem sua presença digital (portfólio e currículo online) em minutos. A plataforma sincroniza dados diretamente com o GitHub, gera currículos em PDF otimizados para sistemas de triagem (ATS) e oferece múltiplos temas visuais sofisticados.

---

## 🛠️ Tecnologias Utilizadas

### Frontend (Next.js)
* **Framework:** Next.js 15+ (App Router)
* **Estilização:** Tailwind CSS v4 (Design System moderno e customizado)
* **Componentes:** Shadcn UI v4 (Base Nova com `@base-ui/react`)
* **Gerenciamento de Estado & Requisições:** TanStack React Query v5
* **Formulários & Validação:** React Hook Form & Zod
* **Icons:** Lucide React

### Backend (Laravel API)
* **Framework:** Laravel 12 (PHP 8.4+)
* **Banco de Dados:** PostgreSQL
* **Cache & Filas:** Redis (Predis)
* **Autenticação:** Laravel Sanctum (Cookies Stateful na mesma origem) & Socialite (OAuth2 GitHub/Google)
* **Testes:** PHPUnit/Pest (TDD-ready com banco em memória/docker de teste)
* **Armazenamento:** AWS S3 (com chaveamento local automático para desenvolvimento)

### Infraestrutura Local
* **Containerização:** Docker Compose (PostgreSQL e Redis)
* **Proxy Reverso:** Nginx (orquestração de rotas sob a mesma origem para contornar políticas de CORS/Cookies)

---

## 🌟 Funcionalidades Principais

* **Temas Premium Customizados:**
  * 📄 **Minimalista:** Estilo editorial clássico de revista, fontes serifadas e colunas assimétricas.
  * 🌌 **Moderno (Glassmorphism):** Fundo espacial escuro, luzes neon desfocadas (glow blobs) e cartões translúcidos.
  * 👾 **Cyberpunk:** Base preta absoluta com grid ciano/rosa, brackets técnicos e glows brilhantes.
  * 🎨 **Neobrutalista:** Estética de alto contraste com bordas grossas pretas de 3px e sombras planas 2D.
* **Sincronização GitHub:** Importação assíncrona em background via filas do Redis para mapear repositórios públicos a projetos do portfólio.
* **Currículo PDF Automatizado:** Exportação do currículo em PDF formatado para leitura automática de recrutadores (ATS-friendly) via Puppeteer/Browsershot.
* **Analytics de Alta Escrita:** Ingestão de visualizações e cliques em cache com buffering no Redis e escrita em lote (Flush agendado) no PostgreSQL, contornando gargalos de IOPS.
* **Upload de Imagens:** Redimensionamento e otimização para formato WebP automatizados antes do salvamento em nuvem.

---

## 📁 Estrutura do Monorepo

```text
meuportifolio/
├── frontend/                  # Aplicação Next.js (Visual & Client-side)
├── backend/                   # API RESTful Laravel (Lógica de Negócios & Infra)
├── nginx.conf                 # Proxy reverso para orquestração de portas locais
├── docker-compose.yml         # Containerização do banco PostgreSQL e cache Redis
├── .gitignore                 # Arquivo de exclusão do repositório Git
└── README.md                  # Documentação do projeto
```

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
* Docker & Docker Compose instalados na máquina
* Node.js v20+ e NPM
* PHP v8.4+ e Composer (no host local)

---

### Passo 1: Inicializar a Infraestrutura (Docker)
Suba os containers do PostgreSQL e do Redis:
```bash
docker-compose up -d
```
Isso iniciará o banco na porta `5432` e o Redis na porta `6379`.

---

### Passo 2: Configurar o Backend (Laravel)
1. Acesse a pasta do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências do PHP:
   ```bash
   composer install
   ```
3. Crie e configure o arquivo de ambiente:
   ```bash
   cp .env.example .env
   # Gere a chave da aplicação
   php artisan key:generate
   ```
4. Execute as migrations para estruturar o banco local e populate com seeders de demonstração:
   ```bash
   php artisan migrate --seed
   ```
5. Inicie o servidor local da API Laravel:
   ```bash
   php artisan serve --port=8000
   ```
6. Inicie a fila do Redis (Queue worker) para processar os jobs assíncronos:
   ```bash
   php artisan queue:work
   ```

---

### Passo 3: Configurar o Frontend (Next.js)
1. Acesse a pasta do frontend:
   ```bash
   cd ../frontend
   ```
2. Instale as dependências do Node:
   ```bash
   npm install
   ```
3. Configure a URL da API criando um arquivo `.env.local`:
   ```text
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```
4. Inicie o servidor de desenvolvimento do Next.js:
   ```bash
   npm run dev
   ```

Abra o navegador em `http://localhost:3000` para testar a landing page interativa e o dashboard administrativo!

---

## 🧪 Executando Testes Automatizados
O backend possui suítes completas de testes de feature cobrindo todos os fluxos de CRUD, upload e sincronizações.
Para executá-los, acesse a pasta `backend` e execute:
```bash
php artisan test
```

---

## 📄 Licença
Este projeto está licenciado sob a licença MIT. Consulte o arquivo LICENSE para obter mais informações.
