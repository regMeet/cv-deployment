# Saga pattern (distributed transactions)

> Replace global ACID with a sequence of local transactions + compensations.

## The problem

In microservices, each service owns its own DB. There's no `BEGIN TRANSACTION` that spans services. So how do you keep things consistent across an order flow that touches inventory, payment, and shipping?

## The Saga answer

Break the flow into independent steps. Each step:

- Commits locally.
- If a later step fails, **compensating actions** undo the earlier ones.

## Example — e-commerce checkout

1. **Reserve stock** — local commit.
2. **Process payment** — local commit.
3. **Create order** — local commit.

If **payment fails**:
- Run compensation → **release reserved stock**.

There's no automatic rollback like in a DB. You design the "undo" explicitly.

## Two flavors

### Orchestrated

A central service ("orchestrator") coordinates the steps and decides when to call compensations.

- ✅ Easy to debug — flow lives in one place.
- ❌ More coupling. Orchestrator becomes a hot spot.

### Choreographed (event-driven)

Services react to events (`OrderCreated`, `PaymentFailed`, etc.). No central coordinator.

- ✅ Decoupled. Services don't know about each other.
- ❌ Harder to follow. Implicit flow scattered across services.

## Practical rule

- Few steps → orchestrated is simpler.
- Many independent producers/consumers → choreography scales better.

## Interview line

> "Sagas trade strict ACID for availability. Each step commits locally, and we design compensations for the rollback paths. I lean orchestrated for short flows where debuggability matters, choreographed for high-volume event-driven systems."
