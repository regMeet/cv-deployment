# What happens if a thread blocks in WebFlux?

> WebFlux runs on a small, fixed pool of event-loop threads (Netty, default ≈ number of CPU cores). A single blocking call on one of those threads stalls **every** request scheduled on it — not just the current one.

## Why it's so damaging

- MVC: N threads, 1 blocked thread → N-1 still serve requests. Degrades gracefully.
- WebFlux: ~core-count threads, each multiplexing many requests. Block **one** event-loop thread (JDBC call, `Thread.sleep`, a blocking `HttpURLConnection`, synchronous file I/O) → every request pinned to that loop **queues behind it**. Latency spikes, then timeouts cascade, then the whole instance looks unhealthy even though CPU usage is low.
- It's silent: no exception, no obvious log line — just a thread dump showing an event-loop thread (`reactor-http-nio-N`) stuck in a blocking call while p99 latency climbs.

## How to detect it

- **BlockHound** — instruments the JVM in tests/dev to throw when blocking calls happen on a Reactor/Netty thread. The standard way to catch this before prod.
- Thread dump under load: look for `reactor-http-nio-*` threads in `BLOCKED`/`WAITING` on a JDBC driver, a `synchronized` block, or blocking I/O.
- Metrics: event-loop queue latency / scheduler metrics via Micrometer; a healthy WebFlux app has near-zero scheduling delay.

## How to fix it

1. **Use non-blocking drivers everywhere in the chain**: R2DBC instead of JDBC, reactive Redis/Mongo clients, `WebClient` instead of `RestTemplate`.
2. **If a blocking call is unavoidable** (legacy library, blocking SDK), move it off the event loop explicitly:

```java
Mono<Result> result = Mono.fromCallable(() -> legacyBlockingCall())
    .subscribeOn(Schedulers.boundedElastic()); // dedicated pool for blocking work
```

3. Never call `.block()` inside a reactive chain running on an event-loop thread — that's the most common accidental version of this bug (usually from mixing an old blocking utility into a WebFlux handler).
4. Keep CPU-heavy (non-I/O) work off the event loop too, via `publishOn(Schedulers.parallel())`, so it doesn't starve I/O multiplexing.

## Interview line

> "In WebFlux the event loop is a small fixed pool — blocking one thread doesn't just slow one request, it stalls every request scheduled on that loop. I'd catch this in CI with BlockHound, and if a blocking call is unavoidable I'd isolate it with `subscribeOn(Schedulers.boundedElastic())` rather than let it run inline on the event loop."
