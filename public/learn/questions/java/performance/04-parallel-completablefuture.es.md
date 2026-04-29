# Queries paralelas con `CompletableFuture`

> 4 queries independientes en serie = suma de sus tiempos. En paralelo = max. Con virtual threads, el costo de "ir paralelo" es casi cero.

## Patrón

```java
ExecutorService vthreads = Executors.newVirtualThreadPerTaskExecutor();

CompletableFuture<List<Event>>  events  = supplyAsync(() -> eventRepo.find(ids), vthreads);
CompletableFuture<List<Period>> periods = supplyAsync(() -> periodRepo.find(ids), vthreads);
CompletableFuture<List<Action>> actions = supplyAsync(() -> actionRepo.find(ids), vthreads);
CompletableFuture<List<Doc>>    docs    = supplyAsync(() -> docRepo.find(ids), vthreads);

CompletableFuture.allOf(events, periods, actions, docs).join();

assemble(events.join(), periods.join(), actions.join(), docs.join());
```

## Por qué un executor de virtual threads dedicado

- `supplyAsync(...)` **sin executor** usa el common ForkJoinPool del JVM. Bajo carga se contesta.
- Los virtual threads son **baratos (~pocos KB)** y **se desmontan al bloquearse en I/O**, liberando el OS thread carrier para otro trabajo.
- Un executor dedicado aísla este workload del resto del JVM.

## Matemática del critical path

- 4 queries: 200ms + 250ms + 180ms + 220ms.
- **Serial:** 850ms.
- **Paralelo:** ~250ms (la más lenta).

## Bullet de CV

> "Parallelized N independent DB queries via `CompletableFuture` on a dedicated virtual-thread executor (Java 21). Critical path reduced from sum to max."

## Cuidado

- No compartir estado **mutable** entre los branches paralelos.
- Bound el executor o usar semáforos si podés fan-outear mucho — el connection pool de la DB es finito.
- Preservar **MDC** (traceId) entre la frontera — ver la nota dedicada.
