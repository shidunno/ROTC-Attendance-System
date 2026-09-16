FROM php:8.3-apache

# Install system dependencies & all common Laravel PHP extensions
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libcurl4-openssl-dev \
    pkg-config \
    && docker-php-ext-install pdo_mysql zip exif pcntl bcmath gd mbstring xml dom curl fileinfo

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy project files
COPY . /var/www/html

# Install dependencies with verbose (-v) flag to show the exact error
RUN composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction -v

# Set permissions for Laravel storage and cache folders
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Point Apache document root to Laravel's public folder
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Enable Apache mod_rewrite for Laravel routing
RUN a2enmod rewrite