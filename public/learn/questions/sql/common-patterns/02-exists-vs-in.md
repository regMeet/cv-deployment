# `EXISTS` vs `IN` vs `JOIN + DISTINCT`

> Three ways to ask "do rows in A have a match in B". They're not equivalent in semantics or performance.

## Setup

```
users         orders
              (user_id FK to users.id)
```

Goal: users who have at least one order.

## EXISTS

```sql
SELECT u.*
FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);
```

- Stops as soon as **one** match is found per outer row (semi-join).
- Doesn't multiply rows.
- Immune to NULL gotchas.

**Use this as the default.**

## IN

```sql
SELECT u.*
FROM users u
WHERE u.id IN (SELECT user_id FROM orders);
```

- Conceptually equivalent to `EXISTS` for **non-NULL** values.
- Most modern optimizers turn it into the same plan as `EXISTS`.
- ⚠️ `NOT IN` is **broken with NULL**: if the subquery returns any NULL, `NOT IN` returns no rows. Always prefer `NOT EXISTS`.

```sql
-- 💥 if any order has user_id IS NULL, this returns nothing
SELECT * FROM users WHERE id NOT IN (SELECT user_id FROM orders);

-- ✅ safe
SELECT u.* FROM users u
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);
```

## JOIN + DISTINCT

```sql
SELECT DISTINCT u.*
FROM users u
JOIN orders o ON o.user_id = u.id;
```

- Joins **inflate** rows — a user with 10 orders appears 10 times.
- The `DISTINCT` pays the cost of removing duplicates.
- Almost always slower than `EXISTS` for "any match" checks.

> When you actually want the order data, JOIN is right. When you just want to know "does it exist", `EXISTS` is right.

## Decision table

| Need | Use |
|---|---|
| "User has any order" | `EXISTS` |
| "User has no order" | `NOT EXISTS` (avoid `NOT IN`) |
| Need columns from both tables | JOIN |
| Membership in a fixed list | `IN (1,2,3)` |
| Membership in a subquery | `IN` or `EXISTS` (modern optimizers usually equal) |

## Real-world performance note

For "users with at least one order":

- **EXISTS / IN with subquery** → semi-join, stops at first match per user. Cheap.
- **JOIN + DISTINCT** → reads all matching rows, then deduplicates. Expensive at scale.

Test in `EXPLAIN`. If you see a JOIN feeding a HashAggregate over millions of rows just to dedup, switch to `EXISTS`.

## Interview line

> "I default to EXISTS for existence checks — it's a semi-join, doesn't inflate rows, and is immune to the NOT IN/NULL trap. JOIN + DISTINCT works but pays for inflation + dedup. IN is fine for fixed lists; for subqueries with possible NULLs, NOT EXISTS is the safer rewrite of NOT IN."
