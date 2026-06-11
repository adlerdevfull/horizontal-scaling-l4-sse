#!/bin/sh
cd /var/www/html

if [ ! -f "vendor/autoload.php" ]; then
    echo "Installing dependencies..."
    for i in 1 2 3; do
        composer install --no-interaction --prefer-dist --no-security-blocking && break
        echo "Retry $i..."; sleep 2
    done
fi

[ ! -f ".env" ] && cp .env.example .env

echo "Waiting for PostgreSQL..."
RETRIES=0
until php -r "try{new PDO('pgsql:host='.getenv('DB_HOST').';port='.getenv('DB_PORT').';dbname='.getenv('DB_DATABASE'),getenv('DB_USERNAME'),getenv('DB_PASSWORD'));echo 'ok';}catch(Exception \$e){exit(1);}" 2>/dev/null; do
    RETRIES=$((RETRIES+1)); [ $RETRIES -ge 30 ] && break; sleep 1
done

php artisan key:generate --force 2>/dev/null || true
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider" 2>/dev/null || true
php artisan jwt:secret --force 2>/dev/null || true
php artisan migrate --force --seed 2>/dev/null || php artisan migrate --force 2>/dev/null || true
chmod -R 775 storage bootstrap/cache 2>/dev/null || true

php-fpm -D
nginx -g "daemon off;"
