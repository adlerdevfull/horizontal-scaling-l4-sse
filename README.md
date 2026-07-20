# Desafio 7 — Horizontal Scaling with L4 Load Balancer + SSE

---

## 🇬🇧 English

Distributed architecture with 3 replicas, Layer 4 Load Balancer, SSE and shared state via Redis.

### Stack

- **Backend**: PHP 8.2 + Laravel 11 (3 replicas)
- **Database**: PostgreSQL 16 (shared)
- **Cache / Pub-Sub**: Redis 7 (shared state)
- **Load Balancer**: NGINX L4 Stream
- **Streaming**: SSE (Server-Sent Events)
- **Auth**: JWT (stateless)
- **Infra**: Docker + docker-compose

### Architecture

```
                    ┌─────────────────┐
                    │   Client/Browser │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │    NGINX L4 Load Balancer    │
              │   :8000 (API) :8001 (SSE)   │
              └──┬──────────┬──────────┬────┘
                 │          │          │
           ┌─────┴──┐ ┌────┴───┐ ┌────┴───┐
           │  app1  │ │  app2  │ │  app3  │
           └────┬───┘ └────┬───┘ └────┬───┘
                │          │          │
         ┌──────┴──────────┴──────────┴──────┐
         │         Redis (shared state)       │
         └────────────────────────────────────┘
                         │
              ┌──────────┴──────────┐
              │     PostgreSQL       │
              └─────────────────────┘
```

### How to run

```bash
cp .env.example .env
docker compose up -d --build
docker compose exec app1 composer install
docker compose exec app1 php artisan key:generate
docker compose exec app1 php artisan jwt:secret
docker compose exec app1 php artisan migrate --seed
```

- API (load balanced): http://localhost:8000/api/v1
- SSE (long-lived): http://localhost:8001/api/v1/events

**Login**: admin@platform.test / password

### Why Layer 4?

| L4 (TCP) | L7 (HTTP) |
|----------|-----------|
| Does not inspect content | Reads HTTP headers |
| Lower latency | Can route by URL |
| Natively supports long-lived connections | Can buffer/timeout SSE |
| Less overhead | More features (SSL termination, rewrite) |

L4 is essential for SSE because L7 can buffer the response or apply connection timeouts, breaking the stream.

### How scalability works

1. **Stateless** — JWT requires no server-side session
2. **Redis** — all shared state (events, cache, sessions)
3. **Any instance** can serve any request
4. **SSE** — events published to Redis are consumed by any instance
5. **Failover** — LB detects a dead instance within 30s and redirects

### Tests

```bash
# Load test (100 connections, 30s)
chmod +x scripts/load-test.sh && ./scripts/load-test.sh 100 30

# Failover test
chmod +x scripts/failover-test.sh && ./scripts/failover-test.sh

# Unit tests
docker compose exec app1 vendor/bin/pest --coverage --min=75
```

---

## 🇪🇸 Español

Arquitectura distribuida con 3 réplicas, Load Balancer Layer 4, SSE y estado compartido vía Redis.

### Stack

- **Backend**: PHP 8.2 + Laravel 11 (3 réplicas)
- **Base de datos**: PostgreSQL 16 (compartida)
- **Caché / Pub-Sub**: Redis 7 (estado compartido)
- **Load Balancer**: NGINX L4 Stream
- **Streaming**: SSE (Server-Sent Events)
- **Auth**: JWT (stateless)
- **Infra**: Docker + docker-compose

### Arquitectura

```
                    ┌─────────────────┐
                    │   Client/Browser │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │    NGINX L4 Load Balancer    │
              │   :8000 (API) :8001 (SSE)   │
              └──┬──────────┬──────────┬────┘
                 │          │          │
           ┌─────┴──┐ ┌────┴───┐ ┌────┴───┐
           │  app1  │ │  app2  │ │  app3  │
           └────┬───┘ └────┬───┘ └────┬───┘
                │          │          │
         ┌──────┴──────────┴──────────┴──────┐
         │         Redis (estado compartido)  │
         └────────────────────────────────────┘
                         │
              ┌──────────┴──────────┐
              │     PostgreSQL       │
              └─────────────────────┘
```

### Cómo ejecutar

```bash
cp .env.example .env
docker compose up -d --build
docker compose exec app1 composer install
docker compose exec app1 php artisan key:generate
docker compose exec app1 php artisan jwt:secret
docker compose exec app1 php artisan migrate --seed
```

