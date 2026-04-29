# ACID — Atomicity, Consistency, Isolation, Durability

> Set of properties that make DB transactions safe and reliable, even under errors or crashes.

## A — Atomicity

> All or nothing.

A transaction either runs fully or rolls back fully. Bank transfer: debit A + credit B; if credit B fails, debit A is undone.

## C — Consistency

> The DB always moves from one valid state to another.

Constraints (FK, NOT NULL, CHECK, business rules) are enforced. Post-commit, every rule still holds.

## I — Isolation

> Concurrent transactions don't interfere with each other.

Classic anomalies:

- **Dirty reads** — reading uncommitted data.
- **Non-repeatable reads** — same row returns different values within a transaction.
- **Phantom reads** — same query returns different row sets within a transaction.

Standard isolation levels (weakest → strongest):

1. Read Uncommitted
2. Read Committed
3. Repeatable Read
4. Serializable

> More isolation = less concurrency. Trade-off.

## D — Durability

> Once committed, data survives crashes.

Achieved with **WAL (write-ahead logs)** + persistent storage. After commit returns, the DB guarantees the change is on durable storage.

## Senior framing

> "ACID is critical in monolithic systems with one DB. In distributed systems we often relax parts of it (especially consistency or strict isolation) for scalability — moving toward eventual consistency, with patterns like Saga, idempotency, and compensation."

## Common follow-up — "Can you have ACID across microservices?"

Short answer: **not easily**. Each service has its own DB; there's no global transaction. Patterns used instead:

- **Saga** — sequence of local transactions with compensations.
- **Outbox / CDC** — DB write + event published atomically.
- **Idempotency** — to safely retry on failure.
