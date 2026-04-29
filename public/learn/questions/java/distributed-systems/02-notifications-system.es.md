# Diseñar un sistema de notificaciones (aerolínea)

> Trigger: evento de vuelo (delay, cambio de gate, cancelación). Output: SMS / email / push a los pasajeros afectados, confiable y a escala.

## Alto nivel

```
[Source de eventos de vuelo]
    ↓
[Servicio Producer]  ── publica evento ──▶  [Kafka]
                                              ↓
                ┌─────────────────────────────┼─────────────────────────────┐
                ↓                             ↓                             ↓
        [Email consumer]             [SMS consumer]                [Push consumer]
                ↓                             ↓                             ↓
         [Email provider]              [SMS provider]               [APNs / FCM]
                                              │
                                  (fallas →) [DLQ]
```

## Decisiones clave de diseño

### Async + fanout vía Kafka

- El producer publica una vez.
- Consumers específicos por canal (email / SMS / push) se suscriben y procesan independientemente.
- Un canal lento no puede ralentizar a los otros.

### Idempotencia

- Cada notificación tiene una **idempotency key** = `(flight_id, event_id, channel, recipient)`.
- Un evento reintentado no manda notificaciones duplicadas.

### Retries con backoff

- Fallas transitorias (5xx del provider, timeouts) → **backoff exponencial + jitter**.
- Cap de retries (ej: 5).
- Mover a **DLQ (dead-letter queue)** después de la falla final para inspección manual.

### Rate limiting por destinatario

- Si 10 eventos disparan para un vuelo en 1 minuto, no bombardees al usuario con 10 SMS.
- Agregar dentro de una pequeña ventana por destinatario.

### Alta disponibilidad

- Múltiples instancias de consumer por canal.
- Brokers replicados (Kafka con `min.insync.replicas`).
- Consumers idempotentes toleran redelivery.

## Observabilidad

- Por canal: latencia, success rate, retry rate, profundidad del DLQ.
- Por evento: trace desde "evento detectado" hasta "delivery confirmado".

## Pivot senior

> "The hard part isn't sending notifications — it's not duplicating them when something fails halfway. Idempotency keys + DLQ + per-recipient rate limiting are what make it production-grade."
