# Which metrics do you always monitor?

> Distributions, not averages. User-facing signals, plus saturation indicators that warn you early.

## The four categories

### 1. Latency

- **p50 / p95 / p99** (never average alone — averages hide tail latency).
- Per endpoint, per dependency.

### 2. Errors

- 5xx rate.
- Exception rate per minute.
- Failed business transactions (orders not placed, payments not processed).

### 3. Throughput

- Requests / sec.
- Per-endpoint breakdown — saturation often hides in one route.

### 4. Saturation

- CPU, memory, GC pause time.
- **Thread pool usage** (used / max).
- **DB connection pool** usage.
- Queue depth (Kafka lag, RabbitMQ depth, internal queues).

## Frameworks

### USE — Utilization, Saturation, Errors
- For resources (CPU, memory, disks, pools).
- "Is it busy? Is it overloaded? Is it failing?"

### RED — Rate, Errors, Duration
- For request-handling services.
- "How many requests, how many errors, how long do they take?"

> USE for resources, RED for services. Use both.

## What to alert on

- **User-impacting symptoms** first: error rate, p99 latency.
- **Leading indicators**: saturation creeping up (pool > 80%, heap > 85%, queue lag rising).
- Avoid alerting on **infrastructure** (CPU > 90%) unless it predicts user impact.

## Interview line

> "I monitor latency in percentiles (p50/p95/p99), error rate, throughput, and saturation. I prefer alerts on user-facing symptoms or leading indicators, not raw infrastructure metrics — alerting on CPU > 90% wakes you up for nothing if users aren't affected."
