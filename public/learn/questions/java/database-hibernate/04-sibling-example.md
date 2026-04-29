# Sibling Cartesian — small example

> One person with 2 phones and 3 emails. Joining both at once gives **6 rows**, not 5.

## Tables

**person**

| id | name |
|---|---|
| 1 | Ana |

**phone** (child of person)

| id | person_id | number |
|---|---|---|
| 10 | 1 | 111 |
| 20 | 1 | 222 |

**email** (child of person — sibling of phone)

| id | person_id | addr |
|---|---|---|
| 100 | 1 | a@x |
| 200 | 1 | b@x |
| 300 | 1 | c@x |

## The query (joining both siblings)

```sql
SELECT p.name, ph.number, e.addr
FROM person p
  JOIN phone ph ON ph.person_id = p.id
  JOIN email e  ON e.person_id  = p.id;
```

**Result: 2 × 3 = 6 rows.**

| name | number | addr |
|---|---|---|
| Ana | 111 | a@x |
| Ana | 111 | b@x |
| Ana | 111 | c@x |
| Ana | 222 | a@x |
| Ana | 222 | b@x |
| Ana | 222 | c@x |

## Why

The DB doesn't know phones and emails are independent. It treats each row as a combination of the two — every phone × every email.

Real data: 2 phones + 3 emails = **5 things**. Query result: **6 rows**, with each phone repeated 3× and each email repeated 2×. Duplicated junk.

## Fix — split queries

```sql
SELECT * FROM phone WHERE person_id = 1;  -- 2 clean rows
SELECT * FROM email WHERE person_id = 1;  -- 3 clean rows
```

Total: 5 rows, no duplication. Cost: 1 extra round-trip (or 0 if run in parallel).

## How it scales

| Phones | Emails | 1 query (rows) | 2 queries (rows) |
|---|---|---|---|
| 10 | 10 | 100 | 20 |
| 100 | 100 | 10,000 | 200 |
| 1,000 | 1,000 | 1,000,000 | 2,000 |

That's why a multi-JOIN over siblings can blow up at scale.
