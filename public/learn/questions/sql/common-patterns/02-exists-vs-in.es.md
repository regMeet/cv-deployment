# `EXISTS` vs `IN` vs `JOIN + DISTINCT`

> Tres formas de preguntar "¿las filas en A tienen match en B?". No son equivalentes en semántica ni performance.

## Setup

```
users         orders
              (user_id FK a users.id)
```

Objetivo: usuarios que tienen al menos un order.

## EXISTS

```sql
SELECT u.*
FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);
```

- Para cuando encuentra **un** match por fila externa (semi-join).
- No infla filas.
- Inmune a gotchas de NULL.

**Usalo como default.**

## IN

```sql
SELECT u.*
FROM users u
WHERE u.id IN (SELECT user_id FROM orders);
```

- Conceptualmente equivalente a `EXISTS` para valores **no-NULL**.
- La mayoría de los optimizadores modernos lo convierten al mismo plan que `EXISTS`.
- ⚠️ `NOT IN` está **roto con NULL**: si la subquery devuelve algún NULL, `NOT IN` no devuelve filas. Siempre preferir `NOT EXISTS`.

```sql
-- 💥 si algún order tiene user_id IS NULL, esto no devuelve nada
SELECT * FROM users WHERE id NOT IN (SELECT user_id FROM orders);

-- ✅ seguro
SELECT u.* FROM users u
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);
```

## JOIN + DISTINCT

```sql
SELECT DISTINCT u.*
FROM users u
JOIN orders o ON o.user_id = u.id;
```

- Los joins **inflan** filas — un usuario con 10 orders aparece 10 veces.
- El `DISTINCT` paga el costo de remover duplicados.
- Casi siempre más lento que `EXISTS` para chequeos de "tiene algún match".

> Cuando realmente querés los datos del order, JOIN está bien. Cuando solo querés saber "¿existe?", `EXISTS` es lo correcto.

## Tabla de decisión

| Necesidad | Usar |
|---|---|
| "Usuario tiene algún order" | `EXISTS` |
| "Usuario no tiene order" | `NOT EXISTS` (evitar `NOT IN`) |
| Necesitás columnas de ambas tablas | JOIN |
| Membresía en lista fija | `IN (1,2,3)` |
| Membresía en subquery | `IN` o `EXISTS` (optimizadores modernos suelen ser iguales) |

## Nota de performance real

Para "usuarios con al menos un order":

- **EXISTS / IN con subquery** → semi-join, para al primer match por usuario. Barato.
- **JOIN + DISTINCT** → lee todas las filas matcheantes, después dedup. Caro a escala.

Probalo en `EXPLAIN`. Si ves un JOIN feedeando un HashAggregate sobre millones de filas solo para dedup, cambiá a `EXISTS`.

## Frase para entrevista

> "I default to EXISTS for existence checks — it's a semi-join, doesn't inflate rows, and is immune to the NOT IN/NULL trap. JOIN + DISTINCT works but pays for inflation + dedup. IN is fine for fixed lists; for subqueries with possible NULLs, NOT EXISTS is the safer rewrite of NOT IN."