- API (balanceada): http://localhost:8000/api/v1
- SSE (conexión larga): http://localhost:8001/api/v1/events

**Login**: admin@platform.test / password

### ¿Por qué Layer 4?

| L4 (TCP) | L7 (HTTP) |
|----------|-----------|
| No inspecciona el contenido | Lee headers HTTP |
| Menor latencia | Puede enrutar por URL |
| Soporta conexiones largas nativamente | Puede bufferizar/timeout SSE |
| Menos overhead | Más funcionalidades |

L4 es esencial para SSE porque L7 puede bufferizar la respuesta o aplicar timeouts, rompiendo el stream.

### Cómo funciona la escalabilidad

1. **Stateless** — JWT no requiere sesión en el servidor
2. **Redis** — todo el estado compartido (eventos, caché, sesiones)
3. **Cualquier instancia** puede servir cualquier petición
4. **SSE** — eventos publicados en Redis son consumidos por cualquier instancia
5. **Failover** — el LB detecta una instancia caída en 30s y redirige

### Tests

```bash
# Test de carga (100 conexiones, 30s)
chmod +x scripts/load-test.sh && ./scripts/load-test.sh 100 30

# Test de failover
chmod +x scripts/failover-test.sh && ./scripts/failover-test.sh

# Tests unitarios
docker compose exec app1 vendor/bin/pest --coverage --min=75
```

---

## 🇧🇷 Português

Arquitetura distribuída com 3 réplicas, Load Balancer Layer 4, SSE e estado compartilhado via Redis.

### Stack

- **Backend**: PHP 8.2 + Laravel 11 (3 réplicas)
- **Banco de dados**: PostgreSQL 16 (compartilhado)
- **Cache / Pub-Sub**: Redis 7 (estado compartilhado)
- **Load Balancer**: NGINX L4 Stream
- **Streaming**: SSE (Server-Sent Events)
- **Auth**: JWT (stateless)
- **Infra**: Docker + docker-compose

### Arquitetura

```
                    ┌─────────────────┐
                    │   Client/Browser │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │    NGINX L4 Load Balancer    │
              │   :8000 (API) :8001 (SSE)   │
              └──┬──────────┬──────────┬────┘
                 │          │          │
           ┌─────┴──┐ ┌────┴───┐ ┌────┴───┐
           │  app1  │ │  app2  │ │  app3  │
           └────┬───┘ └────┬───┘ └────┬───┘
                │          │          │
         ┌──────┴──────────┴──────────┴──────┐
         │         Redis (estado compartilhado)│
         └────────────────────────────────────┘
                         │
              ┌──────────┴──────────┐
              │     PostgreSQL       │
              └─────────────────────┘
```

### Como executar

```bash
cp .env.example .env
docker compose up -d --build
docker compose exec app1 composer install
docker compose exec app1 php artisan key:generate
docker compose exec app1 php artisan jwt:secret
docker compose exec app1 php artisan migrate --seed
```

- API (balanceada): http://localhost:8000/api/v1
- SSE (conexão longa): http://localhost:8001/api/v1/events

**Login**: admin@platform.test / password

### Por que Layer 4?

| L4 (TCP) | L7 (HTTP) |
|----------|-----------|
| Não inspeciona o conteúdo | Lê headers HTTP |
| Menor latência | Pode rotear por URL |
| Suporta conexões longas nativamente | Pode bufferizar/timeout SSE |
| Menos overhead | Mais funcionalidades |

L4 é essencial para SSE porque L7 pode bufferizar a resposta ou aplicar timeouts, quebrando o stream.

### Como funciona a escalabilidade

1. **Stateless** — JWT não requer sessão no servidor
2. **Redis** — todo estado compartilhado (eventos, cache, sessões)
3. **Qualquer instância** pode servir qualquer requisição
4. **SSE** — eventos publicados no Redis são consumidos por qualquer instância
5. **Failover** — LB detecta instância morta em 30s e redireciona

### Testes

```bash
# Teste de carga (100 conexões, 30s)
chmod +x scripts/load-test.sh && ./scripts/load-test.sh 100 30

# Teste de failover
chmod +x scripts/failover-test.sh && ./scripts/failover-test.sh

# Testes unitários
docker compose exec app1 vendor/bin/pest --coverage --min=75
```
