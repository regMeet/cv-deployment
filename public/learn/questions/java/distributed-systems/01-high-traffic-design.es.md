# Diseñar un sistema para 1M req/min

> ~16K req/sec. Bastante alto pero no loco. Las preguntas reales son: ratio read/write, requisitos de consistencia, y SLOs.

## Preguntas clarificadoras primero

- **¿Ratio read/write?** (1M reads vs 1M writes son problemas muy distintos)
- **¿Consistencia** — estricta o eventual?
- **¿SLOs de latencia** — budget de p99?
- **¿Distribución geográfica?**
- **¿Hot-spots de datos?**

## Arquitectura de alto nivel

```
[Clientes]
    ↓
[CDN / edge cache]   ← static + GET cacheable
    ↓
[Load balancer (ALB / nginx)]
    ↓
[App tier — N instances, autoscaled]
    ├── Redis (L2 cache, sessions, datos calientes)
    ├── DB primary (writes) + read replicas (reads)
    └── Kafka (eventos async, fanout, analytics)
        ↓
    [Background workers para trabajo no bloqueante]
```

## Capas y qué hacen

- **CDN** — mata la cola larga de requests estáticos / cacheables antes de que toquen tu backend.
- **Load balancer** — distribuye entre instancias, health checks.
- **App tier** — stateless. Escala horizontal según métricas (CPU / req-rate).
- **Cache (Redis)** — reads calientes, sessions. L1 (Caffeine in-process) encima para hits en nanosegundos.
- **DB** — primary para writes, read replicas para reads. **Sharding** por `user_id` / región si una sola DB no banca las escrituras.
- **Capa async (Kafka / RabbitMQ)** — todo lo que no necesita bloquear el response: emails, analytics, propagación downstream.

## Preocupaciones a mencionar

- **Rate limiting** por IP / user (token bucket, contador en Redis).
- **Idempotencia** para writes que pueden ser reintentados.
- **Circuit breakers** entre servicios.
- **Observabilidad** desde día 1 — métricas, structured logs, distributed tracing.
- **Autoscaling** sobre leading indicators (req-rate, queue depth) no lagging (CPU > 90%).

## Encuadre senior

> "1M req/min is mostly a problem of horizontal scale + good caching + async fanout for non-critical work. The interesting choices are usually consistency vs availability, and how you handle the write path — that's where it actually gets hard."
