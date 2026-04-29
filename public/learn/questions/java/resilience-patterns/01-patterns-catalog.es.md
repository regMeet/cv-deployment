# Catálogo de resilience patterns (referencia de una página)

> Referencia rápida de los patterns que más aparecen en entrevistas senior/staff.

## Resiliencia core

### 🔌 Circuit Breaker
Frena llamadas a un servicio que falla después de N fallas y falla rápido. Previene cascading failures. (Resilience4j, Hystrix)

### 🔁 Retry
Reintenta requests fallidos, idealmente con **backoff exponencial + jitter** para evitar estampidas.

### ⏳ Timeout
Limita cuánto espera el caller. Previene exhaustion de threads. Debe coincidir con SLOs (budget de p99).

### 🧱 Bulkhead
Aísla recursos (thread pools separados por dependencia) para que las fallas en uno no drenen capacidad usada por otros.

### 🚦 Rate Limiter
Limita requests sobre una ventana de tiempo. Token bucket / leaky bucket. Frecuentemente per-IP / per-user.

### 🪂 Fallback
Response default cuando una dependencia falla — valor cacheado, default sensato, feature recortado.

## Transacciones distribuidas / data

### 🔄 Saga
Coordina workflows multi-servicio vía transacciones locales + compensaciones.
- **Coreografía** — event-driven, desacoplado.
- **Orquestación** — coordinador central, más fácil de debuggear.

### 🧾 CQRS (Command Query Responsibility Segregation)
Modelos separados para read y write. Optimizá cada uno independientemente. Frecuentemente combinado con event sourcing.

### 🗂️ Event Sourcing
Almacenar estado como **log append-only de eventos**, no snapshots. Reconstruir estado replicando eventos.

### 📬 Event-Driven Architecture
Los servicios se comunican vía eventos en lugar de calls directos. Desacopla productores y consumidores.

### 📥 Idempotency
Misma operación, ejecutada N veces, mismo resultado. Crítico para retries. Se implementa vía idempotency keys, request IDs o chequeos de estado.

## Escalabilidad / performance

### 🧩 Caching
Reduce carga y latencia. L1 (in-process) + L2 (Redis) es el stack común.

### 🪓 Sharding
Splitea datos entre DBs / nodos por key (user_id, región). Escala más allá de la capacidad de write de una sola DB.

### 📊 Load Balancing
Distribuye tráfico entre instancias. Round-robin, least-connections, consistent hashing.

### 🔄 Backpressure
Controla la tasa de input para que consumidores lentos no se sobrepasen. Bounded queues, semáforos, `request(N)` reactivo.

## Consistencia / confiabilidad

### 🧪 Leader Election
Un nodo es "leader" a la vez para tareas de coordinación. ZooKeeper, etcd, Raft.

### 🕒 Distributed Lock
Solo un proceso accede a un recurso a la vez en el cluster. Redis `SET NX` + TTL, ZooKeeper, etcd.

### 🧬 Two-Phase Commit (2PC)
Atomicidad entre servicios. Fase de prepare + fase de commit. **Daña la disponibilidad** (bloquea). Raramente usado en microservicios modernos — Saga es típicamente preferido.

## Arquitectura

### 🧩 Microservices
Servicios chicos e independientes sobre la red. Independent deployability y escalado, más todo el dolor de sistemas distribuidos.

### 🏗️ Modular Monolith
Single deployable, módulos internos. A menudo la respuesta correcta para equipos chicos/medianos. Podés romper en servicios después.

### 🔌 API Gateway
Punto de entrada único. Maneja auth, routing, rate limiting, agregación de requests (BFF).

### 🧬 Service Mesh
Sidecar proxies (Envoy vía Istio / Linkerd) manejan comms entre servicios — retries, mTLS, observabilidad — sin cambios de código.
