# Framework for clarifying questions

> Before writing code in a live-coding interview, ask 2–4 sharp questions. It signals seniority and prevents wasted work.

## Opening lines

> "Before I start coding, a few clarifying questions:"
>
> "Let me make sure I understand the requirements..."
>
> "A few clarifying questions before I jump in..."
>
> "The answer depends on a few constraints — can I ask..."

## The high-leverage questions

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

## Why this works

- **Single vs distributed**: shows you know architecture changes everything.
- **Exact vs approximate**: shows you know the trade-offs (CMS, HLL, sampling).
- **QPS**: shows you think about scale from the first minute.
- **R/W ratio + SLO**: shows you optimize for the actual workload.

## Closing thought

Always end with: "Given those constraints, here's how I'd approach it..." — that lands you cleanly into the design.
