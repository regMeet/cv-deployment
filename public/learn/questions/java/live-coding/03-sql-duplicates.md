# SQL — users with more than one email

> Classic GROUP BY / HAVING exercise.

## Schema

```
users(name, email)
```

## Goal

Find all users that have **more than one email**.

## Solution

```sql
SELECT name, COUNT(email) AS email_count
FROM users
GROUP BY name
HAVING COUNT(email) > 1;
```

## Why `HAVING` (not `WHERE`)

- `WHERE` filters **rows before aggregation**.
- `HAVING` filters **groups after aggregation**.

Aggregate functions like `COUNT()` only exist after the GROUP BY runs — that's why the filter goes in HAVING.

## Variant — distinct emails only

If `users` has duplicate `(name, email)` rows and you want to count distinct emails per user:

```sql
SELECT name, COUNT(DISTINCT email) AS email_count
FROM users
GROUP BY name
HAVING COUNT(DISTINCT email) > 1;
```

## Variant — return only the names

```sql
SELECT name
FROM users
GROUP BY name
HAVING COUNT(email) > 1;
```
