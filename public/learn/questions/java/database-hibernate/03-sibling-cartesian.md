# Sibling collections — Cartesian product trap

> **Rule:** never JOIN multiple sibling collections in a single query. If you need 3 collections from 1 parent, do 3 queries (parallel if possible).

## What "siblings" means

Multiple `@OneToMany` collections hanging off the **same parent**, with no direct relation between them.

```java
@Entity
class Involvement {
    @OneToMany List<InvolvementEvent>  events;   // sibling 1
    @OneToMany List<InvolvementPeriod> periods;  // sibling 2
    @OneToMany List<InvolvementAction> actions;  // sibling 3
}
```

`events`, `periods`, `actions` share `Involvement` as parent. None reference the others.

## How to detect siblings (5-second rule)

Look at each JOIN's `ON` clause. If two or more JOINs have the **same left side** (same parent column), they're siblings:

```sql
-- SIBLINGS (bad):
FROM involvement i
  LEFT JOIN event  e ON e.involvement_id = i.id   -- FK to i
  LEFT JOIN period p ON p.involvement_id = i.id   -- FK to i
  LEFT JOIN action a ON a.involvement_id = i.id   -- FK to i
```

All three point to `i.id` → guaranteed Cartesian product.

## Not siblings (chain — OK to JOIN)

```sql
FROM case c
  JOIN application a ON a.case_id = c.id   -- FK to c
  JOIN app_member  m ON m.app_id  = a.id   -- FK to a, NOT c
```

Left side changes (`c.id` → `a.id`) → it's a chain, no inflation.

## LEFT vs INNER doesn't fix it

Both multiply identically. The only difference: INNER drops rows where one side is empty; LEFT keeps the parent and nulls the missing side. Neither prevents Cartesian inflation.

## How to actually fix

1. **Separate queries** — one per collection, run in parallel.
2. **`@Fetch(FetchMode.SUBSELECT)`** — Hibernate emits a 2nd query for the collection automatically.
3. **`JOIN FETCH` only one collection per query** (Hibernate throws `MultipleBagFetchException` if you try two).
4. **`@BatchSize(size = N)`** — when Hibernate lazy-loads, it groups N loads into one IN-clause query.

## Post-hoc detection

Suspect inflation? Run:

```sql
SELECT COUNT(*), COUNT(DISTINCT parent.id) FROM ...
```

If total ≫ distinct parents → you're multiplying.

## Corollary

A parent with **one** joined collection is fine (1→N is expected). The trouble starts at **≥2 sibling collections** in the same query.
