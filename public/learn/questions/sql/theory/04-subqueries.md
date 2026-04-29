# Subqueries — scalar, derived, correlated

> A query inside another query. Three flavors, each used differently.

## 1. Scalar subquery

Returns **one value**. Used in `SELECT`, `WHERE`, `SET`, etc.

```sql
SELECT u.name,
       (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) AS order_count
FROM users u;
```

Or compared in WHERE:

```sql
SELECT * FROM products
WHERE price > (SELECT AVG(price) FROM products);
```

## 2. Derived table (subquery in FROM)

Returns a **table-like result** that you treat as a virtual table.

```sql
SELECT t.country, t.avg_age
FROM (
    SELECT country, AVG(age) AS avg_age
    FROM users
    GROUP BY country
) t
WHERE t.avg_age > 30;
```

CTEs (`WITH`) are usually a cleaner alternative.

## 3. Correlated subquery

References a column from the **outer query**. Re-evaluated per outer row.

```sql
-- find users whose latest order > $1000
SELECT u.*
FROM users u
WHERE (
    SELECT MAX(total) FROM orders o WHERE o.user_id = u.id
) > 1000;
```

`o.user_id = u.id` references the outer `u`. The subquery runs once per outer row.

> Often slow — but optimizers can sometimes flatten them into joins.

## EXISTS / NOT EXISTS

Most common correlated form. Returns boolean. Often clearer than `IN` for existence checks.

```sql
SELECT u.*
FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);
```

> `SELECT 1` is convention — what you SELECT inside `EXISTS` is irrelevant.

## IN with subquery

Common, but watch the **NULL trap** with `NOT IN`:

```sql
-- ⚠️ if the subquery returns any NULL, NOT IN returns no rows
SELECT * FROM users WHERE id NOT IN (SELECT user_id FROM blocked);
```

Prefer `NOT EXISTS` to avoid the gotcha.

## ANY / ALL operators

```sql
-- equivalent to IN
... WHERE price = ANY (SELECT max_price FROM ...);

-- price greater than every value returned
... WHERE price > ALL (SELECT max_price FROM ...);
```

Rare in practice. `IN` and `EXISTS` cover most cases.

## When to use which

| Need | Use |
|---|---|
| One value in SELECT/WHERE | Scalar subquery |
| Treat result as a table | Derived table or **CTE** (cleaner) |
| Filter by per-row computation | Correlated subquery |
| Existence check | `EXISTS` / `NOT EXISTS` |
| Membership check | `IN` / `NOT IN` (careful with NULLs) |

## Interview line

> "Scalar for single-value lookups, derived/CTE for treating a query result as a table, correlated for per-row checks. For existence I prefer EXISTS — it's clearer than IN and immune to the NOT IN/NULL trap."
