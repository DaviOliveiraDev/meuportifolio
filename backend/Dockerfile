FROM php:8.4-cli

# Define o diretório de trabalho
WORKDIR /var/www/html

# Instala dependências do sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    gnupg \
    # Dependências necessárias para o Chromium / Puppeteer (Browsershot)
    chromium \
    libnss3 \
    libatk-bridge2.0-0 \
    libxcomposite1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libxshmfence1 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Instala extensões do PHP essenciais
RUN docker-php-ext-install pdo_pgsql pgsql mbstring exif pcntl bcmath gd

# Instala extensão do Redis via PECL
RUN pecl install redis && docker-php-ext-enable redis

# Instala o Composer v2
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Instala Node.js e NPM (necessário para rodar o Puppeteer via Browsershot)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Define variáveis de ambiente para o Puppeteer encontrar o Chromium instalado no sistema
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Copia os arquivos da aplicação
COPY . /var/www/html

# Garante que nenhum arquivo de cache local/de testes seja copiado
RUN rm -f bootstrap/cache/*.php

# Instala as dependências do Composer para produção
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

# Ajusta permissões das pastas de storage e cache do bootstrap
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expõe a porta
EXPOSE 80

# Executa o servidor nativo do PHP Artisan
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=80"]
