# Consistencia eventual

> Sin ACID global entre servicios. Los datos convergen con el tiempo, no instantáneamente. Aceptable en muchos casos — pero hay que diseñar alrededor.

## Por qué existe

En sistemas distribuidos con múltiples bases de datos / servicios, mantener un lock global para cada escritura multi-servicio mataría la disponibilidad. El trade-off: aceptamos que "ahora mismo" servicios distintos pueden ver estados ligeramente diferentes, mientras converjan.

> Recordatorio del CAP theorem: en una partición, elegís **C**onsistencia o **A**vailability. La mayoría de los sistemas a gran escala eligen A y viven con C eventual.

## Estrategias

### Patrón Saga

Descomponer el flujo cross-servicio en commits locales con compensaciones ante fallos.

> Ver: [Patrón Saga](#java/database-hibernate/saga-pattern)

### Patrón Outbox

Escribís a tu DB **y** a una tabla outbox en la misma transacción local. Un publisher separado lee el outbox y emite eventos. Garantiza atomicidad entre la escritura a DB y la emisión de eventos.

### Change Data Capture (CDC)

Herramientas como Debezium siguen el log de la DB y publican eventos de cambios a Kafka. Los servicios se suscriben y actualizan sus vistas.

## Implicancias para usuarios

- Una lectura que sigue justo a una escritura puede no reflejarla aún.
  - "Read-your-writes" se puede arreglar ruteando esas lecturas al primary o manteniendo un cache de escrituras recientes.
- Flujos UI multi-paso deben tolerar staleness.

## Frase para entrevista

> "I treat consistency as a spectrum, not a binary. For high-availability systems I default to eventual consistency, paired with Saga / outbox / CDC and idempotent consumers, and I keep strong consistency only where it's actually required — billing, inventory at decision points."
