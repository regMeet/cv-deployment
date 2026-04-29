# Counter for API calls in past 5 minutes

> Classic live-coding exercise. Sliding-window counter using fixed-size buckets indexed by `now % windowSize`.

## Clarifying questions to ask first

- Single-instance or distributed?
- Exact count or approximate?
- Expected QPS?

<details>
<summary><strong>Full framework — high-leverage clarifying questions</strong></summary>

Before writing code in a live-coding interview, ask 2–4 sharp questions. It signals seniority and prevents wasted work.

**Opening lines**

> "Before I start coding, a few clarifying questions:"
>
> "Let me make sure I understand the requirements..."
>
> "A few clarifying questions before I jump in..."
>
> "The answer depends on a few constraints — can I ask..."

### 1. Single-instance or distributed?

Architecture changes everything. A counter on one pod is a `synchronized` array. Across pods → Redis with atomic ops, or a streaming aggregator.

> "Is this single-instance or distributed (multiple pods)?"

### 2. Exact or approximate?

Exact counts are expensive. Approximations (sketches, sampling) are way cheaper at scale.

> "Do we need an exact count, or is an approximation acceptable?"

If approximate is OK → mention **Count-Min Sketch**, **HyperLogLog**, sampling.

### 3. Expected scale (QPS)?

Hundreds, thousands, hundreds of thousands? Different orders of magnitude → different solutions.

> "What's the expected throughput? Hundreds, thousands, hundreds of thousands of QPS?"

### 4. Strict or eventual consistency?

If eventual is acceptable, you have many cheaper options.

> "Do we need strict consistency, or is eventual consistency acceptable?"

### 5. Read-to-write ratio (bonus, very senior)

Read-heavy → cache aggressively. Write-heavy → optimize the write path.

> "What's the read-to-write ratio?"

### 6. Latency SLO

Drives every internal choice.

> "Any latency SLO we need to hit? p99?"

**Why this works**

- **Single vs distributed**: shows you know architecture changes everything.
- **Exact vs approximate**: shows you know the trade-offs (CMS, HLL, sampling).
- **QPS**: shows you think about scale from the first minute.
- **R/W ratio + SLO**: shows you optimize for the actual workload.

**Closing thought**

Always end with: "Given those constraints, here's how I'd approach it..." — that lands you cleanly into the design.

</details>

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
