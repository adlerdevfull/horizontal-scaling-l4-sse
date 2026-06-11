FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist 2>/dev/null || true

FROM php:8.2-fpm-alpine AS production
RUN apk add --no-cache nginx postgresql-dev redis icu-dev linux-headers $PHPIZE_DEPS \
    && docker-php-ext-install pdo pdo_pgsql intl opcache bcmath \
    && pecl install redis && docker-php-ext-enable redis && apk del $PHPIZE_DEPS
COPY docker/app/nginx-app.conf /etc/nginx/http.d/default.conf
COPY docker/app/php.ini /usr/local/etc/php/conf.d/custom.ini
COPY docker/app/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
WORKDIR /var/www/html
COPY --from=vendor /app/vendor ./vendor
COPY . .
EXPOSE 80
CMD ["/entrypoint.sh"]

FROM php:8.2-fpm-alpine AS development
RUN apk add --no-cache nginx postgresql-dev redis icu-dev linux-headers $PHPIZE_DEPS \
    && docker-php-ext-install pdo pdo_pgsql intl opcache bcmath \
    && pecl install redis xdebug && docker-php-ext-enable redis xdebug && apk del $PHPIZE_DEPS
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY docker/app/nginx-app.conf /etc/nginx/http.d/default.conf
COPY docker/app/php.ini /usr/local/etc/php/conf.d/custom.ini
COPY docker/app/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
WORKDIR /var/www/html
EXPOSE 80
CMD ["/entrypoint.sh"]
