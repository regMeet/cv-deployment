# Propagación de MDC entre fronteras async

> El MDC de SLF4J (`traceId`, `userId`) es `ThreadLocal`. Cuando cruzás a otro thread (`CompletableFuture`, executor), se pierde — los logs en los branches async no tienen contexto de trace.

## El problema

```java
MDC.put("traceId", "abc-123");

CompletableFuture.supplyAsync(() -> {
    log.info("inside async");  // 💥 sin traceId — thread distinto, MDC vacío
    return doWork();
});
```

En Datadog / ELK, ya no podés seguir el request.

## El fix — wrappear tu executor

```java
public class MdcExecutor implements Executor {
    private final Executor delegate;
    public MdcExecutor(Executor delegate) { this.delegate = delegate; }

    @Override
    public void execute(Runnable r) {
        Map<String,String> ctx = MDC.getCopyOfContextMap();
        delegate.execute(() -> {
            Map<String,String> prev = MDC.getCopyOfContextMap();
            if (ctx != null) MDC.setContextMap(ctx); else MDC.clear();
            try { r.run(); }
            finally {
                if (prev != null) MDC.setContextMap(prev); else MDC.clear();
            }
        });
    }
}

// uso
ExecutorService vthreads = Executors.newVirtualThreadPerTaskExecutor();
Executor mdcAware = new MdcExecutor(vthreads);

supplyAsync(() -> doWork(), mdcAware);
```

El wrapper captura el MDC al momento del submit y lo restaura adentro del worker.

## Por qué importa

- **Continuidad de distributed tracing** — podés seguir un request entre fronteras de `CompletableFuture`.
- Logs **correlacionables**: filtrás por `traceId` y ves todo el flujo.

## Bullet de CV

> "Preserved SLF4J MDC context (traceId, userId) across `CompletableFuture` boundaries via an executor wrapper, keeping distributed-tracing continuity on async DB calls."
