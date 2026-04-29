# Set operations — UNION / INTERSECT / EXCEPT

> Stack two query results vertically. Both queries must return the **same number and types of columns**.

## UNION — combines and **dedupes**

```sql
SELECT email FROM customers
UNION
SELECT email FROM suppliers;
```

Removes duplicate rows. Implies a SORT (or hash) → has cost.

## UNION ALL — combines, keeps duplicates

```sql
SELECT email FROM customers
UNION ALL
SELECT email FROM suppliers;
```

Faster — no dedup work. Use this whenever you don't need uniqueness, or already know rows can't overlap.

> Rule of thumb: `UNION ALL` first, switch to `UNION` only if you actually need dedup.

## INTERSECT — rows in **both**

```sql
SELECT email FROM customers
INTERSECT
SELECT email FROM suppliers;
```

Like `IN` but for whole rows. Returns distinct rows by default.

## EXCEPT (or MINUS in Oracle) — rows in **A but not B**

```sql
SELECT email FROM customers
EXCEPT
SELECT email FROM suppliers;
```

Like `NOT EXISTS` but for whole rows.

> MySQL 8+ supports INTERSECT/EXCEPT; older MySQL doesn't.

## Common pitfalls

### Column count + type must match

```sql
SELECT id, name FROM users
UNION
SELECT email FROM customers;        -- 💥 different column count
```

### Implicit ORDER BY at the end

`ORDER BY` applies to the **combined** result, not just the last query:

```sql
SELECT name FROM a
UNION ALL
SELECT name FROM b
ORDER BY name;                      -- orders the whole thing
```

To order one branch only, wrap in a subquery.

### Aliases come from the **first** query

```sql
SELECT id AS user_id FROM users
UNION
SELECT id AS something FROM admins;
-- column is named user_id in the result
```

## Set ops vs JOIN — when which

- **Set ops** stack vertically (rows from A and rows from B as separate rows).
- **JOIN** combines horizontally (one row with columns from both A and B).

If you find yourself writing `SELECT * FROM (SELECT...UNION...) JOIN ...`, you might want a JOIN directly.

## Interview line

> "UNION dedupes, UNION ALL doesn't — and ALL is cheaper. INTERSECT is rows in both; EXCEPT is rows in A but not B. They're like IN/NOT EXISTS but for entire rows. Column counts and types must match across all branches."
