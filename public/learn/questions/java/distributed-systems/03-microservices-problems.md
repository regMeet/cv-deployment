# Real problems with microservices in production

> Microservices solve some problems and create new ones. The new ones bite at scale.

## Latency explosion

10 calls in a chain, each +50ms = +500ms. Single-call SLOs don't tell you the user-facing latency.

> Mitigations: parallelize where possible, eliminate redundant hops, edge-aggregate (BFF / GraphQL).

## Partial failures

One slow downstream can saturate the caller's threadpool. Cascading failure.

> Mitigations: aggressive timeouts, circuit breakers, bulkheads (per-dependency pools), fallbacks.

## Data consistency

Each service has its own DB. No global transactions. Updates that span services are eventually consistent.

> Mitigations: Saga pattern, outbox pattern, idempotency, compensations.

## Debugging across services

Without distributed tracing, an incident that touched 10 services is invisible. You don't know where the latency was, where the error originated, or what the request actually did.

> Mitigations: OpenTelemetry / Datadog APM, propagated `trace-id`, structured logs with the trace ID.

## Operational complexity

- More services = more things to deploy, monitor, alert, secure.
- More inter-service contracts to evolve safely.
- Harder local development (need to run / mock many services).

## Interview line

> "Microservices give you independent deployability and scaling, but you pay for it in latency, partial failures, eventual consistency, and observability complexity. Each of those needs deliberate design — circuit breakers, distributed tracing, Saga, idempotency — or it shows up as a 3am incident."
