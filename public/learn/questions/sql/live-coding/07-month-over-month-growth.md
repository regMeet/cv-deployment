# SQL — month-over-month revenue growth

> Combines aggregation, `LAG`, and a careful NULL story.

## Schema

```
sales(sale_date, amount)
```

## Goal

Return one row per month with: total revenue, previous month revenue, and **% growth** vs the previous month.

## Solution — `LAG` over monthly aggregates

```sql
WITH monthly AS (
    SELECT DATE_TRUNC('month', sale_date) AS month,
           SUM(amount)                    AS revenue
    FROM sales
    GROUP BY DATE_TRUNC('month', sale_date)
)
SELECT month,
       revenue,
       LAG(revenue) OVER (ORDER BY month) AS prev_revenue,
       ROUND(
         100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
              / NULLIF(LAG(revenue) OVER (ORDER BY month), 0),
         2
       ) AS mom_growth_pct
FROM monthly
ORDER BY month;
```

Engine notes:

- `DATE_TRUNC('month', x)` works on Postgres / Snowflake / BigQuery (with `TIMESTAMP_TRUNC`). For MySQL: `DATE_FORMAT(sale_date, '%Y-%m-01')`.
- `NULLIF(prev, 0)` prevents division by zero — returns NULL instead of erroring.

## The NULL story — first month and missing months

- The **first month** has no previous — `LAG` returns NULL → growth is NULL. That's correct; don't fake a `0`.
- **Missing months** (e.g., no sales in Feb) silently disappear from `monthly`. If you need a continuous timeline, generate a calendar table and LEFT JOIN it.

```sql
WITH calendar AS (
    SELECT generate_series(
        DATE_TRUNC('month', MIN(sale_date)),
        DATE_TRUNC('month', MAX(sale_date)),
        INTERVAL '1 month'
    )::date AS month
    FROM sales
),
monthly AS (
    SELECT c.month,
           COALESCE(SUM(s.amount), 0) AS revenue
    FROM calendar c
    LEFT JOIN sales s
      ON DATE_TRUNC('month', s.sale_date) = c.month
    GROUP BY c.month
)
SELECT ...
```

## Variant — YoY growth

```sql
LAG(revenue, 12) OVER (ORDER BY month) AS prev_year_revenue
```

`LAG(col, n)` jumps `n` rows back — combined with monthly grain, that's year-over-year.

## What interviewers want to hear

- `LAG` for "compare to previous row".
- `NULLIF` to guard division by zero.
- First-month NULL is **correct behavior**, not a bug.
- Missing months are silent — call it out, propose calendar join if it matters.
- Month bucketing function depends on the engine — name yours.
