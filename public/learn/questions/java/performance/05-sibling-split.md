# Split sibling collections into separate queries

> Joining 2+ sibling `@OneToMany` collections in one query → Cartesian product. Split them.

## What you avoid

A query that returns `events × periods × actions` rows for each parent — duplicated junk that you then have to dedupe in memory.

> See [Sibling Cartesian — small example](#java/database-hibernate/sibling-example) for the math.

## The fix

Run one query per sibling collection. With virtual threads and `CompletableFuture` they all run **in parallel**, so the cost is just `max(query_times)`.

```java
var events  = supplyAsync(() -> findEvents(parentIds), vthreads);
var periods = supplyAsync(() -> findPeriods(parentIds), vthreads);
var actions = supplyAsync(() -> findActions(parentIds), vthreads);

allOf(events, periods, actions).join();
```

## Why not `LEFT` instead of `INNER`?

It doesn't help. INNER and LEFT both produce the same Cartesian inflation when 2+ siblings are joined. The only difference is what they do when one collection is empty, not how they multiply.

## Why not `@Fetch(SUBSELECT)` or JOIN FETCH?

- **`@Fetch(SUBSELECT)`** works but is Hibernate magic — less control, opaque.
- **JOIN FETCH** allows only **one** bag-type collection per query — Hibernate throws `MultipleBagFetchException` if you try two, precisely to prevent this.

## CV bullet

> "Split sibling `@OneToMany` collections into separate queries to eliminate Cartesian product inflation."
