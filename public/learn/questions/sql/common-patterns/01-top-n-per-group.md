# Top-N per group

> "Give me the 3 most recent orders per user." Classic interview, multiple solutions, big differences in performance.

## The problem

```
orders(id, user_id, total, created_at)
```

Want: top 3 orders by `created_at` per `user_id`.

## Solution 1 — window function (modern, clean)

```sql
SELECT id, user_id, total, created_at
FROM (
    SELECT *,
           ROW_NUMBER() OVER (
               PARTITION BY user_id
               ORDER BY created_at DESC
           ) AS rn
    FROM orders
) t
WHERE rn <= 3;
```

`ROW_NUMBER` numbers rows per partition (per user). Filter `rn <= 3` to keep the top 3.

> Use `RANK()` or `DENSE_RANK()` instead of `ROW_NUMBER` if you want ties handled differently.

## Solution 2 — correlated subquery (slow at scale)

```sql
SELECT *
FROM orders o1
WHERE (
    SELECT COUNT(*)
    FROM orders o2
    WHERE o2.user_id = o1.user_id
      AND o2.created_at >= o1.created_at
) <= 3;
```

Works, but runs the inner query per row. O(N²) without good indexing.

## Solution 3 — `LATERAL` join (Postgres / Oracle / SQL Server)

```sql
SELECT u.id, t.*
FROM users u,
LATERAL (
    SELECT *
    FROM orders o
    WHERE o.user_id = u.id
    ORDER BY o.created_at DESC
    LIMIT 3
) t;
```

Often the **fastest** option when there's an index on `(user_id, created_at DESC)` — for each user, the DB does a small index scan. Especially good when you have **few users + many orders each**.

> MySQL 8.0.14+ also supports `LATERAL`.

## Solution 4 — `GROUP BY` with array_agg + filter (Postgres)

```sql
SELECT user_id,
       (ARRAY_AGG(o ORDER BY created_at DESC))[1:3] AS last_three
FROM orders o
GROUP BY user_id;
```

Returns the top 3 as an array per user. Useful for shaping JSON responses.

## Decision

| Case | Use |
|---|---|
| Standard top-N | Window function (`ROW_NUMBER`) |
| Few groups, many rows per group | LATERAL with index on `(group, sort)` |
| Building a JSON response with the top-N inline | `ARRAY_AGG` + slice |
| Avoid (modern DBs) | Correlated subquery |

## Common follow-ups

### "What if you want all rows tied at rank 3?"
Use `RANK()` (ties get same rank, gaps after).

### "What if the answer must be top-1 only?"
`SELECT DISTINCT ON (user_id) ...` (Postgres) — clean, fast, very Postgres-idiomatic.

```sql
SELECT DISTINCT ON (user_id) *
FROM orders
ORDER BY user_id, created_at DESC;
```

### "What about huge datasets?"
LATERAL with a covering index `(user_id, created_at DESC) INCLUDE (...)` is usually the winner.

## Interview line

> "Window function with `ROW_NUMBER()` is the default modern answer. For high-row-count tables I'd switch to a LATERAL join with a `(user_id, created_at DESC)` index — the optimizer does small index scans per user instead of sorting everything."
