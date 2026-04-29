# Memory leaks in Java (with GC?)

> "Java has GC, so it can't leak memory" → wrong. GC frees objects with **no references**, not objects you no longer **need**.

## Definition

> A memory leak in Java happens when objects are no longer needed but are **still reachable** through references, preventing the GC from reclaiming them.

## The classic example

```java
List<Object> cache = new ArrayList<>();

public void process() {
    Object data = loadHugeData();
    cache.add(data);   // 💥 cache keeps growing, never evicts
}
```

For the GC: as long as `cache` references `data`, it's "live". Logically dead, technically alive.

## Common causes

- **Static collections** that grow without bound (`Map`, `List` declared `static`).
- **Caches without eviction** — no TTL, no max size.
- **Listeners / observers** registered and never unregistered.
- **`ThreadLocal` misuse** in thread pools — the worker thread is reused, the `ThreadLocal` is never cleared, the value lingers forever.
- **Classloader leaks** — common in app servers with hot-reload (Tomcat, Jetty).
- **Unclosed resources** holding references (streams, connections, callbacks).

## Interview line

> "Garbage collection doesn't prevent memory leaks. It collects objects that are no longer referenced. Memory leaks happen when objects are still referenced but no longer needed — usually caches, static collections, listeners, `ThreadLocal` misuse, or classloader leaks."
