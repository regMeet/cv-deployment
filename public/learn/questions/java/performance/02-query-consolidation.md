# Query consolidation (chained queries → JOIN)

> When a 2nd query depends on the 1st (uses its result in WHERE), fuse them with a JOIN. One round-trip instead of two.

## Bad — two sequential queries

```java
List<Long> caseIds = caseRepo.findIdsByNumber(numbers);  // query 1
List<Application> apps = appRepo.findByCaseIdIn(caseIds); // query 2 — waits for q1
```

## Good — one query with JOIN

```java
@Query("""
    SELECT new com.app.dto.AppDto(c.id, c.number, a.id, a.status)
    FROM Case c JOIN c.applications a
    WHERE c.number IN :numbers
    """)
List<AppDto> findApps(@Param("numbers") List<String> numbers);
```

## Why it matters

- **One network round-trip** instead of two. With a remote DB (e.g., over VPN), each round-trip is 50–250ms — non-trivial.
- The DB optimizer can plan one query better than two it can't see together.

## Distinguish from batching

- **Batching (IN-clause):** same query, many IDs, collapsed into one (`WHERE id IN (...)`) — replaces a loop of identical queries.
- **Consolidation (JOIN):** two **different** queries, where the 2nd depends on the 1st — fused via JOIN.

## CV bullet

> "Consolidated sequential query pairs into single JPQL JOINs to cut network round-trips."
