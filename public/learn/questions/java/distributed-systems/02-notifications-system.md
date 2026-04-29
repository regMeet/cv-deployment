# Design a notifications system (airline)

> Trigger: flight event (delay, gate change, cancellation). Output: SMS / email / push to affected passengers, reliably and at scale.

## High level

```
[Flight events source]
    ↓
[Producer service]  ── publishes event ──▶  [Kafka]
                                              ↓
                ┌─────────────────────────────┼─────────────────────────────┐
                ↓                             ↓                             ↓
        [Email consumer]             [SMS consumer]                [Push consumer]
                ↓                             ↓                             ↓
         [Email provider]              [SMS provider]               [APNs / FCM]
                                              │
                                  (failures →) [DLQ]
```

## Key design choices

### Async + fanout via Kafka

- Producer publishes once.
- Channel-specific consumers (email / SMS / push) subscribe and process independently.
- A slow channel can't slow the others down.

### Idempotency

- Each notification has an **idempotency key** = `(flight_id, event_id, channel, recipient)`.
- A retried event won't send duplicate notifications.

### Retries with backoff

- Transient failures (provider 5xx, timeouts) → **exponential backoff + jitter**.
- Cap retries (e.g., 5).
- Move to **DLQ (dead-letter queue)** after final failure for manual inspection.

### Rate limiting per recipient

- If 10 events fire for a flight in 1 minute, don't bombard the user with 10 SMS.
- Aggregate within a small window per recipient.

### High availability

- Multiple consumer instances per channel.
- Brokers replicated (Kafka with `min.insync.replicas`).
- Idempotent consumers tolerate redelivery.

## Observability

- Per-channel: latency, success rate, retry rate, DLQ depth.
- Per-event: trace from "event detected" to "delivery confirmed".

## Senior pivot

> "The hard part isn't sending notifications — it's not duplicating them when something fails halfway. Idempotency keys + DLQ + per-recipient rate limiting are what make it production-grade."
