# Leer EXPLAIN / query plans

> El plan que el optimizador eligió para ejecutar tu query. Se lee bottom-up; cada nodo alimenta al de arriba.

## Correrlo

```sql
EXPLAIN SELECT ...;             -- plan estimado (sin ejecución)
EXPLAIN ANALYZE SELECT ...;     -- corre la query, muestra timings reales
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT) ...;  -- extras de Postgres
```

## Qué leer primero

- **Costo total / tiempo real** — arriba del plan.
- **Filas estimadas vs actuales** — si estimadas dice 10 y reales son 1.000.000, el optimizador está mal → mala stats → mal plan.
- **Nodo más lento** — encontrá el que tiene más tiempo, trabajá desde ahí.

## Operadores comunes (sabor Postgres — los conceptos aplican en general)

### Scans (leer datos)

- **Seq Scan** — leer cada fila. OK para tablas chicas, mal para grandes.
- **Index Scan** — leer índice, después fetchear filas matcheantes desde la tabla.
- **Index Only Scan** — responder enteramente desde el índice (covering). Lo más rápido.
- **Bitmap Heap Scan** — combina múltiples índices; bueno para `OR`s y muchas filas matcheantes.

### Joins

- **Nested Loop** — para cada fila de A, busca matcheantes en B. Excelente cuando A es chico + B está indexado. Catastrófico cuando A es grande.
- **Hash Join** — construye un hash de B en memoria, prueba con A. Excelente para sets grandes sin índices.
- **Merge Join** — ambos lados pre-ordenados, caminan en lockstep. Excelente cuando los inputs ya están ordenados (o se ordenan barato).

### Agregaciones / sorts

- **Sort** — paso de sort explícito. Costoso en data grande; si splea a disco, muy costoso.
- **HashAggregate** — group-by vía hash table.
- **GroupAggregate** — group-by sobre input pre-ordenado.

## Banderas rojas

| Señal | Problema probable |
|---|---|
| **Seq Scan** sobre tabla grande | Falta de índice o condición no-indexable (función sobre columna) |
| **Sort** mayor de lo razonable por la cantidad de filas | Podrías evitarlo con índice en mismo orden, o ORDER BY menos |
| **Estimadas 1, actuales 1M** | Stats viejas, correr `ANALYZE` |
| **Nested Loop** con millones del lado outer | El optimizer esperaba pocas; la realidad fue otra |
| **Re-checks de Lossy Bitmap Scan** | El índice no filtra del todo; revisar el predicado |

## Las estadísticas mandan al plan

El planner elige algoritmos de join y access paths basado en **conteos estimados**. Si las stats están viejas, los planes salen mal.

- Postgres: `ANALYZE table_name;` (o autovacuum).
- MySQL: `ANALYZE TABLE table_name;`.
- Oracle: `DBMS_STATS.GATHER_TABLE_STATS`.

## Fixes comunes cuando EXPLAIN se ve feo

1. **Agregar un índice** que matchee `WHERE` / `JOIN` / `ORDER BY`.
2. **Refactorear el predicado** para ser sargable (sin funciones sobre columnas).
3. **Actualizar estadísticas** (`ANALYZE`).
4. **Reescribir** — IN → EXISTS, JOIN+DISTINCT → semi-join, OR → UNION ALL.
5. **Hint al optimizer** (último recurso, DB-específico).

## Visualizadores

- **Postgres**: depesz.com/explain o pgMustard.
- **MySQL**: `EXPLAIN FORMAT=TREE` o MySQL Workbench.
- **SQL Server**: SSMS execution plans.

Pegar el texto del plan en un visualizador muestra árbol + porcentajes; mucho más fácil ver el nodo lento.

## Frase para entrevista

> "I run EXPLAIN ANALYZE, look for the slowest node, and check estimated vs actual rows — a big mismatch means stale stats or a query the optimizer can't reason about. Seq Scans on big tables, unexpected Sorts, and Nested Loops over millions are red flags. The fix is usually an index, a predicate rewrite, or refreshed statistics."
