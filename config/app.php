<?php
return [
    'name' => env('APP_NAME', 'LB Platform'), 'env' => env('APP_ENV', 'production'),
    'debug' => (bool) env('APP_DEBUG', false), 'url' => env('APP_URL'),
    'timezone' => 'Europe/Madrid', 'key' => env('APP_KEY'), 'cipher' => 'AES-256-CBC',
    'providers' => [
        Illuminate\Auth\AuthServiceProvider::class, Illuminate\Cache\CacheServiceProvider::class,
        Illuminate\Database\DatabaseServiceProvider::class, Illuminate\Filesystem\FilesystemServiceProvider::class,
        Illuminate\Foundation\Providers\FoundationServiceProvider::class, Illuminate\Hashing\HashServiceProvider::class,
        Illuminate\Pipeline\PipelineServiceProvider::class, Illuminate\Queue\QueueServiceProvider::class,
        Illuminate\Redis\RedisServiceProvider::class, Illuminate\Routing\RoutingServiceProvider::class,
        Illuminate\Translation\TranslationServiceProvider::class, Illuminate\Validation\ValidationServiceProvider::class,
        Illuminate\View\ViewServiceProvider::class,
        Illuminate\Foundation\Providers\ConsoleSupportServiceProvider::class,
        Illuminate\Bus\BusServiceProvider::class,
        Illuminate\Encryption\EncryptionServiceProvider::class,
        Tymon\JWTAuth\Providers\LaravelServiceProvider::class,
        App\Providers\DomainServiceProvider::class,
    ],
];
