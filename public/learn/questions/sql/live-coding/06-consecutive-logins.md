# SQL — users with N consecutive days of logins

> "Gaps and islands" — a senior-level pattern that filters most candidates.

## Schema

```
logins(user_id, login_date)
```

`(user_id, login_date)` is unique.

## Goal

Find users who logged in for **at least 3 consecutive days**.

## The trick — `date - row_number()` is constant per island

For any user, if you sort their logins by date and number them 1, 2, 3, ..., consecutive dates have a **constant difference** between `login_date` and `row_number`. That constant is the "island id".

```
date         rn   date - rn
2026-04-01   1    2026-03-31
2026-04-02   2    2026-03-31  ← same island
2026-04-03   3    2026-03-31  ← same island
2026-04-05   4    2026-04-01  ← new island (gap)
2026-04-06   5    2026-04-01
```

## Solution

```sql
WITH numbered AS (
    SELECT user_id,
           login_date,
           ROW_NUMBER() OVER (
             PARTITION BY user_id
             ORDER BY login_date
           ) AS rn
    FROM logins
),
islands AS (
    SELECT user_id,
           login_date,
           login_date - rn * INTERVAL '1 day' AS island_id
    FROM numbered
)
SELECT user_id
FROM islands
GROUP BY user_id, island_id
HAVING COUNT(*) >= 3;
```

For MySQL / engines without interval arithmetic, replace with `DATE_SUB(login_date, INTERVAL rn DAY)`. For integer dates, just `login_date - rn`.

## Variant — return only distinct users

```sql
SELECT DISTINCT user_id
FROM islands
GROUP BY user_id, island_id
HAVING COUNT(*) >= 3;
```

## Variant — return the streak ranges

```sql
SELECT user_id,
       MIN(login_date) AS streak_start,
       MAX(login_date) AS streak_end,
       COUNT(*)        AS streak_length
FROM islands
GROUP BY user_id, island_id
HAVING COUNT(*) >= 3;
```

## Edge cases to mention

- **Duplicate logins per day** — dedupe with `SELECT DISTINCT user_id, login_date` before numbering, otherwise the row count inflates.
- **Time zones** — if `login_date` is a timestamp, cast to date in the user's TZ first.
- **What counts as "consecutive"** — calendar days? business days? Clarify.

## What interviewers want to hear

- Recognize this as **gaps and islands** by name.
- The `date - row_number()` trick (or its variants).
- Mention dedup and timezone gotchas.
- Window function + `GROUP BY` over the island id is the cleanest form.
