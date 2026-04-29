# Why Hibernate is dangerous at scale

> Hibernate is great for productivity. At high scale, the abstraction leaks and bites.

## Hidden lazy loads

Touch a getter on a lazy relation → silent extra query. In a loop → N+1.

```java
for (Order o : orders) {
    o.getCustomer().getName(); // 💥 query per order
}
```

## First-level cache (session) grows unbounded

In long sessions or batch jobs, the persistence context retains every loaded entity. Memory creeps. Use `entityManager.clear()` periodically in batch loops.

## Dirty checking has CPU cost

On flush, Hibernate compares each managed entity against its loaded snapshot to detect changes. Cheap per entity, painful with thousands.

## Leaky abstraction

If you don't understand the SQL Hibernate generates, you'll write code that looks fine in Java and ships terrible queries:

- N+1 patterns from lazy associations.
- Cartesian products from naive JOIN FETCH on siblings.
- Implicit JOINs from cascading mappings you forgot about.

## `MultipleBagFetchException`

You can't JOIN FETCH two bag-type collections at once — Hibernate refuses, because the result would be a Cartesian product (see siblings).

## Mitigations

- **DTO projections** for read paths — bypass the persistence context entirely.
- **Explicit fetch plans** — `JOIN FETCH` or `@EntityGraph`, never rely on lazy default.
- **Stateless sessions** for batch.
- **Always log SQL in dev** so you see what Hibernate emits.
- **APM in prod** — Datadog flags N+1 and slow queries.

## Interview line

> "Hibernate accelerates development but its abstraction can hide expensive queries. At scale I lean on DTO projections for reads, explicit fetch plans for writes, and APM in production to catch what slipped through."
