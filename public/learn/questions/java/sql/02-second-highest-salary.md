# SQL — second-highest salary

> Classic interview SQL. Be careful with **duplicate salaries**.

## Schema

```
employees(id, name, salary)
```

## Solution 1 — `LIMIT` + `OFFSET`

Works if you don't care about duplicate top salaries:

```sql
SELECT id, name, salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;
```

But if there are 3 employees tied at the top salary, this returns one of them — not the "second highest distinct" salary.

## Solution 2 — distinct salaries (the better answer)

```sql
SELECT salary
FROM (
    SELECT DISTINCT salary
    FROM employees
    ORDER BY salary DESC
    LIMIT 2
) t
ORDER BY salary
LIMIT 1;
```

This returns the **second-highest distinct salary**. With salaries `[10, 10, 9]`, this returns `9`.

## Solution 3 — anti-join (works on most DBs)

```sql
SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);
```

Concise, returns NULL if there's no second-highest (single salary in the table).

## Solution 4 — window function (cleanest on modern DBs)

```sql
SELECT id, name, salary
FROM (
    SELECT id, name, salary,
           DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM employees
) t
WHERE rnk = 2;
```

`DENSE_RANK` ties get the same rank; ranks aren't skipped — so "second" really means second distinct salary.

## What interviewers want to hear

- Mention **duplicate salaries** — most candidates miss this.
- Show you know there are multiple solutions and **trade-offs**.
- Window functions are the modern answer; anti-join is the classic.
