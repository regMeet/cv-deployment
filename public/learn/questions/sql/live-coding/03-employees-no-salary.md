# SQL — employees with no salary

> Classic "missing rows" / outer join exercise.

## Schema

```
employees(id, name)
salaries(employee_id, amount)
```

## Goal

Find every employee who does **not** have a row in `salaries`.

## Solution 1 — LEFT JOIN + IS NULL

```sql
SELECT e.id, e.name
FROM employees e
LEFT JOIN salaries s ON s.employee_id = e.id
WHERE s.employee_id IS NULL;
```

The LEFT JOIN brings every employee. `WHERE s.employee_id IS NULL` keeps only those with no matching salary row.

## Solution 2 — NOT EXISTS (often the most readable)

```sql
SELECT e.id, e.name
FROM employees e
WHERE NOT EXISTS (
    SELECT 1 FROM salaries s WHERE s.employee_id = e.id
);
```

## Solution 3 — NOT IN (careful with NULLs)

```sql
SELECT e.id, e.name
FROM employees e
WHERE e.id NOT IN (SELECT s.employee_id FROM salaries s);
```

⚠️ **NOT IN is dangerous if `salaries.employee_id` can be NULL** — `NOT IN (..., NULL, ...)` returns no rows because of three-valued logic. Always wrap with `WHERE s.employee_id IS NOT NULL` or use `NOT EXISTS` instead.

## What to mention in an interview

- LEFT JOIN + IS NULL works well.
- NOT EXISTS is usually the cleanest semantically.
- NOT IN has the NULL pitfall — sign of a candidate who knows real-world SQL.
- All three should produce the same plan on a good optimizer; pick the one whose **intent** is clearest.
