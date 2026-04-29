# ¿Qué pasa cuando los threads se saturan?

> Pool lleno + queue llena = degradación del sistema. Los síntomas se acumulan rápido.

## Qué se ve

- **Thread starvation** — nuevas tareas esperan un thread disponible; latencia explota.
- **Costo de context switching** — el OS gasta ciclos cambiando entre threads en vez de trabajar.
- **Queue overflow** — bounded queue llena → `RejectedExecutionException`.
- **Efectos en cascada** — un servicio downstream lento consume todos los threads del pool, bloqueando trabajo no relacionado.

## Mitigación

- **Dimensionar el pool correctamente** — CPU-bound: `~cores`. I/O-bound (platform threads): más alto, generalmente determinado por `(throughput target × latencia promedio)`. O directamente usar **virtual threads** para I/O.
- **Bulkheads** — pool separado por dependencia. Un `serviceA` lento no puede drenar el pool usado por `serviceB`.
- **Bounded queue + rejection policy sensata** (frecuentemente `CallerRunsPolicy` para backpressure natural).
- **Timeouts agresivos** — no esperar 30s si tu p99 es 500ms. Liberar threads rápido.
- **Circuit breakers** en llamadas con probabilidad de fallar. Fallar rápido en vez de mantener threads en dependencias muertas.
- **Load shedding** — descartar / despriorizar trabajo de baja prioridad cuando estás saturado.

## Frase para entrevista

> "Saturation is rarely just 'more threads'. The fix is usually capacity + isolation: bulkheads per dependency, timeouts that match SLOs, and a rejection policy that pushes back to the caller before the queue blows up."
