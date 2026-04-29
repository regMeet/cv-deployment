# CTEs recursivos (jerarquías, grafos)

> Un CTE que se referencia a sí mismo. La única forma de hacer recursión en SQL. Se usa para org charts, threaded comments, paths en grafos.

## Anatomía

```sql
WITH RECURSIVE tree AS (
    -- 1. Anchor: el set inicial
    SELECT id, name, manager_id, 1 AS depth
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    -- 2. Recursivo: referencia el CTE en sí
    SELECT e.id, e.name, e.manager_id, t.depth + 1
    FROM employees e
    JOIN tree t ON e.manager_id = t.id
)
SELECT * FROM tree ORDER BY depth, name;
```

Tres partes:
1. **Anchor query** — filas iniciales (el CEO, los nodos raíz).
2. **`UNION ALL`** — combina anchor + resultados recursivos.
3. **Recursive query** — joinea de vuelta al CTE, agregando el siguiente nivel.

La DB itera: anchor → join → join → ... hasta que la query recursiva produce cero filas nuevas.

## Jerarquías — org chart completo

```sql
WITH RECURSIVE tree AS (
    SELECT id, name, manager_id, 0 AS depth, name AS path
    FROM employees WHERE manager_id IS NULL

    UNION ALL

    SELECT e.id, e.name, e.manager_id, t.depth + 1,
           t.path || ' > ' || e.name
    FROM employees e JOIN tree t ON e.manager_id = t.id
)
SELECT depth, path FROM tree ORDER BY path;
```

Construye un path tipo `CEO > VP Eng > Dir > Manager > Alice`.

## Bottom-up — encontrar ancestros

"¿Cuál es la cadena de managers de Alice?"

```sql
WITH RECURSIVE chain AS (
    SELECT id, name, manager_id, 0 AS depth
    FROM employees WHERE name = 'Alice'

    UNION ALL

    SELECT e.id, e.name, e.manager_id, c.depth + 1
    FROM employees e JOIN chain c ON c.manager_id = e.id
)
SELECT * FROM chain ORDER BY depth;
```

## Grafos — cuidado con ciclos

Si tu data no es un árbol estricto (un empleado en dos equipos, un grafo con ciclos), podés loopear infinito.

Defensas:

1. **Trackear nodos visitados** en el CTE recursivo:

```sql
WITH RECURSIVE tree AS (
    SELECT id, parent_id, ARRAY[id] AS visited
    FROM nodes WHERE parent_id IS NULL

    UNION ALL

    SELECT n.id, n.parent_id, t.visited || n.id
    FROM nodes n JOIN tree t ON n.parent_id = t.id
    WHERE NOT (n.id = ANY(t.visited))   -- saltar ya-visitados
)
SELECT * FROM tree;
```

2. **Cap de profundidad** con `WHERE depth < 100` como red de seguridad.

3. **Postgres 14+**: la cláusula `CYCLE` lo hace automáticamente:

```sql
WITH RECURSIVE tree AS ( ... )
CYCLE id SET is_cycle USING path
```

## Generate series (sin tabla input)

Contar de 1 a 10 con un CTE recursivo:

```sql
WITH RECURSIVE n AS (
    SELECT 1 AS i
    UNION ALL
    SELECT i + 1 FROM n WHERE i < 10
)
SELECT * FROM n;
```

Postgres tiene el más simple `SELECT generate_series(1, 10)`. Los CTEs recursivos son la forma portable.

## Notas de performance

- La recursión puede ser cara. Cada iteración es un join.
- Mantené las queries anchor + recursive lean.
- Indexá `parent_id` (o lo que sea que joineás).
- Para jerarquías muy profundas / enormes, considerá estructuras precomputadas: **closure tables**, **path enumeration**, **nested sets**.

## Cuándo NO usar CTEs recursivos

- Profundidad fija (ej: siempre 3 niveles) → múltiples JOINs es más simple y rápido.
- Agregación no-grafo → CTEs regulares / window functions.

## Frase para entrevista

> "Recursive CTEs walk hierarchies and graphs. Anchor + UNION ALL + recursive query. For graphs you have to defend against cycles — track visited nodes, cap depth, or use the CYCLE clause in modern Postgres. For very deep or hot hierarchies I'd consider precomputed structures like closure tables instead of recursing on read."
