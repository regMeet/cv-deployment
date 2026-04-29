# Window functions — `RANK` / `LAG` / running totals

> Aggregate-like functions that **don't collapse rows**. Each row keeps its own values, plus a computed value over a "window" of related rows.

## The shape

```sql
function(...) OVER (
    PARTITION BY ...     -- split rows into groups (optional)
    ORDER BY ...         -- sort within each group (often required)
    ROWS / RANGE ...     -- frame: which rows are "the window" (optional)
)
```

## Ranking — `ROW_NUMBER`, `RANK`, `DENSE_RANK`

```
salary    ROW_NUMBER  RANK  DENSE_RANK
100         1          1     1
100         2          1     1
90          3          3     2
80          4          4     3
```

- `ROW_NUMBER()` — unique sequential, ties broken arbitrarily.
- `RANK()` — ties share rank, gaps follow (1, 1, 3).
- `DENSE_RANK()` — ties share rank, no gaps (1, 1, 2).

```sql
SELECT name, salary,
       RANK() OVER (ORDER BY salary DESC) AS rnk
FROM employees;
```

## Per-group ranking — `PARTITION BY`

```sql
-- top earner per department
SELECT name, dept, salary,
       RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS dept_rnk
FROM employees;
```

`PARTITION BY` resets the ranking per group.

## `LAG` and `LEAD` — peek at neighbors

```sql
-- show change vs previous month
SELECT month, revenue,
       LAG(revenue) OVER (ORDER BY month) AS prev_revenue,
       revenue - LAG(revenue) OVER (ORDER BY month) AS delta
FROM monthly_revenue;
```

- `LAG(col)` — value from the **previous** row in the order.
- `LEAD(col)` — value from the **next** row.
- Both accept an offset and a default: `LAG(col, 1, 0)`.

## Running totals — `SUM` as a window

```sql
SELECT order_date, total,
       SUM(total) OVER (ORDER BY order_date) AS running_total
FROM orders;
```

Per-user running total:

```sql
SUM(total) OVER (PARTITION BY user_id ORDER BY order_date)
```

## Moving averages — frame clauses

```sql
-- 7-day moving average
SELECT day, revenue,
       AVG(revenue) OVER (
           ORDER BY day
           ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
       ) AS avg_7d
FROM daily_revenue;
```

`ROWS BETWEEN ... AND ...` defines the **frame** — which rows the function sees.

## `FIRST_VALUE` / `LAST_VALUE` / `NTH_VALUE`

```sql
-- first / last order date per user, on every row
FIRST_VALUE(order_date) OVER (PARTITION BY user_id ORDER BY order_date)
LAST_VALUE(order_date)  OVER (PARTITION BY user_id ORDER BY order_date
                              ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
```

Note `LAST_VALUE` needs an explicit frame to look forward — the default frame is `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`, which makes `LAST_VALUE` return the current row.

## `NTILE` — split into N buckets

```sql
SELECT name, salary,
       NTILE(4) OVER (ORDER BY salary) AS quartile
FROM employees;
```

Quartiles, deciles, percentile bands.

## Common gotchas

- **`ORDER BY` inside `OVER` is required** for ranking, `LAG`/`LEAD`, running totals.
- **Default frame** for `ORDER BY` windows is `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` — running totals work out of the box, `LAST_VALUE` needs an explicit frame.
- **PARTITION BY ≠ GROUP BY** — windows don't collapse rows.

## Interview line

> "Window functions compute aggregates without collapsing rows. RANK/DENSE_RANK/ROW_NUMBER for ordering, LAG/LEAD to compare against neighbors, SUM/AVG with OVER for running totals or moving averages. The frame clause (ROWS BETWEEN…) controls which rows the function sees — important for moving windows and for LAST_VALUE."
