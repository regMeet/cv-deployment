# Eventual consistency

> No global ACID across services. Data converges over time, not instantly. Acceptable for many cases — but you have to design around it.

## Why it exists

In distributed systems with multiple databases / services, holding a global lock for every multi-service write would kill availability. The trade-off: accept that "right now" different services may see slightly different states, as long as they converge.

> CAP theorem reminder: in a partition, you pick **C**onsistency or **A**vailability. Most large-scale systems pick A and live with eventual C.

## Strategies

### Saga pattern

Break the cross-service flow into local commits with compensations on failure.

> See: [Saga pattern](#java/database-hibernate/saga-pattern)

### Outbox pattern

Write to your DB **and** an outbox table in the same local transaction. A separate publisher reads the outbox and emits events. Guarantees atomicity between DB write and event emission.

### Change Data Capture (CDC)

Tools like Debezium tail the DB log and publish change events to Kafka. Services subscribe and update their views.

## Implications for users

- A read that just followed a write may not yet reflect it.
  - "Read-your-writes" can be fixed by routing those reads to the primary or by keeping a recent-write cache.
- Multi-step UI flows must tolerate staleness.

## Interview line

> "I treat consistency as a spectrum, not a binary. For high-availability systems I default to eventual consistency, paired with Saga / outbox / CDC and idempotent consumers, and I keep strong consistency only where it's actually required — billing, inventory at decision points."
