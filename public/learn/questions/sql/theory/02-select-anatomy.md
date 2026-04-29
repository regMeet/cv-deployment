# SELECT anatomy & clause execution order

> The clauses you **write** are NOT the order they **execute**. Knowing the logical order explains many "why doesn't this work" moments.

## Written order

```sql
SELECT   col1, col2, AVG(col3) AS avg3
FROM     orders o
JOIN     users u ON u.id = o.user_id
WHERE    o.created_at >= '2025-01-01'
GROUP BY u.country, col1, col2
HAVING   AVG(col3) > 100
ORDER BY avg3 DESC
LIMIT    10
OFFSET   0;
```

## Logical execution order

```
1. FROM        — pick tables
2. JOIN        — combine them
3. WHERE       — filter rows
4. GROUP BY    — group rows
5. HAVING      — filter groups
6. SELECT      — choose columns / compute expressions
7. DISTINCT    — drop duplicates
8. ORDER BY    — sort
9. LIMIT/OFFSET — paginate
```

## Why this matters

### You can't reference an alias in `WHERE`

```sql
SELECT id, price * 1.21 AS final_price
FROM products
WHERE final_price > 100;          -- 💥 final_price doesn't exist yet at WHERE
```

`SELECT` runs after `WHERE`. Repeat the expression in `WHERE`, or wrap in a subquery / CTE.

### You CAN reference an alias in `ORDER BY`

```sql
SELECT id, price * 1.21 AS final_price
FROM products
ORDER BY final_price DESC;        -- ✅ ORDER BY runs after SELECT
```

### `WHERE` filters rows; `HAVING` filters groups

```sql
SELECT country, COUNT(*) AS n
FROM users
WHERE active = true        -- ✅ filter rows (before grouping)
GROUP BY country
HAVING COUNT(*) > 100;     -- ✅ filter groups (after grouping)
```

You can't put `COUNT(*) > 100` in `WHERE` — aggregates don't exist there yet.

## Other clauses to know

- **`DISTINCT`** — drops duplicate rows of the projection.
- **`UNION` / `UNION ALL`** — stack two result sets (UNION dedupes, UNION ALL doesn't).
- **`OFFSET`** — skip first N rows; ⚠️ slow for large offsets.
- **`FETCH FIRST n ROWS ONLY`** — SQL standard equivalent to `LIMIT n`.

## Interview line

> "The logical order is FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT. That's why aliases work in ORDER BY but not in WHERE, and why aggregates go in HAVING, not WHERE."
