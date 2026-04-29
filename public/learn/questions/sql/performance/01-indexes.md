# Indexes — strategy & gotchas

> Indexes make reads fast and writes (slightly) slower. The interesting questions are **what kind**, **what columns**, and **in what order**.

## What an index is

A separate sorted structure (usually a **B-tree**) pointing into the table. The DB can binary-search the index instead of scanning every row.

## Types

### B-tree (default)

- Best for **equality**, **range**, and **prefix matches** (`=`, `<`, `>`, `BETWEEN`, `LIKE 'foo%'`).
- The default in Postgres / MySQL / SQL Server / Oracle.
- 99% of indexes you'll create.

### Hash

- Equality only. Faster than B-tree for `=` in some engines.
- Postgres has them; rarely worth the trade-offs.

### Composite (multi-column)

```sql
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);
```

**Order matters.** This index helps:
- `WHERE user_id = ?` ✅
- `WHERE user_id = ? AND created_at > ?` ✅
- `WHERE user_id = ? ORDER BY created_at` ✅
- `WHERE created_at > ?` ❌ (no leading column)

> **Leftmost rule**: a composite index supports queries that use a **prefix** of its columns from the left.

### Covering index (INCLUDE)

```sql
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at) INCLUDE (total);
```

The index already contains `total`, so the query can be answered **without touching the table**. Hits all the way down to "index-only scan".

### Partial index

```sql
CREATE INDEX idx_active_users ON users(email) WHERE active = true;
```

Smaller, faster index. Useful when most rows don't satisfy the condition.

### Functional / expression index

```sql
CREATE INDEX idx_lower_email ON users (LOWER(email));
```

Lets you index computed values. Required to make `WHERE LOWER(email) = ?` fast.

### Specialty (Postgres)

- **GIN** — full-text, JSONB, arrays.
- **GiST** — geometric / range types.
- **BRIN** — huge tables with naturally-ordered data (timestamps).

## Costs of indexes

- **Slower writes** — every INSERT/UPDATE/DELETE updates every relevant index.
- **More disk space**.
- **More memory** to keep hot indexes in cache.
- **Optimizer planning time** — too many indexes makes the planner slower.

> Rule of thumb: don't index columns you never filter / join on.

## When indexes don't help (or hurt)

### Functions / casts on the indexed column

```sql
WHERE LOWER(email) = 'a@x';        -- 💥 plain index on email NOT used
WHERE created_at::date = '2025-01-01';  -- 💥 same
```

Either index the expression, or rewrite the query (e.g., `created_at >= '2025-01-01' AND created_at < '2025-01-02'`).

### Leading wildcard `LIKE`

```sql
WHERE email LIKE '%@gmail.com';    -- 💥 B-tree useless
```

Need full-text or a reverse-string index trick.

### Low-selectivity column (boolean, status with 2 values)

The DB may decide a full scan is cheaper. Partial indexes help here.

### `OR` across columns

```sql
WHERE a = 1 OR b = 2;
```

Sometimes the planner won't combine indexes. `UNION ALL` of two queries can be faster.

## Composite ordering — pick wisely

```
(country, city) — supports queries by country, by (country, city)
                  but NOT by city alone
```

Order columns by:
1. **Equality first**, range last.
2. Most selective first (with caveats — modern optimizers handle this OK).

## Interview line

> "B-tree composite indexes are 90% of what you need. Order matters because of the leftmost rule — equality columns first, range last. Partial indexes for skewed booleans, expression indexes for computed lookups, and covering (INCLUDE) for hot read paths to enable index-only scans. Every index also slows writes, so don't add what you don't query on."
