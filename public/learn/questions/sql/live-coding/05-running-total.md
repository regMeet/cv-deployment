# SQL — running total (cumulative sum)

> Window function with a frame — a senior-level live-coding staple.

## Schema

```
sales(sale_date, amount)
```

## Goal

Return one row per day with the daily total **and** the cumulative total up to that day.

## Solution — window function

```sql
SELECT sale_date,
       SUM(amount) AS daily_total,
       SUM(SUM(amount)) OVER (
         ORDER BY sale_date
         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS running_total
FROM sales
GROUP BY sale_date
ORDER BY sale_date;
```

Two things going on:

- The inner `SUM(amount)` aggregates per day (group).
- The outer `SUM(...) OVER (...)` accumulates those daily sums in date order.

## Why specify the frame?

Without `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`, most engines default to `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`. Identical for unique dates, but **with duplicate dates** `RANGE` includes all rows tied at the current value, while `ROWS` is strictly row-by-row.

Always specify the frame on senior interviews — it's the detail that signals you've actually written window functions in production.

## Variant — running total per partition

```sql
SELECT customer_id,
       sale_date,
       SUM(amount) OVER (
         PARTITION BY customer_id
         ORDER BY sale_date
         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS running_total
FROM sales
ORDER BY customer_id, sale_date;
```

`PARTITION BY` resets the running total per customer.

## Variant — 7-day moving average

```sql
SELECT sale_date,
       AVG(amount) OVER (
         ORDER BY sale_date
         ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
       ) AS rolling_7d_avg
FROM sales;
```

## What interviewers want to hear

- Window functions don't collapse rows — `GROUP BY` does.
- `ROWS` vs `RANGE` matters with ties.
- `PARTITION BY` for "per customer / per group" running totals.
- Modern engines optimize this well; the old `JOIN ... ON s2.date <= s1.date` trick is `O(n²)` and a red flag.
