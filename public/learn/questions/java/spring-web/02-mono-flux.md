# Mono and Flux — did you use them?

> `Mono<T>` = 0 or 1 element. `Flux<T>` = 0..N elements. Both are lazy, cold by default, and carry the reactive-streams backpressure protocol (`request(N)`).

## Where they show up in practice

- `WebClient` calls return `Mono<T>` (single response body) or `Flux<T>` (streamed/SSE responses).
- R2DBC repositories return `Mono<T>` / `Flux<T>` instead of `T` / `List<T>`.
- A `@GetMapping` handler in a WebFlux controller returns `Mono<ResponseEntity<T>>` or `Flux<T>` for streaming (e.g. SSE with `text/event-stream`).

## Honest answer for the interview

If most of your production experience is Spring MVC (as is common), be straight about it:

> "My day-to-day has been mostly Spring MVC with virtual threads for I/O scaling, but I've worked with `Mono`/`Flux` in [WebClient calls to downstream services / an R2DBC-backed side project / streaming endpoints]. I understand the reactive-streams contract — a `Mono`/`Flux` does nothing until `subscribe()` happens, and the subscriber pulls elements via `request(N)`, which is what gives you backpressure without unbounded buffering."

Don't claim deep production WebFlux experience you don't have — a follow-up question on debugging a stuck event loop (see [[blocking-event-loop]]) will expose it fast.

## Key operators worth naming from memory

```java
Mono<User> user = userRepo.findById(id)          // Mono<User>
    .switchIfEmpty(Mono.error(new NotFoundException()))
    .doOnNext(u -> log.info("found {}", u.getId()));

Flux<Order> orders = orderRepo.findByUserId(id)   // Flux<Order>
    .filter(o -> o.getStatus() == ACTIVE)
    .flatMap(o -> enrichWithShipping(o))          // async per-element, unordered
    .collectList()
    .flatMapMany(Flux::fromIterable);
```

- `map` — sync, 1:1 transform.
- `flatMap` — async, 1:N (or 1:0/1), flattens inner publishers, **no ordering guarantee**.
- `concatMap` — like flatMap but preserves order (sequential, slower).
- `zip` — combine multiple Monos/Fluxes into one, waits for all.
- `switchIfEmpty` / `defaultIfEmpty` — handle the empty case explicitly (a `Mono` can complete with nothing).
- `subscribe()` — the only thing that actually triggers execution; nothing runs before it.

## Interview line

> "`Mono` is 0-or-1, `Flux` is 0-to-N — both implement the reactive-streams `Publisher` contract, so nothing executes until something subscribes and pulls via `request(N)`. That pull-based protocol is where backpressure comes from, as opposed to a blocking call where the producer just pushes and you buffer or block."
