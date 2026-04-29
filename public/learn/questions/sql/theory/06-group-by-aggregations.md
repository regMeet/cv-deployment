# GROUP BY & aggregations

> Reduce many rows into fewer. Aggregates collapse a set of rows into a single value per group.

## Aggregate functions

| Function | What |
|---|---|
| `COUNT(*)` | All rows |
| `COUNT(col)` | Rows where col is not NULL |
| `COUNT(DISTINCT col)` | Distinct non-NULL values |
| `SUM(col)` | Sum (ignores NULL) |
| `AVG(col)` | Average (ignores NULL) |
| `MIN(col)` / `MAX(col)` | Extremes |
| `STRING_AGG(col, ',')` / `LISTAGG` / `GROUP_CONCAT` | Concatenate strings |
| `ARRAY_AGG(col)` | Build an array (Postgres) |

## GROUP BY basics

```sql
SELECT country, COUNT(*) AS users, AVG(age) AS avg_age
FROM users
GROUP BY country;
```

> Every column in `SELECT` must be **either aggregated** or **listed in GROUP BY**.

## HAVING filters groups

```sql
SELECT country, COUNT(*) AS n
FROM users
GROUP BY country
HAVING COUNT(*) > 100;          -- filter groups
```

`WHERE` filters **rows** (before grouping). `HAVING` filters **groups** (after aggregation).

## NULL behavior

- Aggregates **ignore NULL** (except `COUNT(*)`).
- `GROUP BY` treats NULL as a group of its own — all NULLs end up together.

```sql
-- count of users with NULL email
SELECT COUNT(*) FROM users WHERE email IS NULL;
```

## DISTINCT inside aggregates

```sql
SELECT COUNT(DISTINCT country) FROM users;       -- how many unique countries
SELECT COUNT(*) FROM users;                      -- how many users total
SELECT AVG(DISTINCT score) FROM ...;             -- average of distinct values (rarely useful)
```

## ROLLUP, CUBE, GROUPING SETS

Compute multi-level aggregates in one query.

```sql
-- subtotals + grand total
SELECT country, city, COUNT(*) AS n
FROM users
GROUP BY ROLLUP (country, city);
```

Returns: per (country, city), per country, and grand total — in one pass.

```sql
-- all combinations of grouping
GROUP BY CUBE (country, city);

-- explicit sets
GROUP BY GROUPING SETS ((country, city), (country), ());
```

Useful for reports that need multiple aggregation levels.

## FILTER — conditional aggregates

Standard SQL; supported by Postgres and others.

```sql
SELECT
    COUNT(*) AS total,
    COUNT(*) FILTER (WHERE active) AS active,
    SUM(amount) FILTER (WHERE status = 'paid') AS paid_revenue
FROM users;
```

For DBs without `FILTER`, use `SUM(CASE WHEN ... THEN 1 ELSE 0 END)` etc.

## Common gotchas

### `COUNT(col)` vs `COUNT(*)`

```sql
SELECT COUNT(*), COUNT(email) FROM users;
-- 1000        950   (50 users have NULL email)
```

### Aggregate over JOIN inflates rows

A user with 10 orders → joined with orders → row appears 10 times → `SUM(price)` of the user gets multiplied. Aggregate first, then join, when this happens.

## Interview line

> "Aggregates collapse rows into one per group. WHERE filters rows; HAVING filters groups. Aggregates ignore NULLs except COUNT(*). For multi-level aggregations I use ROLLUP / CUBE / GROUPING SETS, and for conditional counts I prefer FILTER (WHERE …) over the SUM(CASE WHEN …) trick."
