# Parallel queries with `CompletableFuture`

> 4 independent queries serially = sum of their times. In parallel = max. With virtual threads, the cost of "going parallel" is near zero.

## Pattern

```java
ExecutorService vthreads = Executors.newVirtualThreadPerTaskExecutor();

CompletableFuture<List<Event>>  events  = supplyAsync(() -> eventRepo.find(ids), vthreads);
CompletableFuture<List<Period>> periods = supplyAsync(() -> periodRepo.find(ids), vthreads);
CompletableFuture<List<Action>> actions = supplyAsync(() -> actionRepo.find(ids), vthreads);
CompletableFuture<List<Doc>>    docs    = supplyAsync(() -> docRepo.find(ids), vthreads);

CompletableFuture.allOf(events, periods, actions, docs).join();

assemble(events.join(), periods.join(), actions.join(), docs.join());
```

## Why a dedicated virtual-thread executor

- `supplyAsync(...)` **without an executor** uses the JVM-wide common ForkJoinPool. Under load it gets contested.
- Virtual threads are **cheap (~few KB)** and **unmount on blocking I/O**, freeing the carrier OS thread for other work.
- A dedicated executor isolates this workload from the rest of the JVM.

## Critical-path math

- 4 queries: 200ms + 250ms + 180ms + 220ms.
- **Serial:** 850ms.
- **Parallel:** ~250ms (the slowest).

## CV bullet

> "Parallelized N independent DB queries via `CompletableFuture` on a dedicated virtual-thread executor (Java 21). Critical path reduced from sum to max."

## Watch out

- Don't share **mutable** state across the parallel branches.
- Bound the executor or use semaphores if you can fan out a lot — the DB connection pool is finite.
- Preserve **MDC** (traceId) across the boundary — see the dedicated note.
