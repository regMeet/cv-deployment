# Inline ID-resolving subqueries (max parallelism)

> If 4 queries depend on a 5th ("first resolve the IDs, then use them"), the dependency forces serial execution. Push the resolver **into** each parallel query so they all start at the same time.

## Bad — sequential dependency

```java
List<Long> caseIds = caseRepo.findIdsByNumber(numbers);  // T_resolve

// only now can parallelism start
var apps    = supplyAsync(() -> appRepo.find(caseIds));
var docs    = supplyAsync(() -> docRepo.find(caseIds));
var members = supplyAsync(() -> memberRepo.find(caseIds));
var events  = supplyAsync(() -> eventRepo.find(caseIds));
```

**Critical path:** `T_resolve + max(parallel)`.

## Good — inline subquery in each parallel query

```java
// each query resolves its own IDs via a subquery
var apps = supplyAsync(() -> em.createQuery("""
    SELECT new ... FROM Application a
    WHERE a.caseId IN (SELECT c.id FROM Case c WHERE c.number IN :nums)
    """).setParameter("nums", numbers).getResultList(), vthreads);

var docs = supplyAsync(() -> em.createQuery("""
    SELECT new ... FROM Document d
    WHERE d.caseId IN (SELECT c.id FROM Case c WHERE c.number IN :nums)
    """).setParameter("nums", numbers).getResultList(), vthreads);

// ... etc.
```

**Critical path:** `max(parallel)`. The "resolve IDs" step happens **inside** each query, in parallel.

## Trade-off

- Each query is slightly more complex (carries the subquery).
- DB does the same logical work, but at the **same time**, not before/after.
- Bonus: the optimizer can sometimes inline the subquery as a JOIN.

## CV bullet

> "Embedded inline ID-resolving subqueries inside each parallel query to remove sequential dependencies, maximizing true parallelism."
