# CTEs (WITH clause)

> A **named temporary result** at the top of a query. Replaces nested subqueries; reads top-down.

## Basic CTE

```sql
WITH active_users AS (
    SELECT * FROM users WHERE active = true
)
SELECT country, COUNT(*) AS n
FROM active_users
GROUP BY country;
```

Equivalent to a derived table, but **named** and **readable**.

## Multiple CTEs

```sql
WITH
    active AS (
        SELECT * FROM users WHERE active = true
    ),
    by_country AS (
        SELECT country, COUNT(*) AS n FROM active GROUP BY country
    )
SELECT * FROM by_country WHERE n > 100;
```

Each CTE can reference the previous one. Reads like a series of variable bindings.

## When CTEs shine

- **Long, multi-step queries** — each step is its own named block, top-down.
- **Reuse a result twice** in the same query.
- **Recursive queries** — only CTEs can be recursive (see Advanced).

## When subqueries are fine

- One-off, single-use, simple — a plain subquery / derived table is shorter.

## CTE vs subquery — performance

In **older Postgres (≤11)**, CTEs were always **materialized** (a fence the optimizer couldn't see through), which sometimes made them slower than equivalent subqueries.

**Postgres 12+** inlines CTEs by default unless you say `WITH foo AS MATERIALIZED (...)`.

In MySQL 8 / SQL Server / Oracle, optimizers usually inline. So the modern answer: **use CTEs freely for readability** and only worry about materialization in pathological cases.

## INSERT/UPDATE/DELETE inside a CTE

Postgres lets you put DML inside a CTE — useful for "do X and return Y" workflows:

```sql
WITH archived AS (
    DELETE FROM logs WHERE created_at < now() - interval '30 days'
    RETURNING *
)
INSERT INTO logs_archive SELECT * FROM archived;
```

## Recursive CTEs

A CTE that references itself. Used for hierarchies (org charts, threaded comments) and graph traversal.

```sql
WITH RECURSIVE tree AS (
    SELECT id, name, manager_id, 1 AS depth
    FROM employees WHERE manager_id IS NULL
  UNION ALL
    SELECT e.id, e.name, e.manager_id, t.depth + 1
    FROM employees e JOIN tree t ON e.manager_id = t.id
)
SELECT * FROM tree;
```

> See [Recursive CTEs](#sql/advanced/recursive-ctes) for the deep dive.

## Interview line

> "CTEs name intermediate results so multi-step queries read top-down. They're cleaner than nested subqueries and they're the only way to do recursion in SQL. In modern Postgres / MySQL / SQL Server they're inlined by the optimizer, so they're free for readability."
