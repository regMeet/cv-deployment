# Detecting issues before users see them

> Alert on **leading** indicators (predictive) more than **lagging** ones (already failed).

## Lagging vs leading

- **Lagging** — error rate spike, latency past SLO, failed transactions. Real-user pain already happening.
- **Leading** — saturation creeping up, queue depth growing, latency trending up. Pain about to happen.

The goal is to fix it before the lagging indicator triggers.

## Practical leading indicators

- **Latency trend** — p99 +50% over the last hour, even if still under SLO.
- **Saturation** — thread pool > 80%, DB connection pool > 80%, heap > 85% post-GC.
- **Queue depth growing** — Kafka consumer lag rising, internal queue not draining.
- **Error rate ratio** — 5xx going from 0.1% to 0.5% (still small, but a 5× change).
- **Dependency degradation** — downstream p99 doubled.

## Tools beyond alerts

### Canary deploys

Send a small slice (5%) of traffic to the new version. Compare key metrics (latency, error rate) to the control group **before full rollout**. Bad canary → automatic rollback.

### Synthetic monitoring

A bot hits critical endpoints every N seconds from outside your network. Catches issues even when no user happens to hit that path.

### SLO error budgets

If your SLO is 99.9% over 30 days, your "error budget" is 0.1% (~43 minutes). Track burn rate — if you're consuming the budget too fast, slow down on risky changes.

## Interview line

> "Lagging alerts wake you up after the user is already angry. I prefer leading indicators — saturation, latency trends, queue depth — combined with canary deploys and synthetic monitoring. The goal is to catch the problem before the SLO is breached, not after."
