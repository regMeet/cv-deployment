# Locks vs lock-free (CAS)

> Locks bloquean. Lock-free usa instrucciones atómicas del CPU (compare-and-swap) y nunca bloquea.

## Locks

- Fáciles de razonar.
- Riesgo de deadlock si se adquieren múltiples locks en órdenes distintos.
- Threads bloqueados se detienen — bajo alta contención, el throughput colapsa.
- Herramientas: `synchronized`, `ReentrantLock`, `ReadWriteLock`.

## Lock-free (basado en CAS)

- Construido sobre `compareAndSet` — "si el valor es X, reemplazalo por Y".
- Los threads nunca bloquean; **reintentan** hasta ganar la carrera.
- Más rápido bajo alta contención para ops simples (counters, flags, estructuras chicas).
- Más difícil de razonar; sutil más allá de casos simples.
- Herramientas: `AtomicInteger`, `AtomicReference`, `LongAdder`, las internas de `ConcurrentHashMap`.

## Cuándo elegir

- Counter / flag / single-reference simple → atomic.
- Transacción multi-paso entre múltiples campos → lock.
- Alta contención sobre un counter caliente → `LongAdder` (diseñado para counters write-heavy).

## Código

```java
// counter lock-free
AtomicInteger counter = new AtomicInteger();
counter.incrementAndGet();

// counter caliente con contención pesada
LongAdder hot = new LongAdder();
hot.increment();
long total = hot.sum();
```

## Frase para entrevista

> "Lock-free is faster under high contention but harder to reason about. I prefer atomics for simple state and locks for multi-step critical sections — kept as narrow as possible."
