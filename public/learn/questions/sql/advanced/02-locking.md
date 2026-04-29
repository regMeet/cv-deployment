# Locking — pessimistic vs optimistic

> Two strategies to coordinate concurrent writes to the same row. Pessimistic uses DB locks; optimistic uses a version check.

## Pessimistic — `SELECT ... FOR UPDATE`

Lock the row for the duration of the transaction. Other transactions trying to write to it **wait**.

```sql
BEGIN;

SELECT balance
FROM accounts
WHERE id = 1
FOR UPDATE;          -- 🔒 row locked until COMMIT/ROLLBACK

-- safe to read + decide + update
UPDATE accounts SET balance = balance - 100 WHERE id = 1;

COMMIT;
```

Other writers calling `FOR UPDATE` on the same row **block** until you commit.

### Variants

- `FOR UPDATE` — exclusive lock; blocks all writers.
- `FOR SHARE` — shared lock; readers OK, writers blocked.
- `FOR UPDATE NOWAIT` — fail immediately if can't lock.
- `FOR UPDATE SKIP LOCKED` — skip rows others have locked. Killer feature for **work queues**.

### Work queue pattern with `SKIP LOCKED`

```sql
SELECT id FROM jobs
WHERE status = 'pending'
ORDER BY created_at
LIMIT 1
FOR UPDATE SKIP LOCKED;

-- this row is yours; others get the next unlocked job
```

Multiple workers can poll the same table without stepping on each other.

## Optimistic — version column

No locks. You check **version** at update time.

```sql
-- read
SELECT id, balance, version FROM accounts WHERE id = 1;
-- (got balance=100, version=7)

-- update with version check
UPDATE accounts
SET balance = 50, version = version + 1
WHERE id = 1 AND version = 7;
```

If the row's version is no longer 7 (someone else committed in between), `UPDATE` affects 0 rows. Application detects this and **retries** (or surfaces a conflict).

> JPA / Hibernate's `@Version` annotation does exactly this.

### When to use which

| Scenario | Use |
|---|---|
| Frequent conflicts (high contention) | Pessimistic — avoids retry storms |
| Rare conflicts | Optimistic — no lock overhead |
| Read-modify-write across services | Optimistic with retry |
| Stateful workflows / wallets | Pessimistic with `FOR UPDATE` |
| Job/work queues | `FOR UPDATE SKIP LOCKED` |

## Deadlocks

When two transactions wait for each other's locks. The DB detects this and **kills one** with an error.

Classic shape:

```
Tx A: locks row 1 → wants row 2
Tx B: locks row 2 → wants row 1
                                ← deadlock
```

### How to avoid

- **Always acquire locks in the same order** across the codebase. If everyone locks `id` ascending, no deadlock.
- **Keep transactions short.** Less time holding locks = less chance to deadlock.
- **Don't lock more than you need.** `FOR UPDATE OF specific_table` (Postgres) when joining many tables.
- **On deadlock error, retry**. They're not a bug; they're the DB telling you to try again.

## Lock granularity

- **Row lock** — most common, default with `FOR UPDATE`.
- **Page lock** — some DBs (SQL Server) lock pages for efficiency; can cause unexpected blocking.
- **Table lock** — DDL or explicit `LOCK TABLE`. Big hammer.

## Isolation levels affect locking

- **Read Committed** (typical default) — minimal locking; phantom/non-repeatable reads possible.
- **Repeatable Read / Serializable** — more locking or MVCC tricks; some workloads need them.

> See ACID for the full breakdown.

## Interview line

> "Pessimistic locking with `SELECT FOR UPDATE` for high-contention or stateful operations like wallets. Optimistic via a version column for low-contention reads with retries — JPA `@Version` does this. `FOR UPDATE SKIP LOCKED` is the right tool for work queues. Avoid deadlocks by acquiring locks in a consistent order and keeping transactions short; on deadlock errors, retry."
