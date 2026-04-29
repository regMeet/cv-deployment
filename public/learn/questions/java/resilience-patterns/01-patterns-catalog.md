# Resilience patterns catalog (one-page reference)

> Quick reference of the patterns that come up most often in senior/staff interviews.

## Core resilience

### 🔌 Circuit Breaker
Stops calls to a failing service after N failures and fails fast. Prevents cascading failures. (Resilience4j, Hystrix)

### 🔁 Retry
Retries failed requests, ideally with **exponential backoff + jitter** to avoid stampedes.

### ⏳ Timeout
Limits how long the caller waits for a response. Prevents thread exhaustion. Should match SLOs (p99 budget).

### 🧱 Bulkhead
Isolates resources (separate thread pools per dependency) so failures in one don't drain capacity used by others.

### 🚦 Rate Limiter
Caps requests over a time window. Token bucket / leaky bucket. Often per-IP / per-user.

### 🪂 Fallback
Default response when a dependency fails — cached value, sensible default, stripped feature.

## Distributed transactions / data

### 🔄 Saga
Coordinates multi-service workflows via local transactions + compensations.
- **Choreography** — event-driven, decoupled.
- **Orchestration** — central coordinator, easier to debug.

### 🧾 CQRS (Command Query Responsibility Segregation)
Separate models for read and write. Optimize each independently. Often paired with event sourcing.

### 🗂️ Event Sourcing
Store state as an **append-only log of events**, not snapshots. Reconstruct state by replaying events.

### 📬 Event-Driven Architecture
Services communicate via events instead of direct calls. Decouples producers and consumers.

### 📥 Idempotency
Same operation, executed N times, same result. Critical for retries. Implemented via idempotency keys, request IDs, or state checks.

## Scalability / performance

### 🧩 Caching
Reduces load and latency. L1 (in-process) + L2 (Redis) is the common stack.

### 🪓 Sharding
Splits data across DBs / nodes by key (user_id, region). Scales beyond single-DB write capacity.

### 📊 Load Balancing
Distributes traffic across instances. Round-robin, least-connections, consistent hashing.

### 🔄 Backpressure
Controls input rate so slow consumers don't get overwhelmed. Bounded queues, semaphores, reactive `request(N)`.

## Consistency / reliability

### 🧪 Leader Election
One node is "leader" at a time for coordination tasks. ZooKeeper, etcd, Raft.

### 🕒 Distributed Lock
Only one process accesses a resource at a time across the cluster. Redis `SET NX` + TTL, ZooKeeper, etcd.

### 🧬 Two-Phase Commit (2PC)
Atomicity across services. Prepare phase + commit phase. **Hurts availability** (blocking). Rarely used in modern microservices — Saga is usually preferred.

## Architecture

### 🧩 Microservices
Small, independent services over the network. Independent deployability and scaling, plus all the distributed-systems pain.

### 🏗️ Modular Monolith
Single deployable, internal modules. Often the right answer for small/medium teams. You can break out into services later.

### 🔌 API Gateway
Single entry point. Handles auth, routing, rate limiting, request aggregation (BFF).

### 🧬 Service Mesh
Sidecar proxies (Envoy via Istio / Linkerd) handle service-to-service comms — retries, mTLS, observability — without code changes.
