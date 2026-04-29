# Pagination at scale — `OFFSET` vs keyset

> `OFFSET 10000 LIMIT 20` looks fine. At scale, it's a performance disaster. Keyset pagination fixes it.

## Why `OFFSET` dies

```sql
SELECT * FROM orders ORDER BY created_at DESC LIMIT 20 OFFSET 10000;
```

To skip 10,000 rows, the DB has to:
1. Sort or scan to find them.
2. Discard them.
3. Return the next 20.

Cost grows with offset. Page 1 is fast; page 500 is slow; page 5000 might time out.

> Also: with concurrent inserts/deletes, OFFSET can show duplicates or skip rows between page loads.

## Keyset pagination (the fix)

Remember the **last value** from the previous page and ask for the next ones **after** it.

```sql
-- first page
SELECT id, created_at, ...
FROM orders
ORDER BY created_at DESC, id DESC
LIMIT 20;

-- next page: pass the last (created_at, id) from previous response
SELECT id, created_at, ...
FROM orders
WHERE (created_at, id) < ('2025-01-15 10:00', 99999)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

With an index on `(created_at DESC, id DESC)`, every page is **O(log n + page size)** — same speed for page 1 and page 5000.

## The tuple comparison trick

```sql
WHERE (created_at, id) < ('2025-01-15 10:00', 99999)
```

This is shorthand for "either created_at is earlier, or it's the same timestamp and id is lower." Avoids ambiguity when timestamps tie.

Some DBs don't support tuple comparison. Equivalent expanded form:

```sql
WHERE created_at < '2025-01-15 10:00'
   OR (created_at = '2025-01-15 10:00' AND id < 99999)
```

## Why include the tiebreaker (`id`)

If two rows share `created_at`, ordering on it alone is not deterministic — you might miss or duplicate rows across pages. Always end with a unique tiebreaker (`id` or `uuid`).

## Trade-offs

**Keyset**
- ✅ Fast at any depth.
- ✅ Stable under concurrent writes (relative to the cursor).
- ❌ Can't jump to "page N" — you only have prev/next.
- ❌ Cursor is the **last item's sort fields**, not a number.

**OFFSET**
- ✅ Easy "go to page 50".
- ❌ Slower as you go deeper.
- ❌ Inconsistent with concurrent changes.

## When OFFSET is OK

- Small datasets, max page < 100.
- Admin tools where slow pages are acceptable.
- One-off queries.

For user-facing feeds at scale → **keyset**.

## Cursor encoding for APIs

Send the cursor opaquely in the API:

```
GET /orders?after=eyJ0cyI6IjIwMjUtMDEtMTUiLCJpZCI6OTk5OTl9
            (base64-encoded {ts, id})
```

Clients don't need to know the schema; you can change it later.

## Real-world examples

- **Twitter/X feeds** — keyset on tweet ID.
- **Slack message history** — keyset on message ID.
- **Cursor APIs** in Stripe, GitHub — opaque cursors are keysets internally.

## Interview line

> "OFFSET pagination scales linearly with depth — page 1 is fast, page 1000 isn't. Keyset pagination uses the last row's sort key as the cursor, so every page is O(log n) with the right index. Always include a unique tiebreaker. For user-facing feeds keyset is the standard answer."
