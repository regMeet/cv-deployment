# How do you avoid cascading failures?

> One slow downstream service shouldn't kill the rest of the system. Design for partial failure.

## Patterns

### Circuit breaker

After N consecutive failures, the breaker **opens**: subsequent calls fail fast for X seconds without hitting the failing dependency. Then it goes **half-open** (one trial call) before closing again.

- Stops cascading load on a sick dependency.
- Tools: **Resilience4j**, Hystrix (legacy).

### Aggressive timeouts

If your p99 to dependency X is 500ms, don't let a call wait 30s. A short timeout frees the thread and lets the caller fail fast.

> Rule: the caller's timeout should be **< the upstream caller's timeout**, so you fail before they do.

### Bulkheads

Separate threadpools per dependency. A slow `serviceA` consumes only its own pool — the pool for `serviceB` stays healthy.

- Conceptually: ship-hull compartments.
- In Java: dedicated `ExecutorService` per dependency.

### Retry with backoff and jitter

Transient failures get retried, but:

- **Exponential backoff** — don't hammer the recovering service.
- **Jitter** — don't have all clients retry at the same instant (synchronized stampede).
- **Cap retries** — give up eventually; otherwise you build a queue you can't drain.

### Fallbacks

If a dependency is down, return a **degraded** response instead of erroring:

- Cached previous value.
- Default value.
- Stripped-down feature.

### Load shedding

Under saturation, drop or deprioritize low-priority traffic instead of accepting everything and queueing forever.

## Combining them

```
[caller]
  ├── timeout (500ms)
  ├── circuit breaker (open after 5 failures)
  ├── bulkhead (thread pool of 20)
  ├── retry (3x with exp backoff + jitter)
  └── fallback (cached value)
       ↓
   [dependency]
```

## Interview line

> "Cascading failures usually come from one slow dependency saturating the caller's threads. I prevent that with timeouts that match SLOs, bulkheads to isolate dependencies, circuit breakers to fail fast on sick services, retry with jitter to avoid stampedes, and fallbacks for graceful degradation."
