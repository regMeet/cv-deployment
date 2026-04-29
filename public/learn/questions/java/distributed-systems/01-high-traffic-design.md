# Design a system for 1M req/min

> ~16K req/sec. Pretty high but not crazy. The real questions are: read/write ratio, consistency requirements, and SLOs.

## Clarifying questions first

- **Read/write ratio?** (1M reads vs 1M writes are very different problems)
- **Consistency** — strict or eventual?
- **Latency SLOs** — p99 budget?
- **Geographic distribution?**
- **Data hot-spots?**

## High-level architecture

```
[Clients]
    ↓
[CDN / edge cache]   ← static + cacheable GET
    ↓
[Load balancer (ALB / nginx)]
    ↓
[App tier — N instances, autoscaled]
    ├── Redis (L2 cache, sessions, hot data)
    ├── DB primary (writes) + read replicas (reads)
    └── Kafka (async events, fanout, analytics)
        ↓
    [Background workers for non-blocking work]
```

## Layers and what they do

- **CDN** — kills the long tail of static / cacheable requests before they hit your backend.
- **Load balancer** — distributes across instances, health checks.
- **App tier** — stateless. Horizontal scale based on CPU / req-rate metrics.
- **Cache (Redis)** — hot reads, sessions. L1 (in-process Caffeine) on top for nanosecond hits.
- **DB** — primary for writes, read replicas for reads. **Sharding** by `user_id` / region if a single DB can't take the writes.
- **Async layer (Kafka / RabbitMQ)** — anything that doesn't need to block the response: emails, analytics, downstream propagation.

## Concerns to call out

- **Rate limiting** per IP / user (token bucket, Redis counter).
- **Idempotency** for writes that may be retried.
- **Circuit breakers** between services.
- **Observability** day 1 — metrics, structured logs, distributed tracing.
- **Autoscaling** on leading indicators (req-rate, queue depth) not lagging ones (CPU > 90%).

## Senior framing

> "1M req/min is mostly a problem of horizontal scale + good caching + async fanout for non-critical work. The interesting choices are usually consistency vs availability, and how you handle the write path — that's where it actually gets hard."
