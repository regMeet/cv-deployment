# ¿Cómo evitás race conditions?

> Race condition = acceso concurrente sin sincronización a estado mutable compartido.

## Estrategias (en orden de preferencia)

1. **No compartir estado mutable.** Cada tarea trabaja con sus propios datos; combinás resultados al final (ej: `CompletableFuture` + `join`).
2. **Usar datos inmutables** — records, `List.copyOf`, copias defensivas.
3. **Usar colecciones concurrentes** — `ConcurrentHashMap`, `CopyOnWriteArrayList`.
4. **Usar atomics** — `AtomicInteger`, `AtomicReference` (CAS, lock-free).
5. **Usar locks** — `synchronized` o `ReentrantLock` para secciones críticas reales. Mantenelos chicos.

## Anti-patterns

- `synchronized` sobre todo el método cuando solo 2 líneas son críticas.
- Lockear sobre `this` en métodos públicos (callers pueden lockear contra vos).
- "Double-checked locking" sin `volatile` (roto en JVMs viejas).

## Frase para entrevista

> "I prefer designs that don't share state. Where shared state is unavoidable, I use the lightest tool that works: atomics → concurrent collections → narrow `synchronized` blocks → `ReentrantLock` only when I need fairness or `tryLock`."
