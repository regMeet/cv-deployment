# Reading EXPLAIN / query plans

> The optimizer's plan to execute your query. Read it bottom-up; each node feeds the one above.

## Run it

```sql
EXPLAIN SELECT ...;             -- estimated plan (no execution)
EXPLAIN ANALYZE SELECT ...;     -- runs the query, shows real timings
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT) ...;  -- Postgres extras
```

## What to read first

- **Total cost / actual time** — top of the plan.
- **Rows estimated vs actual** — if estimated says 10 and actual is 1,000,000, the optimizer is wrong → bad statistics → bad plan.
- **Slowest node** — find the one with the most time, work from there.

## Common operators (Postgres flavor — concepts apply broadly)

### Scans (read data)

- **Seq Scan** — read every row. Fine for small tables, bad for big ones.
- **Index Scan** — read index, then fetch matching rows from table.
- **Index Only Scan** — answer entirely from the index (covering). Fastest.
- **Bitmap Heap Scan** — combine multiple indexes; good for `OR`s and many matching rows.

### Joins

- **Nested Loop** — for each row of A, look up matching B. Great when A is small + B is indexed. Catastrophic when A is big.
- **Hash Join** — build a hash of B in memory, probe with A. Great for big sets without indexes.
- **Merge Join** — both sides pre-sorted, walk in lockstep. Great when inputs already sorted (or sortable cheaply).

### Aggregations / sorts

- **Sort** — explicit sort step. Costly on large data; if it spills to disk, very costly.
- **HashAggregate** — group-by via hash table.
- **GroupAggregate** — group-by over pre-sorted input.

## Red flags

| Sign | Likely problem |
|---|---|
| **Seq Scan** on a big table | Missing index or unindexable condition (function on column) |
| **Sort** > the row count makes sense | Could avoid with index in same order, or ORDER BY less |
| **Estimated 1, actual 1M** | Stale stats, run `ANALYZE` |
| **Nested Loop** with millions on outer side | Optimizer expected few; reality differed |
| **Lossy Bitmap Scan re-checks** | Index doesn't fully filter; revisit predicate |

## Statistics drive the plan

The planner picks join algorithms and access paths based on **estimated row counts**. If the stats are stale, plans go wrong.

- Postgres: `ANALYZE table_name;` (or autovacuum).
- MySQL: `ANALYZE TABLE table_name;`.
- Oracle: `DBMS_STATS.GATHER_TABLE_STATS`.

## Common fixes when EXPLAIN looks bad

1. **Add an index** matching `WHERE` / `JOIN` / `ORDER BY`.
2. **Refactor the predicate** to be sargable (no functions on columns).
3. **Update statistics** (`ANALYZE`).
4. **Rewrite** — IN → EXISTS, JOIN+DISTINCT → semi-join, OR → UNION ALL.
5. **Hint the optimizer** (last resort, DB-specific).

## Visualizers

- **Postgres**: depesz.com/explain or pgMustard.
- **MySQL**: `EXPLAIN FORMAT=TREE` or MySQL Workbench.
- **SQL Server**: SSMS execution plans.

Pasting plan text into a visualizer shows tree + percentages; much easier to spot the slow node.

## Interview line

> "I run EXPLAIN ANALYZE, look for the slowest node, and check estimated vs actual rows — a big mismatch means stale stats or a query the optimizer can't reason about. Seq Scans on big tables, unexpected Sorts, and Nested Loops over millions are red flags. The fix is usually an index, a predicate rewrite, or refreshed statistics."
