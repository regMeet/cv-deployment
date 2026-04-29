# Recursive CTEs (hierarchies, graphs)

> A CTE that references itself. The only way to do recursion in SQL. Used for org charts, threaded comments, paths in graphs.

## Anatomy

```sql
WITH RECURSIVE tree AS (
    -- 1. Anchor: the starting set
    SELECT id, name, manager_id, 1 AS depth
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    -- 2. Recursive: reference the CTE itself
    SELECT e.id, e.name, e.manager_id, t.depth + 1
    FROM employees e
    JOIN tree t ON e.manager_id = t.id
)
SELECT * FROM tree ORDER BY depth, name;
```

Three parts:
1. **Anchor query** — initial rows (the CEO, root nodes).
2. **`UNION ALL`** — combines anchor + recursive results.
3. **Recursive query** — joins back to the CTE, adding the next level.

The DB iterates: anchor → join → join → ... until the recursive query produces zero new rows.

## Hierarchies — full org chart

```sql
WITH RECURSIVE tree AS (
    SELECT id, name, manager_id, 0 AS depth, name AS path
    FROM employees WHERE manager_id IS NULL

    UNION ALL

    SELECT e.id, e.name, e.manager_id, t.depth + 1,
           t.path || ' > ' || e.name
    FROM employees e JOIN tree t ON e.manager_id = t.id
)
SELECT depth, path FROM tree ORDER BY path;
```

Builds a path string like `CEO > VP Eng > Dir > Manager > Alice`.

## Bottom-up — find ancestors

"Who is Alice's chain of managers?"

```sql
WITH RECURSIVE chain AS (
    SELECT id, name, manager_id, 0 AS depth
    FROM employees WHERE name = 'Alice'

    UNION ALL

    SELECT e.id, e.name, e.manager_id, c.depth + 1
    FROM employees e JOIN chain c ON c.manager_id = e.id
)
SELECT * FROM chain ORDER BY depth;
```

## Graphs — careful with cycles

If your data isn't a strict tree (an employee in two teams, a graph with cycles), you can loop forever.

Defenses:

1. **Track visited nodes** in the recursive CTE:

```sql
WITH RECURSIVE tree AS (
    SELECT id, parent_id, ARRAY[id] AS visited
    FROM nodes WHERE parent_id IS NULL

    UNION ALL

    SELECT n.id, n.parent_id, t.visited || n.id
    FROM nodes n JOIN tree t ON n.parent_id = t.id
    WHERE NOT (n.id = ANY(t.visited))   -- skip already-visited
)
SELECT * FROM tree;
```

2. **Cap the depth** with `WHERE depth < 100` as a safety net.

3. **Postgres 14+**: `CYCLE` clause does this automatically:

```sql
WITH RECURSIVE tree AS ( ... )
CYCLE id SET is_cycle USING path
```

## Generate series (no input table)

Counting from 1 to 10 with a recursive CTE:

```sql
WITH RECURSIVE n AS (
    SELECT 1 AS i
    UNION ALL
    SELECT i + 1 FROM n WHERE i < 10
)
SELECT * FROM n;
```

Postgres has the simpler `SELECT generate_series(1, 10)`. Recursive CTEs are the portable way.

## Performance notes

- Recursion can be expensive. Each iteration is a join.
- Keep anchor + recursive queries lean.
- Index `parent_id` (or whatever you join on).
- For deep / huge hierarchies, consider precomputed structures: **closure tables**, **path enumeration**, **nested sets**.

## When NOT to use recursive CTEs

- Fixed depth (e.g., always 3 levels) → multiple JOINs is simpler and faster.
- Non-graph aggregation → regular CTEs / window functions.

## Interview line

> "Recursive CTEs walk hierarchies and graphs. Anchor + UNION ALL + recursive query. For graphs you have to defend against cycles — track visited nodes, cap depth, or use the CYCLE clause in modern Postgres. For very deep or hot hierarchies I'd consider precomputed structures like closure tables instead of recursing on read."
