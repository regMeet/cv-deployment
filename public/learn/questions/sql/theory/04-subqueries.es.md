# Subqueries — escalar, derivada, correlacionada

> Una query adentro de otra. Tres sabores, cada uno con su uso.

## 1. Subquery escalar

Devuelve **un valor**. Se usa en `SELECT`, `WHERE`, `SET`, etc.

```sql
SELECT u.name,
       (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) AS order_count
FROM users u;
```

O comparada en WHERE:

```sql
SELECT * FROM products
WHERE price > (SELECT AVG(price) FROM products);
```

## 2. Tabla derivada (subquery en FROM)

Devuelve un **resultado tipo tabla** que tratás como tabla virtual.

```sql
SELECT t.country, t.avg_age
FROM (
    SELECT country, AVG(age) AS avg_age
    FROM users
    GROUP BY country
) t
WHERE t.avg_age > 30;
```

CTEs (`WITH`) suelen ser una alternativa más limpia.

## 3. Subquery correlacionada

Referencia una columna de la **query externa**. Se re-evalúa por cada fila externa.

```sql
-- usuarios cuyo último order > $1000
SELECT u.*
FROM users u
WHERE (
    SELECT MAX(total) FROM orders o WHERE o.user_id = u.id
) > 1000;
```

`o.user_id = u.id` referencia el `u` externo. La subquery corre una vez por fila externa.

> Frecuentemente lenta — pero los optimizadores a veces la pueden flatten en joins.

## EXISTS / NOT EXISTS

La forma correlacionada más común. Devuelve booleano. Frecuentemente más claro que `IN` para chequeos de existencia.

```sql
SELECT u.*
FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);
```

> `SELECT 1` es convención — lo que SELECTeás adentro de `EXISTS` es irrelevante.

## IN con subquery

Común, pero cuidado con la **trampa NULL** con `NOT IN`:

```sql
-- ⚠️ si la subquery devuelve algún NULL, NOT IN no devuelve filas
SELECT * FROM users WHERE id NOT IN (SELECT user_id FROM blocked);
```

Preferí `NOT EXISTS` para evitar la trampa.

## Operadores ANY / ALL

```sql
-- equivalente a IN
... WHERE price = ANY (SELECT max_price FROM ...);

-- precio mayor que cada valor devuelto
... WHERE price > ALL (SELECT max_price FROM ...);
```

Raros en práctica. `IN` y `EXISTS` cubren la mayoría de los casos.

## Cuándo usar cada uno

| Necesidad | Usar |
|---|---|
| Un valor en SELECT/WHERE | Subquery escalar |
| Tratar resultado como tabla | Tabla derivada o **CTE** (más limpio) |
| Filtrar por cálculo per-fila | Subquery correlacionada |
| Chequeo de existencia | `EXISTS` / `NOT EXISTS` |
| Chequeo de membresía | `IN` / `NOT IN` (cuidado con NULLs) |

## Frase para entrevista

> "Scalar for single-value lookups, derived/CTE for treating a query result as a table, correlated for per-row checks. For existence I prefer EXISTS — it's clearer than IN and immune to the NOT IN/NULL trap."
