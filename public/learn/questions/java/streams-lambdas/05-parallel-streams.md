# Parallel streams — when to use them

> `parallelStream()` looks free, isn't. Default uses the **common ForkJoinPool** — shared with the whole JVM.

## Use when

- **CPU-heavy** computation (e.g., transformations, math).
- **Large dataset** (the per-element cost beats the framework overhead).
- **Stateless** operations (no shared mutable state).
- **Independent** elements (order doesn't matter).

## Avoid when

- **I/O calls** (DB, HTTP, files) — blocks ForkJoinPool threads, can starve other parallel work in the JVM.
- **Shared mutable state** (`ArrayList::add` from multiple threads → corruption).
- **Small collections** — overhead > benefit.
- **Order matters** and you need it cheap.

## Decision table

| Case | Use |
|---|---|
| Clean business logic | streams ✅ |
| Performance-critical | loops ⚡ |
| CPU-heavy + large | parallelStream ⚡ |
| I/O / DB calls | ❌ never parallelStream |

## Sneaky pitfall

Parallel streams use a **shared, JVM-wide pool**. One slow user can degrade unrelated parallel work elsewhere in the same JVM. If you really need parallelism with I/O, use a dedicated executor (and `CompletableFuture` / virtual threads), not `parallelStream`.
