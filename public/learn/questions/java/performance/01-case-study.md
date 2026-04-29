# Real case study — DB latency optimization (-12%)

> Concrete project where layered DB optimizations reduced latency on a critical endpoint. Use this as the umbrella story; the other questions in this section drill into each technique.

## Result

- **Single case:** 1.80s → 1.58s (**−12%**)
- **Batch-5:** 6.26s → 5.75s (**−8%**)
- Measured in dev1 over VPN (Oracle remote).

## CV-ready bullets

- Reduced DB round-trips by **batching per-row lookups into single IN-clause queries** AND **consolidating chained queries into JPQL JOINs**.
- **Parallelized 4 independent DB queries** via `CompletableFuture` on a dedicated **virtual-thread executor (Java 21)**. Critical path reduced from sum to max of query times.
- Used **JPQL constructor projections with Java records** to fetch only needed columns (e.g., 9 of 20 on a hot table), cutting payload and avoiding Hibernate lazy-load fan-out.
- **Split sibling `@OneToMany` collections** into separate parallel queries, eliminating a Cartesian product that forced in-memory deduplication.
- **Embedded inline ID-resolving subqueries** inside each parallel query to remove sequential dependencies, maximizing true parallelism.
- Preserved **SLF4J MDC (traceId, userId) across async boundaries** via an executor wrapper, keeping distributed-tracing continuity.
- Refactored a monolithic endpoint into **dedicated classes** (orchestration / DB access / DTO mapping), improving testability.

## The three rules of thumb that emerged

1. **Siblings JOINed = Cartesian.** Split into separate queries.
2. **Round-trip is the expensive part** (remote DB). Fewer queries > more complex queries.
3. **Virtual threads > platform threads** for I/O. Practically free, no shared-pool starvation.

## Interview pivots

If the interviewer wants more depth:

- **"Why virtual threads?"** → blocking I/O unmounts the carrier; ~free vs OS thread cost.
- **"How do you spot siblings?"** → the 5-second rule: 2+ JOINs with the same left-side column.
- **"LEFT or INNER for the fix?"** → neither. They both multiply identically. Split the queries.
- **"Why not `@Fetch(SUBSELECT)` or JOIN FETCH?"** → SUBSELECT is Hibernate-magical (less control), JOIN FETCH allows only one bag collection (`MultipleBagFetchException`).
