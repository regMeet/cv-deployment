# Batching con IN-clauses (matar N+1)

> Reemplazar N queries idénticas (un loop) con una sola query usando `WHERE id IN (...)`.

## Mal — query en un loop (N+1)

```java
for (Long caseId : caseIds) {
    apps.addAll(appRepo.findByCaseId(caseId));  // 💥 N queries
}
```

## Bien — una query batch

```java
List<Application> apps = appRepo.findByCaseIdIn(caseIds);
// SELECT * FROM application WHERE case_id IN (?, ?, ?, ...)
```

Un round-trip, un plan de query, devuelve todas las filas.

## Cuidado — límites del IN-clause

Algunas DBs limitan el tamaño del IN-clause (Oracle: 1000 históricamente). Para listas más grandes:

- **Chunkear** los IDs (ej: grupos de 500) y correr múltiples batches.
- **Tabla temporal** + JOIN si se vuelve realmente grande.

## Bullet de CV

> "Batched DB queries via IN-clauses over collections of IDs, replacing per-row lookups."

## Distinguir de consolidación de queries

- **Batching:** misma query repetida → una query.
- **Consolidación:** dos queries distintas encadenadas → un JOIN.

> Ver: [Consolidación de queries](#java/performance/query-consolidation)
