# Locks vs lock-free (CAS)

> Locks block. Lock-free uses atomic CPU instructions (compare-and-swap) and never blocks.

## Locks

- Easy to reason about.
- Risk of deadlock if multiple locks are acquired in different orders.
- Blocked threads stop — under high contention, throughput collapses.
- Tools: `synchronized`, `ReentrantLock`, `ReadWriteLock`.

## Lock-free (CAS-based)

- Built on `compareAndSet` — "if value is X, replace with Y".
- Threads never block; they **retry** until they win the race.
- Faster under high contention for simple ops (counters, flags, small structures).
- Harder to reason about; subtle to get right beyond simple cases.
- Tools: `AtomicInteger`, `AtomicReference`, `LongAdder`, `ConcurrentHashMap` internals.

## When to choose

- Simple counter / flag / single-reference state → atomic.
- Multi-step transaction across multiple fields → lock.
- High contention on a hot counter → `LongAdder` (designed for write-heavy counters).

## Code

```java
// lock-free counter
AtomicInteger counter = new AtomicInteger();
counter.incrementAndGet();

// hot counter under heavy contention
LongAdder hot = new LongAdder();
hot.increment();
long total = hot.sum();
```

## Interview line

> "Lock-free is faster under high contention but harder to reason about. I prefer atomics for simple state and locks for multi-step critical sections — kept as narrow as possible."
