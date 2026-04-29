# Compensaciones e idempotencia

> Dos patrones que hacen que los Sagas sobrevivan a la realidad.

## Compensating transactions

Acciones que **deshacen lógicamente** pasos anteriores. No es un rollback de DB — es una nueva operación que revierte el efecto.

Ejemplos:
- "Pago falló" → liberar stock.
- "Orden cancelada" → reembolsar.

### Casos difíciles

Algunos efectos colaterales no se pueden deshacer:
- Email ya enviado.
- Envío físico ya despachado.
- Confirmación de API externa ya emitida.

> Las compensaciones tienen que estar **diseñadas desde el inicio**, no agregadas después.

## Idempotencia

> Ejecutar la operación 1× o 10× produce el **mismo resultado**.

Crítico porque en sistemas distribuidos, los retries están en todos lados (glitches de red, timeouts, redeliveries).

### Sin idempotencia

- Retry → órdenes duplicadas / cobros duplicados.

### Con idempotencia

- Mismo request → mismo resultado, sin duplicación.

## Cómo implementarla

- **Idempotency keys** — el caller manda una key única por request; el server la guarda y devuelve el resultado anterior si la repetís. Estándar en APIs de pagos.
- **Guardar request IDs** en DB; chequear antes de ejecutar.
- **Chequear estado antes de actuar** — "¿la orden ya está pagada? skip."

## Ejemplo real — pagos

Si llamás charge dos veces, no querés cobrar dos veces. El vendor usa tu `idempotency-key` para deduplicar.

## Follow-up senior — "¿Qué pasa si una compensación falla?"

- Retry con **backoff exponencial + jitter**.
- **Dead-letter queue** para fallas no auto-resolubles.
- **Monitoring + alertas**.
- Runbook de **intervención manual** para los casos residuales.

## TL;DR

> "In microservices we replace global ACID with **Sagas** to coordinate steps, **compensations** to revert effects, and **idempotency** to tolerate retries and network failures."
