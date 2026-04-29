# DTO projections with Java records

> Don't load the full entity if you only need 9 of its 20 columns. Project directly into a record.

## Pattern

```java
public record AppSummary(Long id, String number, String status, Instant createdAt) {}

@Query("""
    SELECT new com.app.dto.AppSummary(a.id, a.number, a.status, a.createdAt)
    FROM Application a
    WHERE a.caseId IN :ids
    """)
List<AppSummary> findSummaries(@Param("ids") List<Long> ids);
```

## Why this is better than loading entities

- **Smaller payload** — fewer columns over the wire.
- **No managed entity** — Hibernate doesn't track it, so:
  - No accidental lazy loads when someone touches a getter.
  - No dirty checking cost.
  - No first-level cache bloat.
- **Immutable by design** — records are final + components are final.
- **Smaller heap** — `record` has minimal overhead vs entity object graphs.

## When to still use entities

- You need to **modify** the data (Hibernate-managed save).
- You really want change tracking / cascade behavior.

## Avoid the lazy fan-out

If you're building an HTTP response, projections **eliminate the surface area** for surprise N+1: there's no entity to lazy-load. This is the cleanest way to stop hidden queries.

## CV bullet

> "Used JPQL constructor projections with Java record DTOs to fetch only needed columns (9 of 20 on a hot table), cutting payload and avoiding Hibernate lazy-load fan-out."
