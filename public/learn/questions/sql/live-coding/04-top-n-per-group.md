# SQL — top 3 salaries per department

> Classic "top-N per group" — the canonical window-function live-coding question.

## Schema

```
employees(id, name, department_id, salary)
departments(id, name)
```

## Goal

Return the **top 3 highest-paid employees per department**, including ties.

## Solution 1 — `ROW_NUMBER` (no ties)

```sql
SELECT department_id, id, name, salary
FROM (
    SELECT e.*,
           ROW_NUMBER() OVER (
             PARTITION BY department_id
             ORDER BY salary DESC
           ) AS rn
    FROM employees e
) t
WHERE rn <= 3;
```

`ROW_NUMBER` assigns 1, 2, 3, ... per partition — ties get arbitrary positions. Use this when you want **at most 3 rows per department**, even if there's a tie.

## Solution 2 — `DENSE_RANK` (include ties)

```sql
SELECT department_id, id, name, salary
FROM (
    SELECT e.*,
           DENSE_RANK() OVER (
             PARTITION BY department_id
             ORDER BY salary DESC
           ) AS rnk
    FROM employees e
) t
WHERE rnk <= 3;
```

`DENSE_RANK` gives ties the same rank without skipping — so "top 3" returns **all employees** in the top 3 distinct salary tiers (could be 4+ rows if there are ties).

## Solution 3 — lateral / correlated (when no window functions)

```sql
SELECT e.*
FROM employees e
WHERE e.id IN (
    SELECT id FROM employees e2
    WHERE e2.department_id = e.department_id
    ORDER BY salary DESC
    LIMIT 3
);
```

Works on older MySQL or constrained environments. Slow at scale — window functions win.

## `ROW_NUMBER` vs `RANK` vs `DENSE_RANK`

| Function | Salaries `[100, 100, 90, 80]` |
|----------|-------------------------------|
| `ROW_NUMBER` | 1, 2, 3, 4 |
| `RANK`       | 1, 1, 3, 4 |
| `DENSE_RANK` | 1, 1, 2, 3 |

## What interviewers want to hear

- Mention **ties** — clarify the requirement before coding.
- Use `PARTITION BY` to scope ranking per group.
- Know when to pick `ROW_NUMBER` vs `DENSE_RANK`.
- Window function in a subquery + `WHERE rnk <= N` is the standard idiom.
