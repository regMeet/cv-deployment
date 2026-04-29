# Parallel streams — cuándo usarlos

> `parallelStream()` parece gratis, no lo es. Por default usa el **common ForkJoinPool** — compartido con todo el JVM.

## Usar cuando

- **Computación CPU-heavy** (transformaciones, matemáticas).
- **Dataset grande** (el costo por elemento le gana al overhead del framework).
- **Operaciones stateless** (sin estado mutable compartido).
- **Elementos independientes** (el orden no importa).

## Evitar cuando

- **Llamadas I/O** (DB, HTTP, archivos) — bloquea threads del ForkJoinPool, puede starvear otro trabajo paralelo del JVM.
- **Estado mutable compartido** (`ArrayList::add` desde múltiples threads → corrupción).
- **Colecciones chicas** — overhead > beneficio.
- **Importa el orden** y necesitás que sea barato.

## Tabla de decisión

| Caso | Usar |
|---|---|
| Business logic limpio | streams ✅ |
| Performance crítica | loops ⚡ |
| CPU-heavy + grande | parallelStream ⚡ |
| I/O / DB calls | ❌ nunca parallelStream |

## Trampa silenciosa

Los parallel streams usan un **pool compartido a nivel JVM**. Un usuario lento puede degradar trabajo paralelo no relacionado en otra parte del mismo JVM. Si realmente necesitás paralelismo con I/O, usá un executor dedicado (y `CompletableFuture` / virtual threads), no `parallelStream`.
