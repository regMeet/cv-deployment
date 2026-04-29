# What is backpressure?

> When a producer generates faster than a consumer can process. Without control → queue overflow, OOM, latency explosion.

## Symptoms

- Memory growth (queues piling up).
- Latencies climbing as queues get deeper.
- OOM or `RejectedExecutionException`.

## Solutions

### 1. Bounded queues

Limit how much can be queued. Combined with a sensible **rejection policy**:

- `AbortPolicy` (default) → throws `RejectedExecutionException`.
- `CallerRunsPolicy` → caller thread executes the task itself, naturally slowing the producer.
- `DiscardPolicy` / `DiscardOldestPolicy` → drop on overflow.

### 2. Semaphore-based admission

```java
Semaphore sem = new Semaphore(100); // max 100 in-flight
sem.acquire();
try { doWork(); } finally { sem.release(); }
```

### 3. Reactive-style backpressure

Reactor / RxJava push downstream-aware signals (request(N) protocol) so the producer only sends what the consumer asked for.

## Senior interview line

> "Backpressure happens when the producer outruns the consumer. I prefer bounded queues with a `CallerRunsPolicy` so the slowdown propagates naturally back to the producer, instead of letting work pile up unbounded."
