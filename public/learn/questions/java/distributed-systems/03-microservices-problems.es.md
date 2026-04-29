# Problemas reales con microservicios en producción

> Los microservicios resuelven algunos problemas y crean otros nuevos. Los nuevos muerden a escala.

## Latency explosion

10 calls en una cadena, cada uno +50ms = +500ms. Los SLOs de un solo call no te dicen la latencia user-facing.

> Mitigaciones: paralelizar donde se pueda, eliminar hops redundantes, agregar en el edge (BFF / GraphQL).

## Partial failures

Un downstream lento puede saturar el threadpool del caller. Falla en cascada.

> Mitigaciones: timeouts agresivos, circuit breakers, bulkheads (pools por dependencia), fallbacks.

## Consistencia de datos

Cada servicio tiene su propia DB. Sin transacciones globales. Updates que abarcan servicios son eventualmente consistentes.

> Mitigaciones: patrón Saga, patrón outbox, idempotencia, compensaciones.

## Debugging entre servicios

Sin distributed tracing, un incidente que tocó 10 servicios es invisible. No sabés dónde estuvo la latencia, dónde se originó el error, ni qué hizo realmente el request.

> Mitigaciones: OpenTelemetry / Datadog APM, propagación de `trace-id`, structured logs con el trace ID.

## Complejidad operativa

- Más servicios = más cosas que deployar, monitorear, alertar, securizar.
- Más contratos inter-servicio para evolucionar de forma segura.
- Desarrollo local más difícil (correr / mockear muchos servicios).

## Frase para entrevista

> "Microservices give you independent deployability and scaling, but you pay for it in latency, partial failures, eventual consistency, and observability complexity. Each of those needs deliberate design — circuit breakers, distributed tracing, Saga, idempotency — or it shows up as a 3am incident."
