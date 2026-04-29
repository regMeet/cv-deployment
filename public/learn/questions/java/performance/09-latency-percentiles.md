# Latency percentiles — p50/p95/p99

> Averages hide outliers. Percentiles show the actual distribution. **Optimize p95/p99**, not p50.

## What each one means

- **p50 (median)** — half your requests are faster than this.
- **p95** — 95% are faster, 5% are slower (≈ 1 in 20).
- **p99** — 99% are faster, 1% are slower (≈ 1 in 100).

## Why averages lie

Example: 99 requests at 100ms + 1 request at 10s.
- Average ≈ **200ms** (false comfort).
- p99 = **10s** (the truth).

## Tail latency

The slow 1% — your p99 — is what:

- Breaks UX (users see a hung app).
- Breaks SLAs.
- Triggers timeout cascades in upstream services.

## What to optimize first

> **p99**, then p95. Improving p50 without moving p99 means the system is still bad for some users — and the upstream timeouts still fire.

## Tooling

Datadog, Grafana, New Relic all show distributions:

- p50 → "normal" experience.
- p95 → degradation.
- p99 → critical / outlier behavior.

## Interview line

> "I use percentiles (p50, p95, p99) to understand latency distribution. Averages hide outliers, so I focus on p95/p99 to identify tail latency and optimize the cases that actually impact users."

## Staff-level pivot

> "If you improve p50 but not p99, the system still feels broken to a meaningful slice of users. Improving p99 lifts the whole experience — and reduces upstream timeout cascades."
