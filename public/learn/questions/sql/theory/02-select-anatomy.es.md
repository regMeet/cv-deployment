# Anatomía de SELECT y orden de ejecución

> Las cláusulas que **escribís** NO son el orden en que **se ejecutan**. Saber el orden lógico explica muchos "por qué no funciona esto".

## Orden escrito

```sql
SELECT   col1, col2, AVG(col3) AS avg3
FROM     orders o
JOIN     users u ON u.id = o.user_id
WHERE    o.created_at >= '2025-01-01'
GROUP BY u.country, col1, col2
HAVING   AVG(col3) > 100
ORDER BY avg3 DESC
LIMIT    10
OFFSET   0;
```

## Orden lógico de ejecución

```
1. FROM        — elegir tablas
2. JOIN        — combinarlas
3. WHERE       — filtrar filas
4. GROUP BY    — agrupar filas
5. HAVING      — filtrar grupos
6. SELECT      — elegir columnas / computar expresiones
7. DISTINCT    — sacar duplicados
8. ORDER BY    — ordenar
9. LIMIT/OFFSET — paginar
```

## Por qué importa

### No podés referenciar un alias en `WHERE`

```sql
SELECT id, price * 1.21 AS final_price
FROM products
WHERE final_price > 100;          -- 💥 final_price todavía no existe en WHERE
```

`SELECT` corre después de `WHERE`. Repetí la expresión en `WHERE`, o wrappeala en una subquery / CTE.

### SÍ podés referenciar un alias en `ORDER BY`

```sql
SELECT id, price * 1.21 AS final_price
FROM products
ORDER BY final_price DESC;        -- ✅ ORDER BY corre después de SELECT
```

### `WHERE` filtra filas; `HAVING` filtra grupos

```sql
SELECT country, COUNT(*) AS n
FROM users
WHERE active = true        -- ✅ filtra filas (antes de agrupar)
GROUP BY country
HAVING COUNT(*) > 100;     -- ✅ filtra grupos (después de agregar)
```

No podés poner `COUNT(*) > 100` en `WHERE` — los aggregates todavía no existen ahí.

## Otras cláusulas que conocer

- **`DISTINCT`** — saca filas duplicadas de la proyección.
- **`UNION` / `UNION ALL`** — apila dos result sets (UNION dedupea, UNION ALL no).
- **`OFFSET`** — saltea las primeras N filas; ⚠️ lento para offsets grandes.
- **`FETCH FIRST n ROWS ONLY`** — equivalente SQL estándar a `LIMIT n`.

## Frase para entrevista

> "The logical order is FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT. That's why aliases work in ORDER BY but not in WHERE, and why aggregates go in HAVING, not WHERE."
