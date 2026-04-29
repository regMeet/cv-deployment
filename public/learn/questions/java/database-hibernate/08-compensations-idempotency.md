# Compensations & idempotency

> Two patterns that make Sagas survive real life.

## Compensating transactions

Actions that **logically undo** earlier steps. Not a DB rollback — a new operation that reverses the effect.

Examples:
- "Payment failed" → release stock.
- "Order canceled" → refund.

### Hard cases

Some side effects can't be undone:
- Email already sent.
- Physical shipment already dispatched.
- External API confirmation already issued.

> Compensations have to be **designed up front**, not retrofitted.

## Idempotency

> Running the operation 1× or 10× produces the **same result**.

Critical because in distributed systems, retries are everywhere (network glitches, timeouts, redeliveries).

### Without idempotency

- Retry → duplicate orders / double charges.

### With idempotency

- Same request → same result, no duplication.

## How to implement

- **Idempotency keys** — caller sends a unique key with each request; server stores it and returns the prior result on repeats. Standard in payment APIs.
- **Save request IDs** in DB; check before executing.
- **Check state before acting** — "is the order already paid? skip."

## Real example — payments

If you call charge twice, you don't want to charge the customer twice. The vendor uses your `idempotency-key` to dedupe.

## Senior follow-up — "What if a compensation fails?"

- Retry with **exponential backoff + jitter**.
- **Dead-letter queue** for failures that can't be auto-resolved.
- **Monitoring + alerts**.
- **Manual intervention** runbook for the residual cases.

## TL;DR

> "In microservices we replace global ACID with **Sagas** to coordinate steps, **compensations** to revert effects, and **idempotency** to tolerate retries and network failures."
