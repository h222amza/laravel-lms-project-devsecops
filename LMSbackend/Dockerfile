# syntax=docker/dockerfile:1

# --------------------------------------------------
# Stage 1: PHP runtime and required extensions
# --------------------------------------------------
FROM php:8.3-fpm-bookworm AS php-base

RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    supervisor \
    curl \
    git \
    unzip \
    libicu-dev \
    libzip-dev \
    libonig-dev \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
        bcmath \
        exif \
        gd \
        intl \
        mbstring \
        opcache \
        pcntl \
        pdo_mysql \
        zip \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html


# --------------------------------------------------
# Stage 2: Install production PHP dependencies
# --------------------------------------------------
FROM php-base AS php-dependencies

COPY . .

RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --no-progress


# --------------------------------------------------
# Stage 3: Build frontend assets
# --------------------------------------------------
FROM node:22-bookworm-slim AS frontend-build

WORKDIR /app

COPY package.json package-lock.json vite.config.js ./
COPY resources ./resources
COPY public ./public

RUN npm ci && npm run build


# --------------------------------------------------
# Stage 4: Final runtime image
# --------------------------------------------------
FROM php-base AS runtime

WORKDIR /var/www/html

# Copy Laravel and its production PHP dependencies.
COPY --from=php-dependencies /var/www/html /var/www/html

# Copy compiled Vite assets.
COPY --from=frontend-build /app/public/build /var/www/html/public/build

# Install our new container-specific configuration.
COPY docker/nginx-site.conf /etc/nginx/conf.d/default.conf
COPY docker/php-production.ini /usr/local/etc/php/conf.d/zz-production.ini
COPY docker/supervisord.conf /etc/supervisor/supervisord.conf
# Prepare Laravel's writable directories and validate configurations.
RUN mkdir -p \
        /var/www/html/storage/framework/cache \
        /var/www/html/storage/framework/sessions \
        /var/www/html/storage/framework/views \
        /var/www/html/storage/logs \
        /var/www/html/bootstrap/cache \
    && chown -R www-data:www-data \
        /var/www/html/storage \
        /var/www/html/bootstrap/cache \
    && nginx -t \
    && php-fpm -t

EXPOSE 8080

CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/supervisord.conf"]
