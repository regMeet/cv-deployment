# Counter para API calls en los últimos 5 minutos

> Ejercicio clásico de live-coding. Sliding-window counter usando buckets de tamaño fijo indexados por `now % windowSize`.

## Preguntas clarificadoras primero

- ¿Single-instance o distribuido?
- ¿Count exacto o aproximado?
- ¿QPS esperado?

> Ver: [Framework para preguntas clarificadoras](#java/live-coding/clarifying-questions)

## Solución single-instance

300 buckets (uno por segundo en 5 minutos). Cada bucket guarda un count y el timestamp que representa. Al record, hash por `now % 300`. Al read, sumar buckets cuyo timestamp está dentro de la ventana.

```java
public class ApiCallCounter {

    private static final int WINDOW = 5 * 60; // segundos

    private final int[]  buckets = new int[WINDOW];
    private final long[] times   = new long[WINDOW];

    public synchronized void record() {
        long now = System.currentTimeMillis() / 1000;
        int  idx = (int) (now % WINDOW);

        // bucket viejo → resetear para el nuevo segundo
        if (times[idx] != now) {
            times[idx]   = now;
            buckets[idx] = 0;
        }
        buckets[idx]++;
    }

    public synchronized long count() {
        long now   = System.currentTimeMillis() / 1000;
        long total = 0;

        for (int i = 0; i < WINDOW; i++) {
            if (now - times[i] < WINDOW) {
                total += buckets[i];
            }
        }
        return total;
    }
}
```

## Cómo funciona

- El tiempo avanza; las posiciones de bucket ciclan (`now % WINDOW`).
- El chequeo de stale (`times[idx] != now`) resetea el bucket cuando su slot se reusa para un nuevo segundo.
- `count()` solo incluye buckets cuyo `times[i]` está dentro de los últimos `WINDOW` segundos — descarta automáticamente lo más viejo.

## Concurrencia

`synchronized` alcanza para QPS bajo/medio. Para QPS muy alto, reemplazar con `LongAdder[]` (lock-free, write-heavy friendly) y un `volatile long[] times`.

## Versión distribuida

Counter single-instance no generaliza a múltiples pods. Opciones:

- **Redis** con `INCR` sobre una key tipo `count:<minute>`, con `EXPIRE`. Sumar las últimas 5 keys de minuto.
- **Aproximada** — Count-Min Sketch en Redis si tolerás pequeña inexactitud.
- **Streaming** — Kafka + agregación con ventana en Flink / Kafka Streams.

## Bonus follow-ups

- "¿Y si QPS es 1M?" → batchear updates localmente, flush cada N ms (write-coalescing).
- "¿Y si queremos counts por usuario?" → key por user ID; considerar TTL eviction para usuarios inactivos.
- "¿Y precisión por segundo en setup distribuido?" → Redis con `INCR` en `count:<userId>:<second>` y un TTL de `WINDOW + buffer`.
