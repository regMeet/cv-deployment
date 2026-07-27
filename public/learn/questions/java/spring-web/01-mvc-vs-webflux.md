# Spring MVC vs Spring WebFlux

> MVC = thread-per-request, blocking, Servlet stack (Tomcat/Jetty). WebFlux = event-loop, non-blocking, Netty + Project Reactor.

## Spring MVC

- Servlet stack. Each request gets a thread from the pool for its **entire** lifecycle, including while waiting on I/O (DB, HTTP calls).
- Imperative code — normal stack traces, easy to debug with a debugger.
- Scaling under high concurrency means growing the thread pool (each thread ~1MB stack).
- Since **Java 21 + Spring Boot 3.2**, you can back MVC with **virtual threads** (`spring.threads.virtual.enabled=true`). Blocking I/O no longer parks an OS thread — the virtual thread unmounts from its carrier. This closes most of the throughput gap with WebFlux for I/O-bound workloads, without touching the programming model.

## Spring WebFlux

- Reactive stack on Netty (or Undertow), small fixed pool of event-loop threads (default ≈ number of cores).
- Programming model is `Mono`/`Flux` (Project Reactor) — non-blocking end to end.
- Only pays off if the **whole chain** is non-blocking: reactive drivers for DB (R2DBC), Redis, Mongo, `WebClient` instead of `RestTemplate`. One blocking call anywhere in the chain stalls an event-loop thread — see [[blocking-event-loop]].
- Harder to debug: stack traces are fragmented across the reactive pipeline, execution hops schedulers.

## Decision table

| Situation | Pick |
|---|---|
| Team comfortable with imperative code, moderate I/O concurrency | MVC (+ virtual threads if on Java 21+) |
| Already have a fully reactive stack (R2DBC, reactive Mongo/Redis, gRPC streaming) | WebFlux |
| Need explicit backpressure between services (streaming, SSE, high fan-in) | WebFlux |
| Legacy blocking drivers (JDBC without R2DBC equivalent) | MVC — forcing WebFlux here just relocates blocking calls onto the event loop |

## Interview line

> "With virtual threads on Java 21, blocking MVC scales just as well for I/O-bound work without the reactive complexity. I'd reach for WebFlux only if the stack is reactive end-to-end — DB, cache, downstream calls — or I need real backpressure between services. Otherwise MVC + virtual threads gives the same throughput with code that's simple to debug."
