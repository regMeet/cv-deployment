# ¿Qué es backpressure?

> Cuando un productor genera más rápido de lo que un consumidor procesa. Sin control → queue overflow, OOM, latencia explotando.

## Síntomas

- Crecimiento de memoria (queues acumulándose).
- Latencias subiendo a medida que las queues se profundizan.
- OOM o `RejectedExecutionException`.

## Soluciones

### 1. Bounded queues

Limitar cuánto se puede encolar. Combinado con una **rejection policy** sensata:

- `AbortPolicy` (default) → tira `RejectedExecutionException`.
- `CallerRunsPolicy` → el thread del caller ejecuta la tarea, ralentizando naturalmente al productor.
- `DiscardPolicy` / `DiscardOldestPolicy` → descartar en overflow.

### 2. Admisión basada en Semaphore

```java
Semaphore sem = new Semaphore(100); // máx 100 in-flight
sem.acquire();
try { doWork(); } finally { sem.release(); }
```

### 3. Backpressure estilo reactive

Reactor / RxJava empujan señales downstream-aware (protocolo request(N)) para que el productor solo mande lo que el consumidor pidió.

## Frase senior para entrevista

> "Backpressure happens when the producer outruns the consumer. I prefer bounded queues with a `CallerRunsPolicy` so the slowdown propagates naturally back to the producer, instead of letting work pile up unbounded."
