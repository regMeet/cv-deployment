# Debugging across 10 services (distributed tracing)

> Without tracing, you're blind. With tracing, you click a `trace-id` and see the whole flow.

## The basics

- Every incoming request gets (or carries) a **trace ID**.
- Each service propagates it via a header (`traceparent` for W3C Trace Context, or `X-Trace-Id`).
- Each service emits **spans** (one per logical operation) tagged with the trace ID.
- The tracing backend stitches the spans into a tree → end-to-end view.

## Stack

- **OpenTelemetry** — vendor-neutral instrumentation (the modern default).
- **Datadog APM** / **New Relic** / **Honeycomb** — backends.
- **Zipkin** / **Jaeger** — open-source backends.

## Practices

- Propagate the trace ID via HTTP headers in every outbound call.
- **MDC**-link the trace ID in your logs so you can filter logs by trace ID.
- Span the right things: DB calls, downstream HTTP, message publish/consume, slow internal sections.
- Don't over-span — too many spans = high overhead and hard to read.

## Async boundaries

Trace context is `ThreadLocal`. When you cross to another thread (`CompletableFuture`, executor, Kafka consumer), you have to **propagate it explicitly** — same problem as MDC.

> See: [MDC propagation across async](#java/performance/mdc-async)

## Interview line

> "I propagate a trace ID via OpenTelemetry on every hop and link it into MDC so logs are filterable. When something breaks, I go to the trace, see which span timed out or errored, and that tells me which service and which operation to look at — instead of grepping logs in 10 places."
