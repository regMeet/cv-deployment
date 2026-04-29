# GROUP BY y agregaciones

> Reducir muchas filas a menos. Los aggregates colapsan un set de filas en un único valor por grupo.

## Funciones de agregación

| Función | Qué |
|---|---|
| `COUNT(*)` | Todas las filas |
| `COUNT(col)` | Filas donde col no es NULL |
| `COUNT(DISTINCT col)` | Valores no-NULL distintos |
| `SUM(col)` | Suma (ignora NULL) |
| `AVG(col)` | Promedio (ignora NULL) |
| `MIN(col)` / `MAX(col)` | Extremos |
| `STRING_AGG(col, ',')` / `LISTAGG` / `GROUP_CONCAT` | Concatenar strings |
| `ARRAY_AGG(col)` | Construir un array (Postgres) |

## GROUP BY básico

```sql
SELECT country, COUNT(*) AS users, AVG(age) AS avg_age
FROM users
GROUP BY country;
```

> Cada columna en `SELECT` debe estar **agregada** o **listada en GROUP BY**.

## HAVING filtra grupos

```sql
SELECT country, COUNT(*) AS n
FROM users
GROUP BY country
HAVING COUNT(*) > 100;          -- filtrar grupos
```

`WHERE` filtra **filas** (antes de agrupar). `HAVING` filtra **grupos** (después de agregar).

## Comportamiento con NULL

- Los aggregates **ignoran NULL** (excepto `COUNT(*)`).
- `GROUP BY` trata NULL como su propio grupo — todos los NULLs van juntos.

```sql
-- conteo de usuarios con email NULL
SELECT COUNT(*) FROM users WHERE email IS NULL;
```

## DISTINCT adentro de aggregates

```sql
SELECT COUNT(DISTINCT country) FROM users;       -- cuántos países únicos
SELECT COUNT(*) FROM users;                      -- cuántos usuarios totales
SELECT AVG(DISTINCT score) FROM ...;             -- promedio de valores distintos (raramente útil)
```

## ROLLUP, CUBE, GROUPING SETS

Computar agregaciones multinivel en una sola query.

```sql
-- subtotales + total general
SELECT country, city, COUNT(*) AS n
FROM users
GROUP BY ROLLUP (country, city);
```

Devuelve: por (country, city), por country, y total general — en una sola pasada.

```sql
-- todas las combinaciones de agrupación
GROUP BY CUBE (country, city);

-- sets explícitos
GROUP BY GROUPING SETS ((country, city), (country), ());
```

Útil para reportes que necesitan múltiples niveles de agregación.

## FILTER — aggregates condicionales

SQL estándar; soportado por Postgres y otros.

```sql
SELECT
    COUNT(*) AS total,
    COUNT(*) FILTER (WHERE active) AS active,
    SUM(amount) FILTER (WHERE status = 'paid') AS paid_revenue
FROM users;
```

Para DBs sin `FILTER`, usar `SUM(CASE WHEN ... THEN 1 ELSE 0 END)` etc.

## Gotchas comunes

### `COUNT(col)` vs `COUNT(*)`

```sql
SELECT COUNT(*), COUNT(email) FROM users;
-- 1000        950   (50 usuarios con email NULL)
```

### Aggregate sobre JOIN infla filas

Un usuario con 10 orders → joineado con orders → fila aparece 10 veces → `SUM(price)` del usuario se multiplica. Agregar primero, después joinear, cuando esto pasa.

## Frase para entrevista

> "Aggregates collapse rows into one per group. WHERE filters rows; HAVING filters groups. Aggregates ignore NULLs except COUNT(*). For multi-level aggregations I use ROLLUP / CUBE / GROUPING SETS, and for conditional counts I prefer FILTER (WHERE …) over the SUM(CASE WHEN …) trick."
