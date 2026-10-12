FROM php:8.2-fpm

# Gerekli paketler
RUN apt-get update && apt-get install -y \
    curl \
    zip \
    unzip \
    git \
    libonig-dev \
    libxml2-dev \
    libzip-dev

# PHP eklentileri
RUN docker-php-ext-install pdo_mysql mbstring zip exif pcntl

# Composer yükle
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Çalışma dizini
WORKDIR /var/www

# Laravel izinleri
RUN chown -R www-data:www-data /var/www
