# Debuggear entre 10 servicios (distributed tracing)

> Sin tracing estás ciego. Con tracing clickeás un `trace-id` y ves todo el flujo.

## Lo básico

- Cada request entrante recibe (o lleva) un **trace ID**.
- Cada servicio lo propaga vía un header (`traceparent` para W3C Trace Context, o `X-Trace-Id`).
- Cada servicio emite **spans** (uno por operación lógica) etiquetados con el trace ID.
- El backend de tracing une los spans en un árbol → vista de punta a punta.

## Stack

- **OpenTelemetry** — instrumentación neutral del vendor (el default moderno).
- **Datadog APM** / **New Relic** / **Honeycomb** — backends.
- **Zipkin** / **Jaeger** — backends open-source.

## Prácticas

- Propagar el trace ID vía HTTP headers en cada call saliente.
- **MDC**-linkear el trace ID en tus logs para poder filtrar logs por trace ID.
- Spanear lo correcto: DB calls, HTTP downstream, message publish/consume, secciones internas lentas.
- No sobre-spanear — demasiados spans = alto overhead y difícil de leer.

## Fronteras async

El contexto de trace es `ThreadLocal`. Cuando cruzás a otro thread (`CompletableFuture`, executor, Kafka consumer), tenés que **propagarlo explícitamente** — mismo problema que MDC.

> Ver: [Propagación de MDC entre fronteras async](#java/performance/mdc-async)

## Frase para entrevista

> "I propagate a trace ID via OpenTelemetry on every hop and link it into MDC so logs are filterable. When something breaks, I go to the trace, see which span timed out or errored, and that tells me which service and which operation to look at — instead of grepping logs in 10 places."
