# Virtual threads vs platform threads (Java 21)

> Virtual threads = JVM-managed, ~few KB each, millions can fit. Platform threads = OS threads, ~1MB stack, expensive.

## Platform threads (`ThreadPoolExecutor`)

- 1 thread = 1 OS thread.
- Heavy: ~1MB stack, kernel scheduling.
- Pool fixed in size — sized to CPU cores for CPU-bound work.
- Good for **CPU-heavy** tasks.

## Virtual threads (`Executors.newVirtualThreadPerTaskExecutor()`)

- 1 virtual thread = a continuation, not an OS thread.
- Cheap (~few KB).
- When a virtual thread **blocks on I/O**, it's **unmounted** from its carrier (platform) thread, freeing the OS thread to run other virtual threads.
- Designed for **I/O-bound** workloads — DB calls, HTTP, file I/O, gRPC.

## Decision rule

| Workload | Use |
|---|---|
| CPU-bound (math, parsing, crypto) | Platform pool sized to `Runtime.availableProcessors()` |
| I/O-bound (DB, HTTP, files) | Virtual threads |

## Watch out — `synchronized` and pinning

If a virtual thread enters a `synchronized` block and blocks **inside it**, it gets **pinned** to its carrier — the OS thread can't be reused. Use `ReentrantLock` instead in code paths where you might block.

## Why this matters

Web servers and microservices are mostly I/O. Virtual threads let you write **straight-line blocking code** (no callback hell, no reactive plumbing) and still scale to massive concurrency.

## Interview line

> "I/O-heavy → virtual threads. CPU-heavy → platform pool sized to cores. I avoid `synchronized` in code that can block — `ReentrantLock` doesn't pin virtual threads."
