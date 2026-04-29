# Top-N por grupo

> "Dame los 3 orders más recientes por usuario." Clásico de entrevista, múltiples soluciones, grandes diferencias en performance.

## El problema

```
orders(id, user_id, total, created_at)
```

Quiero: top 3 orders por `created_at` por `user_id`.

## Solución 1 — window function (moderna, limpia)

```sql
SELECT id, user_id, total, created_at
FROM (
    SELECT *,
           ROW_NUMBER() OVER (
               PARTITION BY user_id
               ORDER BY created_at DESC
           ) AS rn
    FROM orders
) t
WHERE rn <= 3;
```

`ROW_NUMBER` numera las filas por partición (por usuario). Filtrar `rn <= 3` para quedarse con el top 3.

> Usar `RANK()` o `DENSE_RANK()` en lugar de `ROW_NUMBER` si querés manejar empates distinto.

## Solución 2 — subquery correlacionada (lenta a escala)

```sql
SELECT *
FROM orders o1
WHERE (
    SELECT COUNT(*)
    FROM orders o2
    WHERE o2.user_id = o1.user_id
      AND o2.created_at >= o1.created_at
) <= 3;
```

Funciona, pero corre la query interna por cada fila. O(N²) sin buen indexing.

## Solución 3 — `LATERAL` join (Postgres / Oracle / SQL Server)

```sql
SELECT u.id, t.*
FROM users u,
LATERAL (
    SELECT *
    FROM orders o
    WHERE o.user_id = u.id
    ORDER BY o.created_at DESC
    LIMIT 3
) t;
```

Frecuentemente la opción **más rápida** cuando hay un índice en `(user_id, created_at DESC)` — para cada usuario, la DB hace un index scan chico. Especialmente bueno cuando tenés **pocos usuarios + muchas orders cada uno**.

> MySQL 8.0.14+ también soporta `LATERAL`.

## Solución 4 — `GROUP BY` con array_agg + filter (Postgres)

```sql
SELECT user_id,
       (ARRAY_AGG(o ORDER BY created_at DESC))[1:3] AS last_three
FROM orders o
GROUP BY user_id;
```

Devuelve el top 3 como un array por usuario. Útil para shapear responses JSON.

## Decisión

| Caso | Usar |
|---|---|
| Top-N estándar | Window function (`ROW_NUMBER`) |
| Pocos grupos, muchas filas por grupo | LATERAL con índice en `(group, sort)` |
| Armar response JSON con el top-N inline | `ARRAY_AGG` + slice |
| Evitar (DBs modernas) | Subquery correlacionada |

## Follow-ups comunes

### "¿Y si querés todas las filas empatadas en el rank 3?"
Usar `RANK()` (empates obtienen el mismo rank, gaps después).

### "¿Y si la respuesta debe ser solo el top-1?"
`SELECT DISTINCT ON (user_id) ...` (Postgres) — limpio, rápido, muy idiomático de Postgres.

```sql
SELECT DISTINCT ON (user_id) *
FROM orders
ORDER BY user_id, created_at DESC;
```

### "¿Y para datasets enormes?"
LATERAL con un índice covering `(user_id, created_at DESC) INCLUDE (...)` suele ser el ganador.

## Frase para entrevista

> "Window function with `ROW_NUMBER()` is the default modern answer. For high-row-count tables I'd switch to a LATERAL join with a `(user_id, created_at DESC)` index — the optimizer does small index scans per user instead of sorting everything."
