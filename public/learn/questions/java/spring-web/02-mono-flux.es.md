# Mono y Flux — ¿los usaste?

> `Mono<T>` = 0 o 1 elemento. `Flux<T>` = 0..N elementos. Ambos son lazy, cold por defecto, y llevan el protocolo de backpressure de reactive-streams (`request(N)`).

## Dónde aparecen en la práctica

- Las llamadas de `WebClient` devuelven `Mono<T>` (respuesta única) o `Flux<T>` (respuestas en streaming/SSE).
- Los repositorios R2DBC devuelven `Mono<T>` / `Flux<T>` en vez de `T` / `List<T>`.
- Un handler `@GetMapping` en un controller WebFlux devuelve `Mono<ResponseEntity<T>>` o `Flux<T>` para streaming (por ejemplo SSE con `text/event-stream`).

## Respuesta honesta para la entrevista

Si tu experiencia de producción es mayormente Spring MVC (lo más común), sé directo:

> "Mi día a día fue mayormente Spring MVC con virtual threads para escalar I/O, pero trabajé con `Mono`/`Flux` en [llamadas WebClient a servicios downstream / un side project con R2DBC / endpoints de streaming]. Entiendo el contrato de reactive-streams — un `Mono`/`Flux` no hace nada hasta que ocurre el `subscribe()`, y el subscriber pide elementos vía `request(N)`, que es lo que da backpressure sin buffering ilimitado."

No afirmes experiencia profunda en WebFlux en producción que no tenés — una repregunta sobre debuggear un event loop trabado (ver [[blocking-event-loop]]) lo va a exponer rápido.

## Operadores clave para nombrar de memoria

```java
Mono<User> user = userRepo.findById(id)          // Mono<User>
    .switchIfEmpty(Mono.error(new NotFoundException()))
    .doOnNext(u -> log.info("found {}", u.getId()));

Flux<Order> orders = orderRepo.findByUserId(id)   // Flux<Order>
    .filter(o -> o.getStatus() == ACTIVE)
    .flatMap(o -> enrichWithShipping(o))          // async por elemento, sin orden garantizado
    .collectList()
    .flatMapMany(Flux::fromIterable);
```

- `map` — sync, transforma 1:1.
- `flatMap` — async, 1:N (o 1:0/1), aplana publishers internos, **sin garantía de orden**.
- `concatMap` — como flatMap pero preserva el orden (secuencial, más lento).
- `zip` — combina varios Monos/Fluxes en uno, espera a todos.
- `switchIfEmpty` / `defaultIfEmpty` — manejan el caso vacío explícitamente (un `Mono` puede completar sin nada).
- `subscribe()` — lo único que realmente dispara la ejecución; nada corre antes.

## Frase para entrevista

> "`Mono` es 0-o-1, `Flux` es 0-a-N — ambos implementan el contrato `Publisher` de reactive-streams, así que nada se ejecuta hasta que algo hace subscribe y pide vía `request(N)`. Ese protocolo pull-based es de donde sale el backpressure, a diferencia de un llamado bloqueante donde el productor solo empuja y vos bufferizás o bloqueás."
