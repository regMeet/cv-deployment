# Spring MVC vs Spring WebFlux

> MVC = thread-per-request, bloqueante, stack Servlet (Tomcat/Jetty). WebFlux = event-loop, no bloqueante, Netty + Project Reactor.

## Spring MVC

- Stack Servlet. Cada request ocupa un thread del pool durante **todo** su ciclo de vida, incluso mientras espera I/O (DB, llamadas HTTP).
- Código imperativo — stack traces normales, fácil de debuggear con un debugger.
- Escalar bajo alta concurrencia implica agrandar el pool de threads (cada uno ~1MB de stack).
- Desde **Java 21 + Spring Boot 3.2** podés usar **virtual threads** en MVC (`spring.threads.virtual.enabled=true`). El I/O bloqueante ya no bloquea un thread del OS — el virtual thread se desmonta de su carrier. Esto cierra la mayor parte de la diferencia de throughput con WebFlux para workloads I/O-bound, sin tocar el modelo de programación.

## Spring WebFlux

- Stack reactivo sobre Netty (o Undertow), pool chico y fijo de threads event-loop (por defecto ≈ cantidad de cores).
- El modelo de programación es `Mono`/`Flux` (Project Reactor) — no bloqueante de punta a punta.
- Solo vale la pena si **toda la cadena** es no bloqueante: drivers reactivos para DB (R2DBC), Redis, Mongo, `WebClient` en vez de `RestTemplate`. Un solo llamado bloqueante en la cadena traba un thread del event-loop — ver [[blocking-event-loop]].
- Más difícil de debuggear: los stack traces quedan fragmentados a través del pipeline reactivo, la ejecución salta entre schedulers.

## Tabla de decisión

| Situación | Elegir |
|---|---|
| Equipo cómodo con código imperativo, concurrencia I/O moderada | MVC (+ virtual threads si estás en Java 21+) |
| Ya tenés un stack totalmente reactivo (R2DBC, Mongo/Redis reactivo, streaming gRPC) | WebFlux |
| Necesitás backpressure explícito entre servicios (streaming, SSE, alto fan-in) | WebFlux |
| Drivers bloqueantes legacy (JDBC sin equivalente R2DBC) | MVC — forzar WebFlux acá solo mueve los llamados bloqueantes al event loop |

## Frase para entrevista

> "Con virtual threads en Java 21, MVC bloqueante escala igual de bien para I/O sin la complejidad reactiva. Elegiría WebFlux solo si el stack ya es reactivo de punta a punta —DB, cache, llamadas downstream— o si necesito backpressure real entre servicios. Si no, MVC + virtual threads da el mismo throughput con código simple de debuggear."
