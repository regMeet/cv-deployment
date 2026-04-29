# Streams vs loops — hot paths

> Streams improve readability and maintainability. In hot paths, traditional loops can be more efficient.

## Hot path

> Code executed **very frequently** — tight loops, real-time systems, per-request inner loops on high-QPS endpoints.

There, every micro-cost (lambda allocation, boxing, iterator overhead) adds up.

## Trade-offs

**Streams**
- ✅ Readable, declarative.
- ✅ Composable.
- ❌ Some overhead (lambda objects, autoboxing, iterator chains).

**Loops**
- ✅ Faster on hot paths.
- ✅ Better JIT optimization (bounds-check elimination, vectorization).
- ❌ More verbose.

## Common pitfalls

- **Side effects** in stream ops:
  ```java
  list.stream().forEach(other::add); // race, bad
  ```
- **Reusing a stream** — they're single-use.
- **Using `map` instead of `forEach`** when you only want side effects.
- **Overcomplicated pipelines** — extract steps to named variables.

## Senior rule

> "Use streams for clarity. Use loops for performance-critical paths."

## Interview line

> "Java Streams and lambdas introduced a functional style that improves readability and composability. They add some overhead, so they're ideal for business logic. In performance-critical hot paths, traditional loops are still preferable."
