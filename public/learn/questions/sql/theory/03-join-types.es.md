# Tipos de JOIN — INNER / LEFT / RIGHT / FULL / CROSS / SELF

> Los JOINs combinan filas de dos tablas. La diferencia es **qué filas no-matcheantes te quedás**.

## Setup

```
users               orders
┌────┬──────┐       ┌────┬─────────┬────────┐
│ id │ name │       │ id │ user_id │ total  │
├────┼──────┤       ├────┼─────────┼────────┤
│  1 │ Ana  │       │ 10 │       1 │   $50  │
│  2 │ Beto │       │ 20 │       1 │   $80  │
│  3 │ Cris │       │ 30 │       2 │  $200  │
└────┴──────┘       └────┴─────────┴────────┘
                       (sin fila para user 3, sin user para hipotético 99)
```

## INNER JOIN

Solo filas que **matchean en ambas tablas**. Tipo default de JOIN.

```sql
SELECT u.name, o.total
FROM users u
INNER JOIN orders o ON o.user_id = u.id;
```

| name | total |
|---|---|
| Ana | $50 |
| Ana | $80 |
| Beto | $200 |

Cris descartado (sin orders).

## LEFT JOIN (LEFT OUTER JOIN)

**Todas las filas de la tabla izquierda**, con NULLs donde la derecha no tiene match.

```sql
SELECT u.name, o.total
FROM users u
LEFT JOIN orders o ON o.user_id = u.id;
```

| name | total |
|---|---|
| Ana | $50 |
| Ana | $80 |
| Beto | $200 |
| Cris | NULL |

> Uso común: "encontrar filas en A sin match en B" → `LEFT JOIN ... WHERE B.id IS NULL`.

## RIGHT JOIN (RIGHT OUTER JOIN)

Espejo de LEFT. **Todas las filas de la derecha**, NULLs donde la izquierda no tiene match. Raro en práctica — la mayoría swappea operandos y usa LEFT.

## FULL OUTER JOIN

**Todas las filas de ambas**, NULLs donde el otro lado no tiene match.

```sql
SELECT u.name, o.total
FROM users u
FULL OUTER JOIN orders o ON o.user_id = u.id;
```

Resultado incluye Cris (solo izquierda) Y cualquier order huérfana (solo derecha).

> MySQL no soporta FULL OUTER JOIN — lo simulás con `LEFT JOIN UNION RIGHT JOIN`.

## CROSS JOIN

**Producto cartesiano**. Cada fila de A × cada fila de B. Casi siempre no es lo que querés.

```sql
SELECT u.name, p.product
FROM users u
CROSS JOIN products p;            -- N × M filas
```

Útil para generar combinaciones (ej: grilla de día-de-calendario por usuario).

## SELF JOIN

Una tabla joineada consigo misma. Caso de uso: jerarquías, "comparar fila contra fila".

```sql
-- Encontrar pares de usuarios con el mismo dominio de email
SELECT a.name, b.name
FROM users a
JOIN users b ON SPLIT_PART(a.email, '@', 2) = SPLIT_PART(b.email, '@', 2)
            AND a.id < b.id;       -- evitar duplicados y self-pairs
```

## Modelo mental visual

```
INNER:     [ A ∩ B ]
LEFT:      [ A — A∩B se mantiene, A-only con NULL ]
RIGHT:     [ B — igual, espejo ]
FULL:      [ A ∪ B — ambos con NULLs donde falta ]
CROSS:     [ A × B — toda combinación ]
```

## Patrón anti-join

"Filas en A que **no tienen match** en B":

```sql
-- con LEFT JOIN
SELECT u.*
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.id IS NULL;

-- con NOT EXISTS (frecuentemente más claro)
SELECT u.*
FROM users u
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);
```

## Frase para entrevista

> "INNER for matched rows, LEFT for 'all of A plus matches', FULL OUTER for both sides. RIGHT is usually rewritten as LEFT. CROSS is intentional Cartesian. The anti-join pattern (LEFT JOIN + IS NULL or NOT EXISTS) handles 'rows with no match'."
