# Counter for API calls in past 5 minutes

> Classic live-coding exercise. Sliding-window counter using fixed-size buckets indexed by `now % windowSize`.

## Clarifying questions to ask first

- Single-instance or distributed?
- Exact count or approximate?
- Expected QPS?

> See: [Framework for clarifying questions](#java/live-coding/clarifying-questions)

## Single-instance solution

300 buckets (one per second over 5 minutes). Each bucket stores a count and the timestamp it represents. On record, hash by `now % 300`. On read, sum buckets whose timestamp is within the window.

```java
public class ApiCallCounter {

    private static final int WINDOW = 5 * 60; // seconds

    private final int[]  buckets = new int[WINDOW];
    private final long[] times   = new long[WINDOW];

    public synchronized void record() {
        long now = System.currentTimeMillis() / 1000;
        int  idx = (int) (now % WINDOW);

        // bucket is stale → reset for the new second
        if (times[idx] != now) {
            times[idx]   = now;
            buckets[idx] = 0;
        }
        buckets[idx]++;
    }

    public synchronized long count() {
        long now   = System.currentTimeMillis() / 1000;
        long total = 0;

        for (int i = 0; i < WINDOW; i++) {
            if (now - times[i] < WINDOW) {
                total += buckets[i];
            }
        }
        return total;
    }
}
```

## How it works

- Time runs forward; bucket positions cycle (`now % WINDOW`).
- Stale check (`times[idx] != now`) resets the bucket when its slot is reused for a new second.
- `count()` only includes buckets whose `times[i]` is within the last `WINDOW` seconds — automatically discards anything older.

## Concurrency

`synchronized` is enough at low/medium QPS. For very high QPS, replace with `LongAdder[]` (lock-free, write-heavy friendly) and a `volatile long[] times`.

## Distributed version

Single-instance counter doesn't generalize to multiple pods. Options:

- **Redis** with `INCR` on a key like `count:<minute>`, with `EXPIRE`. Sum the last 5 minute-keys.
- **Approximate** — Count-Min Sketch in Redis if you can tolerate small inaccuracy.
- **Streaming** — Kafka + windowed aggregation in Flink / Kafka Streams.

## Bonus follow-ups

- "What if QPS is 1M?" → batch updates locally, flush every N ms (write-coalescing).
- "What if we want per-user counts?" → key by user ID; consider TTL eviction for inactive users.
- "What about second-precision in a distributed setup?" → Redis with `INCR` on `count:<userId>:<second>` and a TTL of `WINDOW + buffer`.
