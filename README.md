# Horizontal Scaling with L4 Load Balancer + SSE


> **Languages / Idiomas / Idiomas:** [English](#-english) · [Español](#-español) · [Português](#-português)

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

### Delivery phases

This repository was built in progressive phases (see commit history):

| Phase | Focus |
|-------|--------|
| 1. Scaffold | Bootstrap Laravel API, tooling and ignore rules |
| 2. Domain | Business entities, value objects and repository ports |
| 3. Application | Use-case handlers (commands / services) |
| 4. Infrastructure | Eloquent adapters, Redis and providers |
| 5. API | HTTP controllers, requests, resources and routes |
| 6. Database | Migrations and seeders |
| 7. Config | App, auth, cache, queue configuration |
| 8. Docker | Dockerfile + docker-compose local stack |
| 9. Frontend tooling | Vite, Tailwind and SPA scaffold |
| 10. Frontend UI | Pages, hooks and API client |
| 11. Tests | Unit and feature tests |
| 12. Docs & CI | README multi-language and GitHub Actions |
| 13. Multi-replica | Three identical app instances behind NGINX L4 |
| 14. Failover & load tests | Scripts for load and instance failure |

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

### Fases de entrega

Este repositorio se construyó en fases progresivas (ver historial de commits):

| Fase | Enfoque |
|-------|--------|
| 1. Scaffold | Bootstrap de la API Laravel, tooling e ignore rules |
| 2. Dominio | Entidades, value objects e interfaces de repositorio |
| 3. Aplicación | Handlers de casos de uso (commands / services) |
| 4. Infraestructura | Adapters Eloquent, Redis y providers |
| 5. API | Controllers HTTP, requests, resources y rutas |
| 6. Base de datos | Migraciones y seeders |
| 7. Config | Configuración de app, auth, cache y colas |
| 8. Docker | Dockerfile + docker-compose local |
| 9. Frontend tooling | Vite, Tailwind y scaffold SPA |
| 10. Frontend UI | Páginas, hooks y cliente API |
| 11. Tests | Tests unitarios y de feature |
| 12. Docs & CI | README multi-idioma y GitHub Actions |
| 13. Multi-réplica | Tres instancias idénticas detrás de NGINX L4 |
| 14. Failover y carga | Scripts de carga y fallo de instancia |

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

### Fases de entrega

Este repositório foi construído em fases progressivas (ver histórico de commits):

| Fase | Foco |
|-------|--------|
| 1. Scaffold | Bootstrap da API Laravel, tooling e ignore rules |
| 2. Domínio | Entidades, value objects e portas de repositório |
| 3. Aplicação | Handlers de casos de uso (commands / services) |
| 4. Infraestrutura | Adapters Eloquent, Redis e providers |
| 5. API | Controllers HTTP, requests, resources e rotas |
| 6. Banco de dados | Migrations e seeders |
| 7. Config | Configuração de app, auth, cache e filas |
| 8. Docker | Dockerfile + docker-compose local |
| 9. Frontend tooling | Vite, Tailwind e scaffold SPA |
| 10. Frontend UI | Páginas, hooks e cliente da API |
| 11. Testes | Testes unitários e de feature |
| 12. Docs & CI | README multi-idioma e GitHub Actions |
| 13. Multi-réplica | Três instâncias idênticas atrás do NGINX L4 |
| 14. Failover e carga | Scripts de carga e falha de instância |

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
