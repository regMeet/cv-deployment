# What happens when threads saturate?

> Pool full + queue full = system degradation. Symptoms compound fast.

## What you see

- **Thread starvation** — new tasks wait for an available thread; latency explodes.
- **Context switching cost** — OS spends cycles swapping threads instead of doing work.
- **Queue overflow** — bounded queue full → `RejectedExecutionException`.
- **Cascading effects** — one slow downstream service consumes all threads in the pool, blocking unrelated work.

## Mitigation

- **Right-size the pool** — CPU-bound: `~cores`. I/O-bound (platform threads): higher, often determined by `(target throughput × avg latency)`. Or just use **virtual threads** for I/O.
- **Bulkheads** — separate pool per dependency. A slow `serviceA` can't drain the pool used by `serviceB`.
- **Bounded queue + sensible rejection policy** (often `CallerRunsPolicy` for natural backpressure).
- **Aggressive timeouts** — don't wait 30s if your p99 is 500ms. Free up threads quickly.
- **Circuit breakers** on calls likely to fail. Fail fast instead of holding threads on dead dependencies.
- **Load shedding** — drop / queue-deprioritize low-priority work when saturated.

## Interview line

> "Saturation is rarely just 'more threads'. The fix is usually capacity + isolation: bulkheads per dependency, timeouts that match SLOs, and a rejection policy that pushes back to the caller before the queue blows up."
