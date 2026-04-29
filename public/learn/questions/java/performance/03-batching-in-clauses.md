# Batching with IN-clauses (kill N+1)

> Replace N identical queries (a loop) with one query using `WHERE id IN (...)`.

## Bad — query in a loop (N+1)

```java
for (Long caseId : caseIds) {
    apps.addAll(appRepo.findByCaseId(caseId));  // 💥 N queries
}
```

## Good — one batched query

```java
List<Application> apps = appRepo.findByCaseIdIn(caseIds);
// SELECT * FROM application WHERE case_id IN (?, ?, ?, ...)
```

One round-trip, one query plan, returns all rows.

## Watch out — IN-clause limits

Some DBs cap the IN-clause size (Oracle: 1000 historically). For larger lists:

- **Chunk** the IDs (e.g., groups of 500) and run multiple batches.
- **Temp table** + JOIN if it gets really large.

## CV bullet

> "Batched DB queries via IN-clauses over collections of IDs, replacing per-row lookups."

## Distinguish from query consolidation

- **Batching:** same query repeated → one query.
- **Consolidation:** two different queries chained → one JOIN.

> See: [Query consolidation](#java/performance/query-consolidation)
