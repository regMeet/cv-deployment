# MDC propagation across async boundaries

> SLF4J's MDC (`traceId`, `userId`) is `ThreadLocal`. When you cross to another thread (`CompletableFuture`, executor), it's lost — logs in the async branches have no trace context.

## The problem

```java
MDC.put("traceId", "abc-123");

CompletableFuture.supplyAsync(() -> {
    log.info("inside async");  // 💥 no traceId — different thread, empty MDC
    return doWork();
});
```

In Datadog / ELK, you can't follow the request anymore.

## The fix — wrap your executor

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

// usage
ExecutorService vthreads = Executors.newVirtualThreadPerTaskExecutor();
Executor mdcAware = new MdcExecutor(vthreads);

supplyAsync(() -> doWork(), mdcAware);
```

The wrapper captures MDC at submit time and restores it inside the worker.

## Why it matters

- **Distributed tracing continuity** — you can follow a request across `CompletableFuture` boundaries.
- Logs are **correlatable**: filter by `traceId` and you see the whole flow.

## CV bullet

> "Preserved SLF4J MDC context (traceId, userId) across `CompletableFuture` boundaries via an executor wrapper, keeping distributed-tracing continuity on async DB calls."
