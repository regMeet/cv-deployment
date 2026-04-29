# JOIN types — INNER / LEFT / RIGHT / FULL / CROSS / SELF

> JOINs combine rows from two tables. The difference is **which unmatched rows you keep**.

## Setup

```
users               orders
┌────┬──────┐       ┌────┬─────────┬────────┐
│ id │ name │       │ id │ user_id │ total  │
├────┼──────┤       ├────┼─────────┼────────┤
│  1 │ Ana  │       │ 10 │       1 │   $50  │
│  2 │ Beto │       │ 20 │       1 │   $80  │
│  3 │ Cris │       │ 30 │       2 │  $200  │
└────┴──────┘       └────┴─────────┴────────┘
                       (no row for user 3, no user for hypothetical 99)
```

## INNER JOIN

Only rows that **match in both tables**. Default JOIN type.

```sql
SELECT u.name, o.total
FROM users u
INNER JOIN orders o ON o.user_id = u.id;
```

| name | total |
|---|---|
| Ana | $50 |
| Ana | $80 |
| Beto | $200 |

Cris dropped (no orders).

## LEFT JOIN (LEFT OUTER JOIN)

**All rows from left table**, with NULLs where right has no match.

```sql
SELECT u.name, o.total
FROM users u
LEFT JOIN orders o ON o.user_id = u.id;
```

| name | total |
|---|---|
| Ana | $50 |
| Ana | $80 |
| Beto | $200 |
| Cris | NULL |

> Common use: "find rows in A with no match in B" → `LEFT JOIN ... WHERE B.id IS NULL`.

## RIGHT JOIN (RIGHT OUTER JOIN)

Mirror of LEFT. **All rows from right**, NULLs where left has no match. Rare in practice — most people just swap operands and use LEFT.

## FULL OUTER JOIN

**All rows from both**, NULLs where the other side has no match.

```sql
SELECT u.name, o.total
FROM users u
FULL OUTER JOIN orders o ON o.user_id = u.id;
```

Result includes Cris (left only) AND any orphaned orders (right only).

> MySQL doesn't support FULL OUTER JOIN — you simulate it with `LEFT JOIN UNION RIGHT JOIN`.

## CROSS JOIN

**Cartesian product**. Every row of A × every row of B. Almost always not what you want.

```sql
SELECT u.name, p.product
FROM users u
CROSS JOIN products p;            -- N × M rows
```

Useful for generating combinations (e.g., calendar-day-per-user grid).

## SELF JOIN

A table joined to itself. Use case: hierarchies, "compare row to row".

```sql
-- Find pairs of users with the same email domain
SELECT a.name, b.name
FROM users a
JOIN users b ON SPLIT_PART(a.email, '@', 2) = SPLIT_PART(b.email, '@', 2)
            AND a.id < b.id;       -- avoid duplicates and self-pairs
```

## Visual mental model

```
INNER:     [ A ∩ B ]
LEFT:      [ A — A∩B remains, A-only with NULL ]
RIGHT:     [ B — same, mirrored ]
FULL:      [ A ∪ B — both with NULLs where missing ]
CROSS:     [ A × B — every combination ]
```

## Anti-join pattern

"Rows in A that have **no match** in B":

```sql
-- with LEFT JOIN
SELECT u.*
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.id IS NULL;

-- with NOT EXISTS (often clearer)
SELECT u.*
FROM users u
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);
```

## Interview line

> "INNER for matched rows, LEFT for 'all of A plus matches', FULL OUTER for both sides. RIGHT is usually rewritten as LEFT. CROSS is intentional Cartesian. The anti-join pattern (LEFT JOIN + IS NULL or NOT EXISTS) handles 'rows with no match'."
