# Virtual threads vs platform threads (Java 21)

> Virtual threads = administrados por la JVM, ~pocos KB cada uno, millones caben en memoria. Platform threads = threads del OS, ~1MB de stack, caros.

## Platform threads (`ThreadPoolExecutor`)

- 1 thread = 1 thread del OS.
- Pesados: ~1MB de stack, scheduling del kernel.
- Pool fijo en tamaño — dimensionado a #cores para CPU-bound.
- Buenos para tareas **CPU-heavy**.

## Virtual threads (`Executors.newVirtualThreadPerTaskExecutor()`)

- 1 virtual thread = una continuation, no un thread del OS.
- Baratos (~pocos KB).
- Cuando un virtual thread **se bloquea en I/O**, se **desmonta** de su carrier (platform) thread, liberando el thread del OS para otros virtual threads.
- Diseñados para workloads **I/O-bound** — DB calls, HTTP, file I/O, gRPC.

## Regla de decisión

| Workload | Usar |
|---|---|
| CPU-bound (matemática, parsing, crypto) | Platform pool dimensionado a `Runtime.availableProcessors()` |
| I/O-bound (DB, HTTP, archivos) | Virtual threads |

## Cuidado — `synchronized` y pinning

Si un virtual thread entra en un bloque `synchronized` y se bloquea **adentro**, queda **pinned** a su carrier — el thread del OS no se puede reusar. Usá `ReentrantLock` en cambio en code paths donde podrías bloquear.

## Por qué importa

Web servers y microservicios son mayormente I/O. Virtual threads te dejan escribir **código straight-line bloqueante** (sin callback hell, sin reactive plumbing) y aún así escalar a concurrencia masiva.

## Frase para entrevista

> "I/O-heavy → virtual threads. CPU-heavy → platform pool sized to cores. I avoid `synchronized` in code that can block — `ReentrantLock` doesn't pin virtual threads."
